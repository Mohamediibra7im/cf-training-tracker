import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Training from '@/models/Training';
import UpsolvedProblem from '@/models/UpsolvedProblem';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get user statistics (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAuth(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    // Verify current user is admin
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId } = params;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all training sessions for this user
    const trainings = await Training.find({ user: userId }).sort({ startTime: -1 });

    // Get upsolved problems for this user
    const upsolvedProblems = await UpsolvedProblem.find({ user: userId });

    // Calculate statistics
    const totalSessions = trainings.length;
    const totalProblems = trainings.reduce((acc, session) => acc + session.problems.length, 0);
    const solvedProblems = trainings.reduce((acc, session) =>
      acc + session.problems.filter((p: any) => p.solvedTime).length, 0
    );
    const upsolvedCount = upsolvedProblems.length;
    const upsolvedSolvedCount = upsolvedProblems.filter((p: any) => p.solvedTime).length;

    const averagePerformance = totalSessions > 0
      ? Math.round(trainings.reduce((acc, session) => acc + session.performance, 0) / totalSessions)
      : 0;

    const bestPerformance = totalSessions > 0
      ? Math.max(...trainings.map(session => session.performance))
      : 0;

    const worstPerformance = totalSessions > 0
      ? Math.min(...trainings.map(session => session.performance))
      : 0;

    const solvingRate = totalProblems > 0
      ? Math.round((solvedProblems / totalProblems) * 100)
      : 0;

    const averageRating = totalSessions > 0
      ? Math.round(trainings.reduce((acc, session) => {
          const sessionRatings = Object.values(session.customRatings);
          const sessionAvg = sessionRatings.reduce((sum: number, rating: number) => sum + rating, 0) / sessionRatings.length;
          return acc + sessionAvg;
        }, 0) / totalSessions)
      : 0;

    const recentTrend = totalSessions >= 2
      ? trainings[0].performance - trainings[1].performance
      : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentSessions = trainings.filter(t => t.startTime >= thirtyDaysAgo).length;

    return NextResponse.json({
      user: {
        codeforcesHandle: user.codeforcesHandle,
        rating: user.rating,
        rank: user.rank,
        maxRating: user.maxRating,
        maxRank: user.maxRank,
      },
      stats: {
        totalSessions,
        totalProblems,
        solvedProblems,
        upsolvedCount,
        upsolvedSolvedCount,
        averagePerformance,
        bestPerformance,
        worstPerformance,
        solvingRate,
        averageRating,
        recentTrend,
        recentSessions,
      },
      trainings: trainings.slice(0, 10).map(t => ({
        id: t._id,
        startTime: t.startTime,
        endTime: t.endTime,
        performance: t.performance,
        problemsCount: t.problems.length,
        solvedCount: t.problems.filter((p: any) => p.solvedTime).length,
      })),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

