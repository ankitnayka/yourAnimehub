"use client";


import { SessionProvider, useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useEffect } from "react";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const AuthSync = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const { login, checkAuth, isAuthenticated, setLoading, accessToken, user } = useAuthStore();
    const { syncCart, items, fetchCart } = useCartStore();

    useEffect(() => {
        const syncAuth = async () => {
            if (status === 'loading') return;

            // If we already have a custom JWT auth (admin login), don't overwrite it with NextAuth
            if (accessToken && user) {
                setLoading(false);
                return;
            }

            if (session?.user) {
                // Prevent infinite loop: check if we're already authenticated with the same user
                if (isAuthenticated && user?.email === session.user.email) {
                    setLoading(false);
                    return;
                }

                // NextAuth is active, sync to store only if we don't have custom auth
                login({
                    id: (session.user as any).id,
                    name: session.user.name || '',
                    email: session.user.email || '',
                    role: (session.user as any).role || 'user',
                    image: session.user.image,
                }, null); // No access token for NextAuth users (cookie based)

                // Sync cart after login
                // We pass 'session' as a dummy token to trigger sync logic if needed, 
                // but real auth is handled by cookies
                if (items.length > 0) {
                    await syncCart('session-auth');
                } else {
                    await fetchCart('session-auth');
                }

                setLoading(false);
            } else if (!isAuthenticated) {
                // Try custom auth check (refresh token)
                await checkAuth();
            } else {
                setLoading(false);
            }
        };

        syncAuth();
    }, [session, status, login, checkAuth, isAuthenticated, setLoading, accessToken, user, syncCart, fetchCart, items.length]);

    return <>{children}</>;
};

export function Providers({ children }: Props) {
    return (
        <SessionProvider>
            <AuthSync>
                {children}
            </AuthSync>
        </SessionProvider>
    );
}
