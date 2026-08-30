import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteService } from "@/services/provider/service-service";
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a service provider
    if (session.user.role !== "SERVICE_PROVIDER") {
      return NextResponse.json(
        { error: "Forbidden: Only service providers can delete services" },
        { status: 403 },
      );
    }

    const result = await deleteService(session.user.id, serviceId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Service deleted successfully",
        service: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("DELETE service error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete service" },
      { status: 500 },
    );
  }
}
