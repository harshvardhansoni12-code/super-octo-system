import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { updateService } from "@/services/provider/service-service";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a service provider
    if (session.user.role !== "SERVICE_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only service providers can update services" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const result = await updateService(session.user.id, serviceId, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Service updated successfully",
        service: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("PUT service error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update service" },
      { status: 500 },
    );
  }
}
