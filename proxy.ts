import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths to protect
  const isAdminPath = pathname.startsWith('/admin');
  const isAccountPath = pathname.startsWith('/account');

  // Exclude auth API routes and static files
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  if (isAdminPath || isAccountPath) {
    // Check for NextAuth session
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Check for Custom Refresh Token
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isAuthenticated = !!token || !!refreshToken;

    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Role check for Admin (Strict check for NextAuth)
    if (isAdminPath && token) {
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
