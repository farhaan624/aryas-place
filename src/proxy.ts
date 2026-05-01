import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth(function proxy(req) {
  const session = req.auth;
  const { nextUrl } = req;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  // Admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
      );
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Customer routes
  const customerRoutes = ["/account", "/orders", "/wishlist", "/checkout"];
  if (customerRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
      );
    }
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ["/login", "/register"];
  if (authRoutes.includes(nextUrl.pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/wishlist",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
