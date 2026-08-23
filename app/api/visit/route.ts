import { NextRequest, NextResponse } from "next/server";
import { visitPayloadSchema } from "@/lib/schemas";
import { createVisit } from "@/lib/server/visit";
import { requireUser } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload = {};
  try {
    payload = await req.json();
  } catch {}

  const parsed = visitPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const id = await createVisit(parsed.data, user.id);
  if (!id) {
    return NextResponse.json(
      { error: "Backend not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY." },
      { status: 503 }
    );
  }

  return NextResponse.json({ id });
}
