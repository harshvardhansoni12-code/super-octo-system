import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGood } from "@/services/mock/goods-mock";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, category, price, stock, unit, description, imageDataUrl } =
      body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return NextResponse.json(
        { error: "A positive price is required" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(Number(stock)) || Number(stock) < 0) {
      return NextResponse.json(
        { error: "A valid stock amount is required" },
        { status: 400 },
      );
    }

    const good = createGood({
      name: String(name).trim(),
      category: String(category).trim(),
      price: Number(price),
      stock: Number(stock),
      unit: unit ? String(unit).trim() : "unit",
      description,
      imageDataUrl,
      goodProviderId: session.user.id,
      providerName: session.user.name || session.user.email,
      contactEmail: session.user.email,
    });

    return NextResponse.json(
      {
        message: "Good created successfully",
        good,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE GOOD API ERROR:", error);

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
