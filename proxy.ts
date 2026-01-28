import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect these paths
  const isAdminPath = pathname.startsWith("/admin");
  const isAccountPath = pathname.startsWith("/account");

  // Skip auth routes + static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Only protect admin/account routes
  if (isAdminPath || isAccountPath) {
    // NextAuth session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Custom JWT refresh token cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Authentication check
    const isAuthenticated = !!token || !!refreshToken;

    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);

      return NextResponse.redirect(loginUrl);
    }

    // Admin role check
    if (isAdminPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};

