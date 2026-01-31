'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatOrderDate } from '@/lib/orderHelpers';

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, accessToken } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {
        if (!user) {
            router.push('/auth/login?redirect=/my-orders');
            return;
        }

        fetchOrders();
    }, [user, pagination.page, accessToken, router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/orders?page=${pagination.page}&limit=${pagination.limit}`);

            if (response.data.success) {
                setOrders(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
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

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
                <Package className="w-24 h-24 text-gray-300 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    No orders yet
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                    Looks like you haven&apos;t placed any orders yet. Start shopping!
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    My Orders
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-3">
                        ({pagination.total} {pagination.total === 1 ? 'order' : 'orders'})
                    </span>
                </h1>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/my-orders/${order._id}`}
                            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Order ID
                                    </p>
                                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
                                        {order._id}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <StatusBadge status={order.orderStatus} type="order" />
                                    <StatusBadge status={order.paymentStatus} type="payment" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Order Date
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatOrderDate(order.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Payment Method
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Total Amount
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(order.totalAmount)}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Items ({order.orderItems.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {order.orderItems.slice(0, 3).map((item: any, index: number) => (
                                        <span
                                            key={index}
                                            className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                                        >
                                            {item.title} (x{item.quantity})
                                        </span>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                            +{order.orderItems.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mt-4 flex items-center justify-end text-blue-600 dark:text-blue-400 font-medium">
                                View Details
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
