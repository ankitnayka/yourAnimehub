'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Printer } from 'lucide-react';
import api from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatOrderDate } from '@/lib/orderHelpers';

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.orderId as string;
    const { user } = useAuthStore();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login?redirect=/my-orders');
            return;
        }

        if (orderId) {
            fetchOrder();
        }
    }, [user, orderId, router]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/api/orders/${orderId}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Order not found
                </h1>
                <Link href="/my-orders" className="text-blue-600 hover:text-blue-700">
                    Back to My Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                    <div className="flex flex-col">
                        <Link
                            href="/my-orders"
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to My Orders
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Order Details
                        </h1>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
                    >
                        <Printer className="w-5 h-5" />
                        Download Invoice
                    </button>
                </div>

                {/* Print Header (Visible only when printing) */}
                <div className="hidden print:block mb-8 border-b pb-4">
                    <h1 className="text-4xl font-bold text-black mb-2">INVOICE</h1>
                    <p className="text-gray-600">Order #{order._id}</p>
                </div>

                {/* Order Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Order Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Order Info
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Order ID
                                </p>
                                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white break-all">
                                    {order._id}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Date
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatOrderDate(order.createdAt)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Status
                                </p>
                                <StatusBadge status={order.orderStatus} type="order" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Payment Info
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Method
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Status
                                </p>
                                <StatusBadge status={order.paymentStatus} type="payment" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Amount
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(order.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Shipping Address
                            </h2>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {order.shippingAddress.name}
                            </p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                            <p>{order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-2 font-medium">
                                Phone: {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                            >
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Link
                                        href={`/product/${item.slug}`}
                                        className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.price)}
                                        </span>
                                        {item.originalPrice > item.price && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                {formatCurrency(item.originalPrice)}
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                Order Total
                            </span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Payment Info for Online Payment */}
                {order.paymentMethod === 'Online' && order.razorpayPaymentId && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Payment Transaction Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    Razorpay Order ID
                                </p>
                                <p className="font-mono font-semibold text-gray-900 dark:text-white break-all">
                                    {order.razorpayOrderId}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    Payment ID
                                </p>
                                <p className="font-mono font-semibold text-gray-900 dark:text-white break-all">
                                    {order.razorpayPaymentId}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
