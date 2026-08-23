import { getSupabaseAdmin } from "../supabase-server";

export interface AdminData {
  visits: Record<string, unknown>[];
  answers: Record<string, unknown>[];
  feelings: Record<string, unknown>[];
}

export async function fetchAdminData(): Promise<AdminData | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const [visits, answers, feelings] = await Promise.all([
    supabase.from("visits").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("answers").select("*").order("created_at", { ascending: false }).limit(1000),
    supabase.from("feelings").select("*").order("created_at", { ascending: false }).limit(500),
  ]);

  if (visits.error) console.error("visits fetch failed:", visits.error.message);
  if (answers.error) console.error("answers fetch failed:", answers.error.message);
  if (feelings.error) console.error("feelings fetch failed:", feelings.error.message);

  return {
    visits: visits.data ?? [],
    answers: answers.data ?? [],
    feelings: feelings.data ?? [],
  };
}
