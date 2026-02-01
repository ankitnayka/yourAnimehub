'use client';

import React, { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setIsSearching(false);
            alert("This is a demo tracking page. In a real app, this would fetch order details.");
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto px-6 py-20">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package size={32} />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">Track Order</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Enter your order details below to check the latest status of your shipment.
                </p>
            </div>

            <form onSubmit={handleTrack} className="space-y-4 bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-[#222] shadow-sm transition-colors">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Order ID</label>
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="#ORD-123456"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="billing@email.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
                >
                    {isSearching ? 'Searching...' : 'Track Now'}
                    {!isSearching && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <p className="text-xs text-center text-gray-500 mt-6">
                Can't find your order ID? Check the confirmation email sent to you at the time of purchase.
            </p>
        </div>
    );
}
