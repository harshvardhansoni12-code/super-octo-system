import { NextResponse } from "next/server";
import { getCrops } from "@/services/user/crop-service";

export async function GET() {
  try {
    const result = await getCrops();

    if (result?.error) {
      return NextResponse.json(
        {
          error: result.error,
        },
        {
          status: result.status || 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Crops fetched successfully",
        crops: result.crops,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "GET CROPS API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}