"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.email("That doesn't look like an email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
  }, []);

  const denied = searchParams.get("denied") === "1";

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });
    if (error) {
      setAuthError("Hmm, that didn't match — check your email and password ❤️");
      return;
    }
    const next = searchParams.get("next");
    const dest = next === "/admin" ? "/admin" : "/";
    router.replace(dest);
    router.refresh();
  };

  return (
    <div className="login-card">
      <p className="eyebrow">a little something</p>
      <h1 className="login-title">For You</h1>
        <p className="login-sub">
          This was made for one person only.
          <br />
          Enter the email and the password I sent you.
        </p>

        {denied && (
          <p className="qa-error" style={{ textAlign: "center", marginBottom: "1.4rem" }}>
            This little corner of the internet is private — it was only made for her ❤️
          </p>
        )}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            className={`qa-input ${errors.email ? "error" : ""}`}
            placeholder="your email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="qa-error">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            className={`qa-input ${errors.password ? "error" : ""}`}
            placeholder="your password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <p className="qa-error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="enter-btn login-btn" disabled={isSubmitting}>
          {isSubmitting ? "Opening..." : "Come in ❤️"}
        </button>

        {authError && <p className="qa-error" style={{ textAlign: "center" }}>{authError}</p>}
      </form>
      <p className="login-footer">made with ❤️ — for one person only</p>
    </div>
  );
}
