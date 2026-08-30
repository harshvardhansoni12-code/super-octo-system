import { NextResponse } from "next/server";
import { listServices } from "@/services/mock/services-mock";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const services = listServices(q);

    return NextResponse.json(
      {
        message: "Services fetched successfully",
        services,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET SERVICES API ERROR:", error);

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
