import { NextResponse } from "next/server";
import { createCrop } from "@/services/user/crop-service";

export async function POST(request) {
  try {
    const cropsCreated = await createCrop(request);
    if (!cropsCreated) {
      return NextResponse.json(
        { error: cropsCreated.error || "Unable to create crop" },
        { status: cropsCreated.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Crop created successfully", crop: cropsCreated.crop },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
