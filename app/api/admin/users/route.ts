import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin users API called');

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);

    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    console.log('Token decoded:', !!decoded, decoded?.userId);

    if (!decoded) {
      console.log('❌ Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    const currentUser = await User.findById(decoded.userId);
    console.log('Current user:', currentUser?.codeforcesHandle, 'Role:', currentUser?.role);

    if (!currentUser || currentUser.role !== 'admin') {
      console.log('❌ User is not admin');
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all users with selected fields
    const users = await User.find({})
      .select('codeforcesHandle role rating rank avatar createdAt')
      .sort({ createdAt: -1 });

    console.log(`✅ Successfully fetched ${users.length} users`);
    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    // Log full error details server-side only
    console.error('❌ Error fetching users:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    // Return only generic error message to client
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Update user role (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAuth(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role || !['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await dbConnect();
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Prevent admin from removing their own admin role
    if (decoded.userId === userId && role !== 'admin') {
      return NextResponse.json({
        error: 'You cannot remove your own admin privileges'
      }, { status: 400 });
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('codeforcesHandle role rating rank avatar createdAt');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
