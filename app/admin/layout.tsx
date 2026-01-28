"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Menu,
    X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-[#222] transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                <div className="h-16 flex items-center px-6 border-b border-[#222]">
                    <span className="text-xl font-black uppercase text-white tracking-tighter">
                        Hub<span className="text-primary">Admin</span>
                    </span>
                    <button
                        className="ml-auto lg:hidden text-gray-400"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
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
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 border-b border-[#222] bg-black px-6 flex items-center justify-between sticky top-0 z-30">
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">
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
