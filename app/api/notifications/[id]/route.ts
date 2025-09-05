import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import UserNotification from "@/models/UserNotification";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const notificationId = resolvedParams.id;

    const url = new URL(request.url);
    const globalDelete = url.searchParams.get("global") === "true";

    console.log("Attempting to delete notification:", notificationId);
    console.log("User ID:", decoded.userId);
    console.log("Global delete:", globalDelete);

    // Validate ObjectId format
    if (!notificationId || typeof notificationId !== 'string' || notificationId.length !== 24) {
      return NextResponse.json(
        { message: "Invalid notification ID format" },
        { status: 400 }
      );
    }

    // Validate that notification exists and user has access to it
    const notification = await Notification.findById(notificationId);
    if (!notification || !notification.isActive) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this notification
    const user = await User.findById(decoded.userId);
    const targetAudiences = user.role === "admin" ? ["all", "admins"] : ["all", "users"];

    if (!targetAudiences.includes(notification.targetAudience)) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    if (globalDelete) {
      // Global delete: Only admins can completely remove notifications from database
      if (user.role !== "admin") {
        return NextResponse.json(
          { message: "Insufficient permissions for global delete" },
          { status: 403 }
        );
      }

      // Delete notification completely from database
      await Notification.findByIdAndDelete(notificationId);

      // Also remove all associated UserNotification records
      await UserNotification.deleteMany({
        notification: notificationId,
      });

      console.log("Notification globally deleted by admin:", user.codeforcesHandle, "notification:", notificationId);

      return NextResponse.json({
        message: "Notification permanently deleted from system",
      });
    } else {
      await UserNotification.findOneAndDelete({
        user: decoded.userId,
        notification: notificationId,
      });

      // Create a permanent "deleted" record to ensure this notification never shows for this user again
      await UserNotification.create({
        user: decoded.userId,
        notification: notificationId,
        isRead: true,
        readAt: new Date(),
        isHidden: true,
      });

      console.log("Notification permanently removed for user:", decoded.userId, "notification:", notificationId);

      return NextResponse.json({
        message: "Notification deleted successfully",
      });
    }
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
