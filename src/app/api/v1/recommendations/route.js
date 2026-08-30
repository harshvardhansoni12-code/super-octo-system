import { NextResponse } from "next/server";
import { getRecommendations } from "@/services/mock/recommendations-mock";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";

    if (!["crop", "service", "good", "buyer"].includes(type)) {
      return NextResponse.json(
        { error: "A valid type (crop|service|good|buyer) is required" },
        { status: 400 },
      );
    }

    const recommendations = getRecommendations(type);

    return NextResponse.json(
      {
        message: "Recommendations fetched successfully",
        recommendations,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET RECOMMENDATIONS API ERROR:", error);

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
