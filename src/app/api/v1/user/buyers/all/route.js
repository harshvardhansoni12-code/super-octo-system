import { NextResponse } from "next/server";
import { listBuyers } from "@/services/mock/buyers-mock";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const buyers = listBuyers(q);

    return NextResponse.json(
      {
        message: "Buyers fetched successfully",
        buyers,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET BUYERS API ERROR:", error);

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
