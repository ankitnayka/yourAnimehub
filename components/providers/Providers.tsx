'use-client';
'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const AuthSync = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const { login, checkAuth, isAuthenticated, setLoading } = useAuthStore();

    useEffect(() => {
        const syncAuth = async () => {
            if (status === 'loading') return;

            if (session?.user) {
                // NextAuth is active, sync to store
                login({
                    id: (session.user as any).id,
                    name: session.user.name || '',
                    email: session.user.email || '',
                    role: (session.user as any).role || 'user',
                    image: session.user.image,
                }, null); // No access token for NextAuth users (cookie based)
                setLoading(false);
            } else if (!isAuthenticated) {
                // Try custom auth check (refresh token)
                await checkAuth();
            } else {
                setLoading(false);
            }
        };

        syncAuth();
    }, [session, status, login, checkAuth, isAuthenticated, setLoading]);

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
