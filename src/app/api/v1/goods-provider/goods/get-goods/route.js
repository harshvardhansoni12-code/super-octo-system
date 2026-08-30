import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getGoodProviderGoods } from "@/services/provider/good-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "GOODS_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only goods providers can access this route" },
        { status: 403 },
      );
    }

    const result = await getGoodProviderGoods(session.user.id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Goods retrieved successfully",
        goods: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET goods error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch goods" },
      { status: 500 },
    );
  }
}
