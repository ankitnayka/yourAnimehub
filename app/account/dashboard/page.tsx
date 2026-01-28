'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, LogOut, Package, User, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        await logout();
        await signOut({ redirect: false });
        router.push('/auth/login');
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 px-4 pb-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-oswald uppercase mb-2">My Account</h1>
                        <p className="text-neutral-400">Welcome back, <span className="text-red-500">{user.name}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:bg-red-600/10 hover:border-red-600/50 hover:text-red-500 px-6 py-2 rounded-full transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-colors"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Profile</h3>
                        <p className="text-sm text-neutral-500 mb-4">{user.email}</p>
                        <button className="text-sm font-medium hover:text-primary transition-colors">Edit Profile &rarr;</button>
                    </motion.div>

                    {/* Orders Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-colors"
                    >
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Orders</h3>
                        <p className="text-sm text-neutral-500 mb-4">No recent orders</p>
                        <Link href="/account/orders" className="text-sm font-medium hover:text-primary transition-colors">View All &rarr;</Link>
                    </motion.div>

                    {/* Wishlist Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-colors"
                    >
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Wishlist</h3>
                        <p className="text-sm text-neutral-500 mb-4">0 items saved</p>
                        <Link href="/wishlist" className="text-sm font-medium hover:text-primary transition-colors">View Wishlist &rarr;</Link>
                    </motion.div>

                    {/* Addresses Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-colors"
                    >
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-500">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Addresses</h3>
                        <p className="text-sm text-neutral-500 mb-4">Manage shipping info</p>
                        <Link href="/account/addresses" className="text-sm font-medium hover:text-primary transition-colors">Manage &rarr;</Link>
                    </motion.div>

                </div>

            </div>
        </div>
    );
}
