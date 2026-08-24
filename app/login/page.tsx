import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginForm from "@/components/login-form";
import Stars from "@/components/stars";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail, isAllowedEmail } from "@/lib/server/admin-email";

export const metadata: Metadata = {
  title: "For You — enter",
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAllowedEmail(user.email)) {
    redirect(isAdminEmail(user.email) ? "/admin" : "/");
  }

  return (
    <div className="login-screen">
      <Stars count={26} />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
