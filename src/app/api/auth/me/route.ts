import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  verifyToken,
  getTokenFromRequest,
  getTokenFromCookies,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request) || getTokenFromCookies(request);

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { user: { id: user._id, email: user.email, createdAt: user.createdAt } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
