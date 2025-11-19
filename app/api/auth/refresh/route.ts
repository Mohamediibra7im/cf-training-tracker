import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken, { generateRefreshToken, hashRefreshToken } from '@/models/RefreshToken';
import { refreshLimiter, rateLimitRequest } from '@/lib/rateLimiter';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Refresh token endpoint - secure token rotation flow
 * Validates refresh token from cookie, rotates tokens, and issues new access/refresh tokens
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get client IP for rate limiting and optional IP binding
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Apply rate limiting to prevent abuse
    const rateLimitResult = await rateLimitRequest(ip, refreshLimiter);
    if (!rateLimitResult.success) {
      console.warn(`Refresh token rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        {
          error: 'Too many refresh attempts. Please wait before trying again.',
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

    // Get refresh token from httpOnly cookie
    const refreshTokenValue = request.cookies.get('refreshToken')?.value;

    if (!refreshTokenValue) {
      console.warn('Refresh attempt without token cookie');
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 401 }
      );
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = hashRefreshToken(refreshTokenValue);

    // Connect to database
    await dbConnect();

    // Find the refresh token in database
    const refreshTokenDoc = await RefreshToken.findOne({
      token: hashedToken,
      revoked: false,
    });

    if (!refreshTokenDoc) {
      console.warn(`Invalid or revoked refresh token attempted from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Check if token has expired
    if (refreshTokenDoc.expiresAt < new Date()) {
      console.warn(`Expired refresh token attempted (jti: ${refreshTokenDoc.jti})`);
      // Mark as revoked for cleanup
      await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, {
        revoked: true,
        revokedAt: new Date(),
      });
      return NextResponse.json(
        { error: 'Refresh token has expired' },
        { status: 401 }
      );
    }

    // Optional: Verify IP address matches (if IP binding is enabled)
    if (refreshTokenDoc.ipAddress && refreshTokenDoc.ipAddress !== ip && refreshTokenDoc.ipAddress !== 'unknown') {
      console.warn(`IP mismatch for refresh token (jti: ${refreshTokenDoc.jti}). Expected: ${refreshTokenDoc.ipAddress}, Got: ${ip}`);
      // Don't reject immediately - log for security monitoring
      // You can uncomment the return below to enable strict IP binding
      // return NextResponse.json(
      //   { error: 'Security violation detected' },
      //   { status: 403 }
      // );
    }

    // Verify user still exists and is active
    const user = await User.findById(refreshTokenDoc.userId);

    if (!user) {
      console.warn(`User not found for refresh token (jti: ${refreshTokenDoc.jti})`);
      // Revoke the token
      await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, {
        revoked: true,
        revokedAt: new Date(),
      });
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Token rotation: Generate new refresh token
    const newRefreshTokenValue = generateRefreshToken();
    const newHashedToken = hashRefreshToken(newRefreshTokenValue);
    const newJti = crypto.randomUUID();

    // Get device info for the new token
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceInfo = userAgent.substring(0, 100);

    // Calculate new expiry (30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Revoke old refresh token (token rotation)
    await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, {
      revoked: true,
      revokedAt: new Date(),
    });

    // Create new refresh token
    await RefreshToken.create({
      jti: newJti,
      userId: user._id,
      token: newHashedToken,
      expiresAt,
      deviceInfo,
      ipAddress: ip,
      revoked: false,
    });

    // Generate new short-lived access token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: '15m',
      }
    );

    // Create response with new access token
    const response = NextResponse.json({
      user: {
        _id: user._id,
        codeforcesHandle: user.codeforcesHandle,
        rating: user.rating,
        avatar: user.avatar,
        rank: user.rank,
        maxRating: user.maxRating,
        maxRank: user.maxRank,
        organization: user.organization,
        lastSyncTime: user.lastSyncTime,
        role: user.role,
      },
      token: accessToken,
    });

    // Set new refresh token as secure, httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('refreshToken', newRefreshTokenValue, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
