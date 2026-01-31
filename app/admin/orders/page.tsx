"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ShoppingBag, Search, Calendar, ChevronDown, CheckCircle, Clock, XCircle, Truck, Package } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/orderHelpers";

interface Order {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    totalAmount: number;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    orderItems: any[];
}

const STATUS_Styles = {
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Paid: "bg-green-500/10 text-green-500 border-green-500/20",
    Shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    Failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrdersPage() {
    const { accessToken } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        fetchOrders();
    }, [accessToken]);

    const fetchOrders = async () => {
        if (!accessToken) return;
        try {
            const { data } = await api.get('/api/admin/orders?limit=100');
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={14} />;
            case 'Shipped': return <Truck size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            case 'Pending': return <Clock size={14} />;
            default: return <Package size={14} />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === "All" || order.orderStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white flex items-center gap-3">
                    <ShoppingBag className="text-primary" size={32} />
                    Orders
                </h1>

                <div className="flex flex-col md:flex-row gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#111] border border-[#222] text-white px-4 py-2 rounded-lg focus:border-primary outline-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2 rounded-lg focus:border-primary outline-none w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => window.location.href = `/admin/orders/${order._id}`}
                                        className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm text-gray-400 group-hover:text-primary transition-colors">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-white">{order.userId?.name || 'Guest'}</p>
                                                <p className="text-xs text-gray-500">{order.userId?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Calendar size={14} />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${STATUS_Styles[order.orderStatus] || STATUS_Styles.Pending}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${STATUS_Styles[order.paymentStatus] || STATUS_Styles.Pending}`}>
                                                {order.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
