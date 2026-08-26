import { NextResponse } from "next/server";
import { createCrop } from "@/services/user/crop-service";

export async function POST(request) {
  try {
    const result = await createCrop(request);

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
        message: "Crop created successfully",
        crop: result.crop,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "CREATE CROP API ERROR:",
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