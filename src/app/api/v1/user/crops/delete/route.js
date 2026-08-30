import { NextResponse } from "next/server";
import { deleteCrop } from "@/services/user/crop-service";

export async function DELETE(request) {
  try {
    const result = await deleteCrop(request);

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
        message: result.message || "Crop deleted successfully",
        crop: result.crop,
      },
      {
        status: result.status || 200,
      },
    );
  } catch (error) {
    console.error("DELETE CROP API ERROR:", error);

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
