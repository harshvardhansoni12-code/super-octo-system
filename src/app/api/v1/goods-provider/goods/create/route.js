import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createGood } from "@/services/provider/good-service";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "GOODS_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only goods providers can create goods" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const result = await createGood(session.user.id, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Good created successfully",
        good: result.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST good error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create good" },
      { status: 500 },
    );
  }
}
