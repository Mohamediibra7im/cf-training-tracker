import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RefreshToken, { hashRefreshToken } from '@/models/RefreshToken';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/rateLimiter';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export const dynamic = 'force-dynamic';

// Rate limiter for bulk token revocation (5 attempts per 10 minutes per IP)
const bulkRevokeLimiter = new RateLimiterMemory({
  points: 5,
  duration: 600, // Per 10 minutes
  blockDuration: 1800, // Block for 30 minutes if exceeded
});

/**
 * Logout endpoint - revokes refresh token server-side
 * Clears refresh token cookie and marks token as revoked in database
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get refresh token from cookie
    const refreshTokenValue = request.cookies.get('refreshToken')?.value;

    if (refreshTokenValue) {
      // Hash the token to find it in database
      const hashedToken = hashRefreshToken(refreshTokenValue);

      // Find and revoke the refresh token
      const refreshTokenDoc = await RefreshToken.findOne({
        token: hashedToken,
        revoked: false,
      });

      if (refreshTokenDoc) {
        // Mark as revoked
        await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, {
          revoked: true,
          revokedAt: new Date(),
        });

        console.log(`Refresh token revoked on logout (jti: ${refreshTokenDoc.jti})`);
      }
    }

    // Create response that clears the refresh token cookie
    const response = NextResponse.json({
      message: 'Logged out successfully',
    });

    // Clear the refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the cookie
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    );

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}

/**
 * Revoke all refresh tokens for a user (useful for security incidents)
 * Requires authentication and authorization:
 * - Users can revoke their own tokens (self-revocation)
 * - Admins can revoke tokens for any user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting - apply before authentication to prevent abuse
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimitResult = await rateLimitRequest(ip, bulkRevokeLimiter);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${rateLimitResult.remainingSeconds} seconds and try again.`,
          retryAfter: rateLimitResult.remainingSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.remainingSeconds),
          },
        }
      );
    }

    // Authenticate the requestor - verify JWT token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication token required' },
        { status: 401 }
      );
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }

    // Connect to database and verify user exists
    await dbConnect();
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - User not found' },
        { status: 401 }
      );
    }

    // Parse request body only after authentication passes
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Authorization check:
    // - Allow self-revocation: authenticated user can revoke their own tokens
    // - Allow admin revocation: admins can revoke tokens for any user
    const isSelfRevocation = currentUser._id.toString() === userId;
    const isAdmin = currentUser.role === 'admin';

    if (!isSelfRevocation && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You can only revoke your own tokens or must be an admin' },
        { status: 403 }
      );
    }

    // Verify the target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Revoke all active refresh tokens for this user
    const result = await RefreshToken.updateMany(
      {
        userId,
        revoked: false,
      },
      {
        revoked: true,
        revokedAt: new Date(),
      }
    );

    const action = isAdmin && !isSelfRevocation ? 'admin' : 'self';
    console.log(
      `Revoked ${result.modifiedCount} refresh tokens for user: ${userId} ` +
      `(action: ${action}, by: ${currentUser.codeforcesHandle})`
    );

    return NextResponse.json({
      message: `Revoked ${result.modifiedCount} refresh tokens`,
      revokedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Bulk token revocation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
