import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.message },
        { status: data.code || 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: data.user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d", 
      }
    );

    const res = NextResponse.json({
      success: true,
      user: data.user,
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;

  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}