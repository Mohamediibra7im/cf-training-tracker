import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { validatePassword } from "@/utils/passwordValidation";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // This part handles the "Forgot Password" flow
    if (body.resetToken) {
      if (!body.newPassword) {
        return NextResponse.json(
          { message: "New password is required." },
          { status: 400 },
        );
      }

      // Validate password strength
      const passwordValidation = validatePassword(body.newPassword);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { message: passwordValidation.errors.join(". ") },
          { status: 400 },
        );
      }

      const decoded = jwt.verify(body.resetToken, process.env.JWT_SECRET!) as {
        userId: string;
      };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      const hashedNewPassword = await bcrypt.hash(body.newPassword, 10);
      await User.findByIdAndUpdate(decoded.userId, { password: hashedNewPassword });

      return NextResponse.json({ message: "Password has been reset successfully." });
    }

    // This part handles the simple reset for logged-in users
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        { message: "Both current and new passwords are required." },
        { status: 400 },
      );
    }

    // Validate new password strength
    const passwordValidation = validatePassword(body.newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.errors.join(". ") },
        { status: 400 },
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(body.oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password." },
        { status: 401 },
      );
    }

    const hashedNewPassword = await bcrypt.hash(body.newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedNewPassword });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
