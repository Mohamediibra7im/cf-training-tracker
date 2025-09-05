import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function verifyAdmin(request: NextRequest) {
  try {
    await dbConnect();

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

    if (user.role !== "admin") {
      return {
        error: NextResponse.json({ message: "Access denied. Admin role required." }, { status: 403 }),
        user: null,
      };
    }

    return { error: null, user };
  } catch (error) {
    console.error("Admin verification error:", error);
    return {
      error: NextResponse.json({ message: "Internal server error" }, { status: 500 }),
      user: null,
    };
  }
}
