import { NextResponse } from "next/server";
import { updateCrop } from "@/services/user/crop-service";

export async function PUT(request) {
  try {
    const result = await updateCrop(request);

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
        message: "Crop updated successfully",
        crop: result.crop,
      },
      {
        status: result.status || 200,
      },
    );
  } catch (error) {
    console.error("UPDATE CROP API ERROR:", error);

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

export async function PATCH(request) {
  return PUT(request);
}
