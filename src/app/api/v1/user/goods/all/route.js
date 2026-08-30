import { NextResponse } from "next/server";
import { listGoods } from "@/services/mock/goods-mock";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const goods = listGoods(q);

    return NextResponse.json(
      {
        message: "Goods fetched successfully",
        goods,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET GOODS API ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
