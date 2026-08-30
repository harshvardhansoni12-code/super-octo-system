import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function registerGoodProvider(request) {
  try {
    const { name, email, password, companyName, phone, location, goods } =
      await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password should be at least 6 characters long" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    const existingServiceProvider = await prisma.serviceProvider.findUnique({
      where: { email },
    });
    const existingGoodProvider = await prisma.goodProvider.findUnique({
      where: { email },
    });

    if (
      existingUser ||
      existingAdmin ||
      existingServiceProvider ||
      existingGoodProvider
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const goodProvider = await prisma.goodProvider.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "GOODS_PROVIDER",
        companyName: companyName || null,
        phone: phone || null,
        location: location || null,
        services: goods || null,
      },
    });

    return NextResponse.json(
      {
        message: "Goods provider registered successfully",
        goodProvider,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Goods provider registration error", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function loginGoodProvider(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const provider = await prisma.goodProvider.findUnique({
      where: { email },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Invalid goods provider credentials" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid goods provider credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        message: "Goods provider login successful",
        provider: {
          id: provider.id,
          name: provider.name,
          email: provider.email,
          role: provider.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Goods provider login error", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
