'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import api from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatOrderDate } from '@/lib/orderHelpers';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        fetchOrder();
    }, [orderId, router]);

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
                <Link href="/" className="text-blue-600 hover:text-blue-700">
                    Go to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Order Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Order ID
                            </p>
                            <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
                                {order._id}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Order Date
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                {formatOrderDate(order.createdAt)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Payment Method
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Total Amount
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.totalAmount)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Payment Status
                            </p>
                            <StatusBadge status={order.paymentStatus} type="payment" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Order Status
                            </p>
                            <StatusBadge status={order.orderStatus} type="order" />
                        </div>
                    </div>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Shipping Address
                    </h2>
                    <div className="text-gray-700 dark:text-gray-300">
                        <p className="font-semibold">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/my-orders"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        View My Orders
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Additional Info */}
                {order.paymentMethod === 'COD' && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> Please keep the exact amount ready for cash on delivery. Our delivery executive will arrive soon with your order.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
