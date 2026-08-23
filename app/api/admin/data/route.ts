import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { fetchAdminData } from "@/lib/server/fetch-admin-data";

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await fetchAdminData();
  if (!data) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  }

  return NextResponse.json(data);
}
