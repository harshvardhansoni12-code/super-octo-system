import { NextResponse } from "next/server";
import { createAdmin } from "@/services/admin/admin-service";

export async function POST(request) {
  try {
    return await createAdmin(request);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
