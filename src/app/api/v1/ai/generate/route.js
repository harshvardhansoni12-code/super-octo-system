import { NextResponse } from "next/server";
import { generateAIResponse } from "@/services/ai/ai-service";

export async function POST(request) {
  try {
    return await generateAIResponse(request);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
