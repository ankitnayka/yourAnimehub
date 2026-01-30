import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define protected routes
    const isAdminRoute = pathname.startsWith('/admin');
    const isAccountRoute = pathname.startsWith('/account');
    const isAuthRoute = pathname.startsWith('/auth');

    // 2. Get token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    const isLoginPage = pathname === '/admin/login';

    if (isAdminRoute) {
        // If trying to access login page while authenticated
        if (isLoginPage) {
            if (accessToken) {
                try {
                    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                    const { payload } = await jwtVerify(accessToken, secret);
                    const role = payload.role as string;
                    // If admin is already logged in, send them to dashboard
                    if (['admin', 'super-admin', 'sub-admin'].includes(role)) {
                        return NextResponse.redirect(new URL('/admin', request.url));
                    }
                } catch (error) {
                    // Token invalid, let them proceed to login
                }
            }
            return NextResponse.next();
        }

        // For all other admin routes, require valid admin token
        if (!accessToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(accessToken, secret);

            const role = payload.role as string;

            // Check for Admin Roles
            if (!['admin', 'super-admin', 'sub-admin'].includes(role)) {
                // If user is logged in but not admin, redirect to home
                return NextResponse.redirect(new URL('/', request.url));
            }

            // (Optional) Sub-admin specific checks could go here if route structure supports it

        } catch (error) {
            // Token invalid or expired
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    if (isAccountRoute) {
        if (!accessToken) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        // Could verify token validity here too if needed
    }

    if (isAuthRoute) {
        if (accessToken) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                const { payload } = await jwtVerify(accessToken, secret);
                const role = payload.role as string;

                if (['admin', 'super-admin', 'sub-admin'].includes(role)) {
                    return NextResponse.redirect(new URL('/admin', request.url));
                } else {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            } catch (error) {
                // Token invalid, let them stay on login page
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*', '/account/:path*'],
};
