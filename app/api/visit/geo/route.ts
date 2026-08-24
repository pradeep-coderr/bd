import { NextRequest, NextResponse } from "next/server";
import { visitGeoPayloadSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { requireUser } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Backend not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = visitGeoPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("visits")
    .update({
      latitude_precise: parsed.data.latitude,
      longitude_precise: parsed.data.longitude,
      accuracy: parsed.data.accuracy ?? null,
    })
    .eq("id", parsed.data.visitId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("visit geo update failed:", error.message);
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }

  return NextResponse.json({ saved: true });
}
