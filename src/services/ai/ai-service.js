import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";

export const generateAIResponse = async (request) => {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const text = await generateText(prompt);

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error("Gemini generate error", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
};
