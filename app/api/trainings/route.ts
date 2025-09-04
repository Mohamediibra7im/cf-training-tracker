import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import dbConnect from "@/lib/mongodb";
import Training from "@/models/Training";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

async function getUserFromToken(request: NextRequest) {
  const rateLimitResponse = await rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;
  await dbConnect(); // Ensure DB connection before any query
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const decoded = await verifyAuth(token);
  if (!decoded) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return {
      error: NextResponse.json({ message: "User not found" }, { status: 404 }),
    };
  }
  return { user };
}

export async function POST(req: NextRequest) {
  const userResult = await getUserFromToken(req);
  if (userResult instanceof NextResponse) {
    return userResult;
  }
  const { error, user } = userResult;
  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const newTraining = new Training({
      ...body,
      user: user?._id,
    });
    await newTraining.save();
    return NextResponse.json(
      { message: "Training saved successfully", training: newTraining },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving training:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const userResult = await getUserFromToken(req);
  if (userResult instanceof NextResponse) {
    return userResult;
  }
  const { error, user } = userResult;
  if (error) {
    return error;
  }

  try {
    const trainings = await Training.find({ user: user?._id }).sort({
      startTime: -1,
    });
    return NextResponse.json(trainings);
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
