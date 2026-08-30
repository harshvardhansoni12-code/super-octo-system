import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServiceProviderServices } from "@/services/provider/service-service";

/**
 * GET /api/v1/service-provider/services
 * Retrieve all services for the authenticated service provider
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a service provider
    if (session.user.role !== "SERVICE_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only service providers can access this route" },
        { status: 403 },
      );
    }

    const result = await getServiceProviderServices(session.user.id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Services retrieved successfully",
        services: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch services" },
      { status: 500 },
    );
  }
}
