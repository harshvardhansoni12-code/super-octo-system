import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { jwt } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    //emial password check
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password required",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findOne({
      where: { email },
    });
    //no user found
    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 400 },
      );
    }

    const match = await bcrypt.compare(password, user.password);

    // wronf password
    if (!match) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 400 },
      );
    }

    const tokenvalue = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7days
    const refresh_token = await prisma.refresh_token.create({
      data: {
        token: tokenvalue,
        revoked: false,
        expiresAt,
        user: {
          connect: { id: user.id },
        },
      },
    });
    const jwt_token = await jwt.sign(user.id, process.env.SECRET_KEY);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", jwt_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // one day
      path: "/",
    });
    cookieStore.set("refresh_token", refresh_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // one week
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login Successfull",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Login Error", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
