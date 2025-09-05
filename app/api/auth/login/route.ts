import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { syncUserProfile, shouldSyncProfile } from "@/utils/syncUserProfile";
import { loginLimiter, rateLimitRequest } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Get client IP for rate limiting
  const ip = req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Check if this IP is already rate limited
  const rateLimitResult = await rateLimitRequest(ip, loginLimiter);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        message: `You have made too many requests. Please wait ${rateLimitResult.remainingSeconds} seconds and try again.`,
        retryAfter: rateLimitResult.remainingSeconds
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.remainingSeconds)
        }
      }
    );
  }

  try {
    await dbConnect();
    const { codeforcesHandle, password } = await req.json();

    if (!codeforcesHandle || !password) {
      return NextResponse.json(
        { message: "Codeforces handle and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ codeforcesHandle });
    if (!user) {
      // Consume more points for invalid username to discourage user enumeration
      await loginLimiter.consume(ip, 2);
      return NextResponse.json({ message: "Wrong Handle" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Consume more points for invalid password
      await loginLimiter.consume(ip, 1);
      return NextResponse.json({ message: "Wrong Password" }, { status: 401 });
    }

    // Check if profile sync is needed and update if necessary
    let updatedUser = user;
    if (shouldSyncProfile(user.lastSyncTime)) {
      const syncData = await syncUserProfile(user.codeforcesHandle);
      if (syncData) {
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            rating: syncData.rating,
            rank: syncData.rank,
            maxRating: syncData.maxRating,
            maxRank: syncData.maxRank,
            organization: syncData.organization,
            lastSyncTime: syncData.lastSyncTime,
            avatar: syncData.avatar,
          },
          { new: true }
        );
      }
    }

    const token = jwt.sign({ userId: updatedUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "14d",
    });

    return NextResponse.json({
      user: {
        _id: updatedUser._id,
        codeforcesHandle: updatedUser.codeforcesHandle,
        rating: updatedUser.rating,
        avatar: updatedUser.avatar,
        rank: updatedUser.rank,
        maxRating: updatedUser.maxRating,
        maxRank: updatedUser.maxRank,
        organization: updatedUser.organization,
        lastSyncTime: updatedUser.lastSyncTime,
        role: updatedUser.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    // Don't count server errors against rate limit
    try {
      await loginLimiter.reward(ip);
    } catch (rewardError) {
      console.error("Error rewarding rate limit points:", rewardError);
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
