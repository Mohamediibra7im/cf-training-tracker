import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
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

// GET - Get unread notification count
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { user, error } = await getUserFromToken(request);
    if (error) return error;

    const now = new Date();
    const targetAudiences = user.role === "admin" ? ["all", "admins"] : ["all", "users"];

    // Get all active notifications for the user's audience
    const activeNotifications = await Notification.find({
      isActive: true,
      targetAudience: { $in: targetAudiences },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).select("_id");

    const activeNotificationIds = activeNotifications.map(n => n._id);

    // Get read and hidden notifications
    const userNotifications = await UserNotification.find({
      user: user._id,
      notification: { $in: activeNotificationIds }
    }).select("notification isRead isHidden");

    const readNotificationIds = new Set(
      userNotifications
        .filter(un => un.isRead)
        .map(un => un.notification.toString())
    );

    const hiddenNotificationIds = new Set(
      userNotifications
        .filter(un => un.isHidden)
        .map(un => un.notification.toString())
    );

    // Calculate unread count (exclude both read and hidden notifications)
    const unreadCount = activeNotificationIds.filter(
      id => !readNotificationIds.has(id.toString()) && !hiddenNotificationIds.has(id.toString())
    ).length;

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
