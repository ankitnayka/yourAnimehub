'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/orderHelpers';

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotalAmount, getItemCount, fetchCart } = useCartStore();
    const { accessToken, user } = useAuthStore();

    useEffect(() => {
        // Fetch cart from database if logged in
        if (accessToken) {
            fetchCart(accessToken);
        }
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Shopping Cart
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-3">
                        ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
                    </span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const itemTotal = item.price * item.quantity;
                            const discount = item.discountPercentage ||
                                (item.originalPrice > 0
                                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                                    : 0);

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-all hover:shadow-md"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/product/${item.slug}`}
                                                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                                                    >
                                                        {item.name}
                                                    </Link>

                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                            {formatCurrency(item.price)}
                                                        </span>
                                                        {item.originalPrice > item.price && (
                                                            <>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                                    {formatCurrency(item.originalPrice)}
                                                                </span>
                                                                {discount > 0 && (
                                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                                        {discount}% OFF
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remove Button (Desktop) */}
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="hidden sm:block text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Quantity Controls & Item Total */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {formatCurrency(itemTotal)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Remove Button (Mobile) */}
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="sm:hidden mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal ({getItemCount()} items)</span>
                                    <span className="font-semibold">
                                        {formatCurrency(getTotalAmount())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        FREE
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>{formatCurrency(getTotalAmount())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/"
                                className="block w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
