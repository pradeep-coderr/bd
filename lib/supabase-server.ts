import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;
let cachedKey = "";

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  try {
    new URL(url);
  } catch {
    return null;
  }
  if (!url.startsWith("https://") && !url.startsWith("http://")) return null;
  if (cached && cachedKey === `${url}:${key.slice(0, 8)}`) return cached;
  try {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    return null;
  }
  cachedKey = `${url}:${key.slice(0, 8)}`;
  return cached;
}
