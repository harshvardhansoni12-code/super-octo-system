import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteGood } from "@/services/provider/good-service";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "GOODS_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only goods providers can delete goods" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    let goodId = searchParams.get("id") || searchParams.get("goodId");

    if (!goodId) {
      try {
        const body = await request.json();
        goodId = body.id || body.goodId;
      } catch (e) {
        // Body might be empty in DELETE request
      }
    }

    if (!goodId) {
      return NextResponse.json(
        { error: "Good ID is required" },
        { status: 400 },
      );
    }

    const result = await deleteGood(session.user.id, goodId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Good deleted successfully",
        good: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("DELETE good error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete good" },
      { status: 500 },
    );
  }
}
