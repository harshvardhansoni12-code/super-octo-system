import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function createAdmin(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password should be at least 6 characters long" },
        { status: 400 },
      );
    }

    const adminExists = await prisma.admin.findUnique({
      where: { email },
    });

    if (adminExists) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Failed to create admin" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: admin.name,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin creation error", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
