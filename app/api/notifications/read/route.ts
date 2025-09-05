import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserNotification from "@/models/UserNotification";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";

async function getUserFromToken(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const decoded = await verifyAuth(token);
  if (!decoded) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
      user: null,
    };
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return {
      error: NextResponse.json({ message: "User not found" }, { status: 404 }),
      user: null,
    };
  }

  return { error: null, user };
}

// POST - Mark a notification as read
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { user, error } = await getUserFromToken(request);
    if (error) return error;

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    await UserNotification.findOneAndUpdate(
      { user: user._id, notification: notificationId },
      {
        isRead: true,
        readAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
