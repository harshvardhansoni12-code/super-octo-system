import { NextResponse } from "next/server";
import { registerGoodProvider } from "@/services/provider/good-provider-service";

export async function POST(request) {
  try {
    return await registerGoodProvider(request);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
