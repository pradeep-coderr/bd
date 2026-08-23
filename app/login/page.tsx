import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/login-form";
import Stars from "@/components/stars";

export const metadata: Metadata = {
  title: "For You — enter",
};

export default function LoginPage() {
  return (
    <div className="login-screen">
      <Stars count={26} />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
