import { NextResponse } from "next/server";
import { registerUser } from "@/services/user/user-service";

export async function POST(request) {
  try {
    return await registerUser(request);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
