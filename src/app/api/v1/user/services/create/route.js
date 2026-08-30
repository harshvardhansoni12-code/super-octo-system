import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createService } from "@/services/mock/services-mock";

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
    const { name, type, prices, availableFrom, availableTo, imageDataUrl } =
      body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(Number(prices)) || Number(prices) <= 0) {
      return NextResponse.json(
        { error: "A positive price is required" },
        { status: 400 },
      );
    }

    const service = createService({
      name: String(name).trim(),
      type: String(type).trim(),
      prices: Number(prices),
      availableFrom,
      availableTo,
      imageDataUrl,
      serviceProviderId: session.user.id,
      providerName: session.user.name || session.user.email,
      contactEmail: session.user.email,
    });

    return NextResponse.json(
      {
        message: "Service created successfully",
        service,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE SERVICE API ERROR:", error);

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
