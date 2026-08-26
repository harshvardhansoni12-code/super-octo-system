import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createCrop(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  // ADMIN CANNOT CREATE CROPS
  if (session.user.role !== "USER") {
    return {
      error: "Only users can create crops",
      status: 403,
    };
  }

  const body = await request.json();

  const {
    name,
    type,
    area,
    quantity,
    price,
  } = body;

  if (
    !name ||
    !type ||
    !Number.isFinite(area) ||
    area <= 0
  ) {
    return {
      error:
        "Name, type, and a positive area are required",
      status: 400,
    };
  }

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return {
      error:
        "A positive quantity is required",
      status: 400,
    };
  }

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return {
      error:
        "A positive price is required",
      status: 400,
    };
  }

  const crop = await prisma.crops.create({
    data: {
      name: name.trim(),
      type: type.trim(),
      area,
      quantity,
      price,
      userId: session.user.id,
    },
  });

  return {
    crop,
  };
}


export async function getCrops() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  let crops;

  // ADMIN → ALL CROPS
  if (session.user.role === "ADMIN") {
    crops = await prisma.crops.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // USER → ONLY THEIR CROPS
  else if (session.user.role === "USER") {
    crops = await prisma.crops.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ANY OTHER ROLE → DENY
  else {
    return {
      error: "Invalid user role",
      status: 403,
    };
  }

  return {
    crops,
  };
}