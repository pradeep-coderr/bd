import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail, isAllowedEmail } from "@/lib/server/admin-email";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return response;
  }
  try {
    new URL(url);
  } catch {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const clearSession = (target: URL) => {
    const res = NextResponse.redirect(target);
    request.cookies.getAll().forEach((c) => {
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
    });
    return res;
  };

  if (pathname === "/login") {
    if (user) {
      if (!isAllowedEmail(user.email)) {
        const denied = new URL("/login", request.url);
        denied.searchParams.set("denied", "1");
        return clearSession(denied);
      }
      const dest = isAdminEmail(user.email) ? "/admin" : "/";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return response;
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (!isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isAllowedEmail(user.email)) {
    const denied = new URL("/login", request.url);
    denied.searchParams.set("denied", "1");
    return clearSession(denied);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
