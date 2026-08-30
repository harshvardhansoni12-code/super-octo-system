import { NextResponse } from "next/server";
import { getAllGoods } from "@/services/provider/good-service";

export async function GET() {
  try {
    const result = await getAllGoods();

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
    console.error("GET all goods error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch goods" },
      { status: 500 },
    );
  }
}
