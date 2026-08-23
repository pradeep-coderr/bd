import { redirect } from "next/navigation";
import AdminPanel from "@/components/admin-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/server/admin-email";
import { fetchAdminData } from "@/lib/server/fetch-admin-data";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  const data = await fetchAdminData();
  if (!data) {
    return (
      <div className="admin-wrap">
        <h1>the little database</h1>
        <p className="admin-sub">
          Supabase is not configured yet — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local,
          run supabase/schema.sql in the Supabase SQL editor, then restart.
        </p>
      </div>
    );
  }

  return <AdminPanel initialData={data} />;
}
