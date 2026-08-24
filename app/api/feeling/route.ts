import { NextRequest, NextResponse } from "next/server";
import { feelingPayloadSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { createVisit } from "@/lib/server/visit";
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

  const parsed = feelingPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  let visitId = parsed.data.visitId ?? null;
  if (!visitId) {
    visitId = await createVisit(undefined, user.id);
  }

  if (visitId) {
    const { data: existing } = await supabase
      .from("feelings")
      .select("id")
      .eq("visit_id", visitId)
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Feeling already saved for this visit" }, { status: 409 });
    }
  }

  const { error } = await supabase.from("feelings").insert({
    visit_id: visitId,
    text: parsed.data.text,
  });
  if (error) {
    console.error("feeling insert failed:", error.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ saved: true, visitId });
}
