import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/adminAuth";

// GET - Fetch admin dashboard statistics (optimized)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { error } = await verifyAdmin(request);
    if (error) return error;

    // Use Promise.all for parallel execution to speed up data fetching
    const [notificationStats, userStats] = await Promise.all([
      // Aggregate notifications for better performance
      Notification.aggregate([
        {
          $group: {
            _id: null,
            totalNotifications: { $sum: 1 },
            activeNotifications: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
            }
          }
        }
      ]),

      // Aggregate users for better performance
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            adminUsers: {
              $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const stats = {
      activeNotifications: notificationStats[0]?.activeNotifications || 0,
      totalNotifications: notificationStats[0]?.totalNotifications || 0,
      totalUsers: userStats[0]?.totalUsers || 0,
      adminUsers: userStats[0]?.adminUsers || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
