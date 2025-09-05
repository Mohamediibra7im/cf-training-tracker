import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { verifyAdmin } from "@/lib/adminAuth";

// GET - Fetch all notifications for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { error } = await verifyAdmin(request);
    if (error) return error;

    const notifications = await Notification.find({})
      .populate("createdBy", "codeforcesHandle")
      .sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new notification
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { user, error } = await verifyAdmin(request);
    if (error) return error;

    const {
      title,
      message,
      type = "info",
      priority = "medium",
      targetAudience = "all",
      expiresAt
    } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { message: "Title and message are required" },
        { status: 400 }
      );
    }

    const notification = new Notification({
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      targetAudience,
      createdBy: user._id,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    await notification.save();
    await notification.populate("createdBy", "codeforcesHandle");

    return NextResponse.json(
      { message: "Notification created successfully", notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update notification
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { error } = await verifyAdmin(request);
    if (error) return error;

    const {
      id,
      title,
      message,
      type,
      priority,
      targetAudience,
      isActive,
      expiresAt
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      title: string;
      message: string;
      type: string;
      priority: string;
      targetAudience: string;
      isActive: boolean;
      expiresAt: Date | null;
    }> = {};

    if (title !== undefined) updateData.title = title.trim();
    if (message !== undefined) updateData.message = message.trim();
    if (type !== undefined) updateData.type = type;
    if (priority !== undefined) updateData.priority = priority;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const notification = await Notification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("createdBy", "codeforcesHandle");

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification updated successfully",
      notification
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { error } = await verifyAdmin(request);
    if (error) return error;

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification permanently deleted from system",
      deletedNotification: {
        title: notification.title,
        type: notification.type,
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}