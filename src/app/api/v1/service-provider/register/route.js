import { NextResponse } from "next/server";
import { registerServiceProvider } from "@/services/provider/provider-service";

export async function POST(request) {
  try {
    return await registerServiceProvider(request);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
