import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const registerUser = async (request) => {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 },
      );
    }

    //password length check
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password should be atleast 6 characters long",
        },
        { status: 400 },
      );
    }

    //existing user check
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        {
          status: 409,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Register Error", error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
};
