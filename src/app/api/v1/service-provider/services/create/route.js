import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createService } from "@/services/provider/service-service";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a service provider
    if (session.user.role !== "SERVICE_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only service providers can create services" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const result = await createService(session.user.id, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Service created successfully",
        service: result.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST service error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create service" },
      { status: 500 },
    );
  }
}
