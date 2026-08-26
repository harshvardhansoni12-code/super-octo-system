import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createCrop(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  if (session.user.role !== "USER") {
    return NextResponse.json(
      { error: "Only users can create crops" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { name, type, area, quantity, price } = body;

  if (!name || !type || !Number.isFinite(area) || area <= 0) {
    return NextResponse.json(
      { error: "Name, type, and a positive area are required" },
      { status: 400 },
    );
  }

  const crop = await prisma.crops.create({
    data: {
      name,
      type,
      area,
      quantity,
      price,
      userId: session.user.id,
    },
  });

  return NextResponse.json(
    { message: "Crop created successfully", crop },
    { status: 201 },
  );
}
