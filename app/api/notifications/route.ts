import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import UserNotification from "@/models/UserNotification";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// GET - Fetch notifications for the current user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { user, error } = await getUserFromToken(request);
    if (error) return error;

    const now = new Date();

    // Get active notifications for the user's audience
    const targetAudiences = user.role === "admin" ? ["all", "admins"] : ["all", "users"];

    const notifications = await Notification.find({
      isActive: true,
      targetAudience: { $in: targetAudiences },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
      .populate("createdBy", "codeforcesHandle")
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    // Get read status and hidden status for each notification
    const userNotifications = await UserNotification.find({
      user: user._id,
      notification: { $in: notifications.map(n => n._id) }
    }).lean();

    const readNotificationIds = new Set(
      userNotifications.map(un => un.notification.toString())
    );

    const hiddenNotificationIds = new Set(
      userNotifications
        .filter(un => un.isHidden)
        .map(un => un.notification.toString())
    );

    const notificationsWithReadStatus = notifications
      .filter(notification => !hiddenNotificationIds.has(String(notification._id))) // Exclude hidden notifications
      .map((notification) => ({
        ...notification,
        isRead: readNotificationIds.has(String(notification._id))
      }));

    return NextResponse.json(notificationsWithReadStatus);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
