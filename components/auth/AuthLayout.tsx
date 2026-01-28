'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(220,38,38,0.1),transparent_50%)]"></div>
            <div className="absolute w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[128px] -top-32 -left-20"></div>
            <div className="absolute w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px] -bottom-32 -right-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2 font-oswald tracking-wide uppercase">{title}</h1>
                        <p className="text-neutral-400 text-sm">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
