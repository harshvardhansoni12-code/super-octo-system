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

export async function updateCrop(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  const { searchParams } = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const cropId =
    body.id ||
    body.cropId ||
    searchParams.get("id") ||
    searchParams.get("cropId");

  if (!cropId) {
    return {
      error: "Crop ID is required",
      status: 400,
    };
  }

  const existingCrop = await prisma.crops.findUnique({
    where: { id: cropId },
  });

  if (!existingCrop) {
    return {
      error: "Crop not found",
      status: 404,
    };
  }

  // Check authorization: Admin can update any crop, User can only update their own
  if (session.user.role !== "ADMIN" && existingCrop.userId !== session.user.id) {
    return {
      error: "Forbidden: You do not have permission to update this crop",
      status: 403,
    };
  }

  const { name, type, area, quantity, price } = body;

  const updateData = {};
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return { error: "Name must be a non-empty string", status: 400 };
    }
    updateData.name = name.trim();
  }

  if (type !== undefined) {
    if (typeof type !== "string" || !type.trim()) {
      return { error: "Type must be a non-empty string", status: 400 };
    }
    updateData.type = type.trim();
  }

  if (area !== undefined) {
    const parsedArea = Number(area);
    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { error: "Area must be a positive number", status: 400 };
    }
    updateData.area = parsedArea;
  }

  if (quantity !== undefined) {
    const parsedQty = Number(quantity);
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      return { error: "Quantity must be a positive number", status: 400 };
    }
    updateData.quantity = parsedQty;
  }

  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return { error: "Price must be a positive number", status: 400 };
    }
    updateData.price = parsedPrice;
  }

  const updatedCrop = await prisma.crops.update({
    where: { id: cropId },
    data: updateData,
  });

  return {
    crop: updatedCrop,
    status: 200,
  };
}

export async function deleteCrop(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  const { searchParams } = new URL(request.url);
  let cropId = searchParams.get("id") || searchParams.get("cropId");

  if (!cropId) {
    try {
      const body = await request.json();
      cropId = body.id || body.cropId;
    } catch (e) {
      // Body may not be provided in DELETE
    }
  }

  if (!cropId) {
    return {
      error: "Crop ID is required",
      status: 400,
    };
  }

  const existingCrop = await prisma.crops.findUnique({
    where: { id: cropId },
  });

  if (!existingCrop) {
    return {
      error: "Crop not found",
      status: 404,
    };
  }

  // Check authorization: Admin can delete any crop, User can only delete their own
  if (session.user.role !== "ADMIN" && existingCrop.userId !== session.user.id) {
    return {
      error: "Forbidden: You do not have permission to delete this crop",
      status: 403,
    };
  }

  const deletedCrop = await prisma.crops.delete({
    where: { id: cropId },
  });

  return {
    message: "Crop deleted successfully",
    crop: deletedCrop,
    status: 200,
  };
}