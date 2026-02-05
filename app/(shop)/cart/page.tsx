'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Pencil, Truck, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/orderHelpers';
import CartSkeleton from "@/components/cart/CartSkeleton";

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotalAmount, getItemCount, fetchCart } = useCartStore();
    const { accessToken, user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'note' | 'shipping' | 'coupon'>('note');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            // Fetch cart from database if logged in
            if (accessToken) {
                await fetchCart(accessToken);
            }
            setIsLoading(false);
        };
        init();
    }, [accessToken, fetchCart]);

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        await updateQuantity(productId, newQuantity, accessToken || undefined);
    };

    const handleRemoveItem = async (productId: string) => {
        await removeItem(productId, accessToken || undefined);
    };

    const handleCheckout = () => {
        if (!user) {
            router.push('/auth/login?redirect=/checkout');
            return;
        }
        router.push('/checkout');
    };

    if (isLoading) {
        return <CartSkeleton />;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
                <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Add some products to get started
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-black text-white rounded-none hover:bg-neutral-800 transition-colors uppercase font-bold tracking-widest"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-black dark:text-white mb-12 uppercase tracking-tighter text-center">
                    Shopping Cart
                </h1>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Cart Items List */}
                    <div className="lg:flex-[2]">
                        <div className="space-y-8">
                            {items.map((item) => {
                                const itemTotal = item.price * item.quantity;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0"
                                    >
                                        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                                            <div className="relative w-32 h-40 bg-gray-100 overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <Link href={`/product/${item.slug}`} className="text-lg font-bold text-black dark:text-white hover:text-gray-600 transition-colors uppercase">
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-1">Size: {item.size || 'M'}</p>
                                                    </div>
                                                    <p className="text-lg font-medium whitespace-nowrap">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-sm text-gray-400 underline hover:text-black dark:hover:text-white transition-colors mt-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Control */}
                                                <div className="flex items-center border border-gray-200 dark:border-gray-700 h-10 w-32">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="flex-1 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="flex-1 text-center font-medium text-sm border-x border-gray-200 dark:border-gray-700">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="flex-1 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <p className="text-lg font-bold">
                                                    {formatCurrency(itemTotal)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="lg:flex-1">
                        <div className="sticky top-24 space-y-8">

                            {/* Tabs Area */}
                            <div>
                                <div className="flex bg-gray-100 dark:bg-neutral-900 rounded-lg p-1 mb-4">
                                    <button
                                        onClick={() => setActiveTab('note')}
                                        className={`flex-1 flex flex-col items-center justify-center py-3 text-sm font-medium rounded-md transition-all ${activeTab === 'note' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Pencil className="w-4 h-4 mb-1" />
                                        Note
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shipping')}
                                        className={`flex-1 flex flex-col items-center justify-center py-3 text-sm font-medium rounded-md transition-all ${activeTab === 'shipping' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Truck className="w-4 h-4 mb-1" />
                                        Shipping
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('coupon')}
                                        className={`flex-1 flex flex-col items-center justify-center py-3 text-sm font-medium rounded-md transition-all ${activeTab === 'coupon' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Tag className="w-4 h-4 mb-1" />
                                        Coupon
                                    </button>
                                </div>

                                <div className="bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-lg min-h-[100px] text-sm text-gray-500">
                                    {activeTab === 'note' && (
                                        <textarea
                                            placeholder="Add special instructions for your order..."
                                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 placeholder:text-gray-400"
                                            rows={3}
                                        />
                                    )}
                                    {activeTab === 'shipping' && (
                                        <p>Shipping costs are calculated during checkout.</p>
                                    )}
                                    {activeTab === 'coupon' && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code"
                                                className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded px-3 py-2"
                                            />
                                            <button className="bg-gray-900 text-white px-4 py-2 rounded text-xs uppercase font-bold">Apply</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-lg font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-2xl font-bold text-black dark:text-white">{formatCurrency(getTotalAmount())}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-6 text-right">
                                    Taxes and shipping calculated at checkout
                                </p>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 py-4 uppercase font-black tracking-widest text-sm transition-colors"
                                >
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
