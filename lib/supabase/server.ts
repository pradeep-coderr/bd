import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function envConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  }
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: "${url}"`);
  }
  return { url, key };
}

export async function createSupabaseServerClient() {
  const { url, key } = envConfig();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
