import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./admin-email";
import type { User } from "@supabase/supabase-js";

export { isAdminEmail };

export async function requireUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function requireAdmin(): Promise<User | null> {
  const user = await requireUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
