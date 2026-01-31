"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Menu,
    X,
    LogOut
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ADMIN_SIDEBAR_CONFIG } from "@/config/admin";
import { PERMISSIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const router = useRouter();

    const navItems = ADMIN_SIDEBAR_CONFIG.filter(item => {
        if (!user) return true;
        if (user.role === 'super-admin') return true;
        if (user.role === 'admin') {
            return item.requiredPermission !== PERMISSIONS.MANAGE_ADMINS;
        }
        if (user.role === 'sub-admin') {
            if (!item.requiredPermission) return true;
            return user.permissions?.includes(item.requiredPermission);
        }
        return false;
    });

    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex print:bg-white print:text-black">
            {/* Sidebar - Always Visible */}
            <aside className="sticky top-0 w-64 flex-shrink-0 bg-[#111] border-r border-[#222] flex flex-col h-screen print:hidden">
                <div className="h-16 flex items-center px-6 border-b border-[#222]">
                    <Link href="/admin" className="text-xl font-black uppercase text-white tracking-tighter">
                        Hub<span className="text-primary">Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-[#222] hover:text-white"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-[#222]">
                    <button
                        onClick={async () => {
                            await useAuthStore.getState().logout();
                            router.push('/admin/login');
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-gray-400 hover:bg-red-900/20 hover:text-red-500 transition-colors w-full"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    {user && (
                        <div className="mt-4 px-4 flex items-center gap-3 text-xs text-gray-500">
                            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center font-bold text-gray-300">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-300 truncate">{user.name}</p>
                                <p className="truncate">{user.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 border-b border-[#222] bg-black px-6 flex items-center justify-between sticky top-0 z-30 print:hidden">
                    <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        YourAnimeHub Control Center
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
