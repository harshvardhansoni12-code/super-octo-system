import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNegotiation } from "@/services/mock/negotiations-mock";

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
    const { listingType, listingId, offerPrice, message } = body;

    if (!listingType || !listingId) {
      return NextResponse.json(
        { error: "listingType and listingId are required" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(Number(offerPrice)) || Number(offerPrice) <= 0) {
      return NextResponse.json(
        { error: "A positive offer price is required" },
        { status: 400 },
      );
    }

    const negotiation = createNegotiation({
      listingType,
      listingId,
      offerPrice: Number(offerPrice),
      message,
    });

    return NextResponse.json(
      {
        message: "Offer sent successfully",
        negotiation,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE NEGOTIATION API ERROR:", error);

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
