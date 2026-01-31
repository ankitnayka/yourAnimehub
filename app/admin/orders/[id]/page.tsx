"use client";

import { useState, useEffect, use } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Printer,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Package,
    MapPin,
    CreditCard,
    User as UserIcon,
    ArrowLeft,
    Save
} from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/orderHelpers";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface OrderItem {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
}

interface Order {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    orderItems: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
}

const statusOptions = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatusOptions = ['Pending', 'Paid', 'Failed'];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { accessToken } = useAuthStore();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editable states
    const [status, setStatus] = useState<string>("");
    const [paymentStatus, setPaymentStatus] = useState<string>("");

    useEffect(() => {
        fetchOrder();
    }, [id, accessToken]);

    const fetchOrder = async () => {
        if (!accessToken) return;
        try {
            const { data } = await api.get(`/api/admin/orders/${id}`);
            if (data.success) {
                setOrder(data.data);
                setStatus(data.data.orderStatus);
                setPaymentStatus(data.data.paymentStatus);
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!accessToken) return;
        setSaving(true);
        try {
            const { data } = await api.patch(`/api/admin/orders/${id}`, {
                orderStatus: status,
                paymentStatus: paymentStatus
            });
            if (data.success) {
                setOrder(data.data);
                alert("Order updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update order", error);
            alert("Failed to update order");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return <div className="text-white">Order not found</div>;
    }

    const subtotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="relative">
            {/* SCREEN VIEW */}
            <div className="space-y-6 print:hidden">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                Order #{order._id.slice(-6).toUpperCase()}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Placed on {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-[#333]"
                        >
                            <Printer size={18} /> Print Invoice
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Items & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items */}
                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="text-primary" size={20} />
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-[#1a1a1a] p-4 rounded-lg">
                                        <div className="relative w-16 h-16 bg-[#222] rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-medium truncate">{item.title}</h3>
                                            <div className="text-sm text-gray-400 flex gap-3">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">{formatCurrency(item.price)}</p>
                                            <p className="text-gray-500 text-sm">Total: {formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border-t border-[#222] pt-4 flex justify-end">
                                <div className="w-full max-w-xs space-y-2">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-500">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-[#222]">
                                        <span>Total</span>
                                        <span>{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Truck className="text-primary" size={20} />
                                Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Recipient</p>
                                    <p className="font-medium text-white">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Address</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Status & Customer */}
                    <div className="space-y-6">
                        {/* Status Management card */}
                        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Order Status</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Order Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#333] text-white p-3 rounded-lg focus:border-primary outline-none"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Payment Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#333] text-white p-3 rounded-lg focus:border-primary outline-none"
                                    >
                                        {paymentStatusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <UserIcon className="text-primary" size={20} />
                                Customer
                            </h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center font-bold text-xl text-gray-500">
                                    {order.userId?.name?.[0] || 'G'}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{order.userId?.name || 'Guest User'}</p>
                                    <p className="text-sm text-gray-400">{order.userId?.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#222] space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Customer ID</span>
                                    <span className="text-gray-300 font-mono">{order.userId?._id?.slice(-6) || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="text-primary" size={20} />
                                Payment
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Method</span>
                                    <span className="text-white font-medium">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-500' :
                                        order.paymentStatus === 'Failed' ? 'bg-red-500/20 text-red-500' :
                                            'bg-yellow-500/20 text-yellow-500'
                                        }`}>{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT VIEW (INVOICE) */}
            <div className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto h-full">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-black  tracking-tighter mb-2">
                            Your<span className="text-gray-500">Anime</span>Hub
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Samodiya Faliya<br />
                            Navsari,Gujarat<br />
                            support@youranimehub.store
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-400 uppercase tracking-widest mb-4">Invoice</h2>
                        <div className="space-y-1">
                            <p className="text-sm"><span className="font-bold w-24 inline-block">Invoice #:</span> INV-{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm"><span className="font-bold w-24 inline-block">Order ID:</span> {order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm"><span className="font-bold w-24 inline-block">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Bill To & Ship To */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="font-bold uppercase text-xs text-gray-500 mb-3 border-b border-gray-200 pb-1">Bill To</h3>
                        <p className="font-bold text-lg">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p className="text-sm text-gray-500 mt-2">{order.userId.email}</p>
                    </div>
                    <div>
                        <h3 className="font-bold uppercase text-xs text-gray-500 mb-3 border-b border-gray-200 pb-1">Ship To</h3>
                        <p className="font-bold text-lg">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead className="border-b-2 border-black">
                        <tr>
                            <th className="text-left font-bold uppercase text-xs py-3 w-1/2">Item Description</th>
                            <th className="text-center font-bold uppercase text-xs py-3">Qty</th>
                            <th className="text-right font-bold uppercase text-xs py-3">Unit Price</th>
                            <th className="text-right font-bold uppercase text-xs py-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.orderItems.map((item, index) => (
                            <tr key={index}>
                                <td className="py-4">
                                    <p className="font-bold text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {item.size && `Size: ${item.size}`}
                                        {item.size && item.color && " | "}
                                        {item.color && `Color: ${item.color}`}
                                    </p>
                                </td>
                                <td className="py-4 text-center text-sm">{item.quantity}</td>
                                <td className="py-4 text-right text-sm">{formatCurrency(item.price)}</td>
                                <td className="py-4 text-right font-bold text-sm">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/3 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-600">Subtotal:</span>
                            <span className="font-bold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-600">Shipping:</span>
                            <span className="font-bold text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-xl border-t-2 border-black pt-3 mt-3">
                            <span className="font-black uppercase">Total:</span>
                            <span className="font-black text-primary">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
                    <p className="mb-2">Thank you for your business!</p>
                    <p className="text-xs">If you have any questions about this invoice, please contact support@youranimehub.store</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; }
                    /* Hide unnecessary elements if they leak specifically from layout */
                    nav, aside, header { display: none !important; }
                }
            `}</style>
        </div>
    );
}
