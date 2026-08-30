import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { updateGood } from "@/services/provider/good-service";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "GOODS_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only goods providers can update goods" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const goodId =
      body.goodId ||
      body.id ||
      searchParams.get("id") ||
      searchParams.get("goodId");

    if (!goodId) {
      return NextResponse.json(
        { error: "Good ID is required" },
        { status: 400 },
      );
    }

    const result = await updateGood(session.user.id, goodId, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Good updated successfully",
        good: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("PUT good error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update good" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  return PUT(request);
}
