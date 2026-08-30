import prisma from "@/lib/prisma";

const VALID_CATEGORIES = [
  "SEEDS",
  "FERTILIZER",
  "PESTICIDE",
  "EQUIPMENT",
  "IRRIGATION",
  "OTHER",
];

/**
 * Create a new good for a goods provider
 */
export async function createGood(goodProviderId, data) {
  try {
    const { name, category, price, stock, unit, description, imageUrl } = data;

    // Validate required fields
    if (!name || !category) {
      return {
        error: "Good name and category are required",
        status: 400,
      };
    }

    const formattedCategory = category.toUpperCase().trim();
    if (!VALID_CATEGORIES.includes(formattedCategory)) {
      return {
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        status: 400,
      };
    }

    // Verify the goods provider exists
    const goodProvider = await prisma.goodProvider.findUnique({
      where: { id: goodProviderId },
    });

    if (!goodProvider) {
      return {
        error: "Goods provider not found",
        status: 404,
      };
    }

    // Create the good
    const good = await prisma.good.create({
      data: {
        name: name.trim(),
        category: formattedCategory,
        price: price !== undefined && price !== null ? parseFloat(price) : null,
        stock: stock !== undefined && stock !== null ? parseInt(stock, 10) : null,
        unit: unit ? unit.trim() : null,
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        goodProviderId,
      },
    });

    return {
      data: good,
      status: 201,
    };
  } catch (error) {
    console.error("Create good error:", error);
    return {
      error: error.message || "Failed to create good",
      status: 500,
    };
  }
}

/**
 * Get all goods for a specific goods provider
 */
export async function getGoodProviderGoods(goodProviderId) {
  try {
    const goodProvider = await prisma.goodProvider.findUnique({
      where: { id: goodProviderId },
    });

    if (!goodProvider) {
      return {
        error: "Goods provider not found",
        status: 404,
      };
    }

    const goods = await prisma.good.findMany({
      where: { goodProviderId },
      orderBy: { createdAt: "desc" },
    });

    return {
      data: goods,
      status: 200,
    };
  } catch (error) {
    console.error("Get goods error:", error);
    return {
      error: error.message || "Failed to fetch goods",
      status: 500,
    };
  }
}

/**
 * Get all goods across providers
 */
export async function getAllGoods() {
  try {
    const goods = await prisma.good.findMany({
      include: {
        goodProvider: {
          select: {
            id: true,
            name: true,
            companyName: true,
            phone: true,
            location: true,
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      data: goods,
      status: 200,
    };
  } catch (error) {
    console.error("Get all goods error:", error);
    return {
      error: error.message || "Failed to fetch goods",
      status: 500,
    };
  }
}

/**
 * Update a good for a goods provider
 */
export async function updateGood(goodProviderId, goodId, data) {
  try {
    const { name, category, price, stock, unit, description, imageUrl } = data;

    const good = await prisma.good.findUnique({
      where: { id: goodId },
    });

    if (!good) {
      return {
        error: "Good not found",
        status: 404,
      };
    }

    if (good.goodProviderId !== goodProviderId) {
      return {
        error: "Unauthorized: This good does not belong to you",
        status: 403,
      };
    }

    let formattedCategory;
    if (category) {
      formattedCategory = category.toUpperCase().trim();
      if (!VALID_CATEGORIES.includes(formattedCategory)) {
        return {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
          status: 400,
        };
      }
    }

    const updatedGood = await prisma.good.update({
      where: { id: goodId },
      data: {
        ...(name && { name: name.trim() }),
        ...(formattedCategory && { category: formattedCategory }),
        ...(price !== undefined && {
          price: price !== null ? parseFloat(price) : null,
        }),
        ...(stock !== undefined && {
          stock: stock !== null ? parseInt(stock, 10) : null,
        }),
        ...(unit !== undefined && { unit: unit ? unit.trim() : null }),
        ...(description !== undefined && {
          description: description ? description.trim() : null,
        }),
        ...(imageUrl !== undefined && {
          imageUrl: imageUrl ? imageUrl.trim() : null,
        }),
      },
    });

    return {
      data: updatedGood,
      status: 200,
    };
  } catch (error) {
    console.error("Update good error:", error);
    return {
      error: error.message || "Failed to update good",
      status: 500,
    };
  }
}

/**
 * Delete a good for a goods provider
 */
export async function deleteGood(goodProviderId, goodId) {
  try {
    const good = await prisma.good.findUnique({
      where: { id: goodId },
    });

    if (!good) {
      return {
        error: "Good not found",
        status: 404,
      };
    }

    if (good.goodProviderId !== goodProviderId) {
      return {
        error: "Unauthorized: This good does not belong to you",
        status: 403,
      };
    }

    const deletedGood = await prisma.good.delete({
      where: { id: goodId },
    });

    return {
      data: deletedGood,
      status: 200,
    };
  } catch (error) {
    console.error("Delete good error:", error);
    return {
      error: error.message || "Failed to delete good",
      status: 500,
    };
  }
}
