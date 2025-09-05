import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import getUser from "@/utils/codeforces/getUser";
import getRankFromRating from "@/utils/getRankFromRating";
import { validatePassword } from "@/utils/passwordValidation";

export async function POST(req: NextRequest) {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    await dbConnect();
    const { codeforcesHandle, password, confirmPassword } = await req.json();

    if (!codeforcesHandle || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Codeforces handle, password, and password confirmation are required" },
        { status: 400 },
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.errors.join(". ") },
        { status: 400 },
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ codeforcesHandle });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const cfUserResponse = await getUser(codeforcesHandle);
    if (!cfUserResponse.success) {
      return NextResponse.json(
        { message: "Invalid Codeforces handle" },
        { status: 400 },
      );
    }

    const cfUser = cfUserResponse.data;
    const rating = cfUser.rating ?? 0;
    const rank = cfUser.rank ?? getRankFromRating(rating);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      codeforcesHandle,
      password: hashedPassword,
      rating: rating,
      avatar: cfUser.avatar,
      rank: rank,
      maxRating: cfUser.maxRating ?? 0,
      maxRank:
        cfUser.maxRank ??
        (cfUser.maxRating ? getRankFromRating(cfUser.maxRating) : "Unrated"),
      organization: cfUser.organization,
      lastSyncTime: Date.now(),
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
