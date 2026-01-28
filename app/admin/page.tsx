"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

const data = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 13 },
    { name: 'Wed', sales: 2000, orders: 98 },
    { name: 'Thu', sales: 2780, orders: 39 },
    { name: 'Fri', sales: 1890, orders: 48 },
    { name: 'Sat', sales: 2390, orders: 38 },
    { name: 'Sun', sales: 3490, orders: 43 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Revenue", value: "₹45,231.89", icon: DollarSign, color: "text-green-500", trend: "+20.1% from last month" },
                    { title: "Subscriptions", value: "+2350", icon: Users, color: "text-blue-500", trend: "+180.1% from last month" },
                    { title: "Sales", value: "+12,234", icon: ShoppingBag, color: "text-primary", trend: "+19% from last month" },
                    { title: "Active Now", value: "+573", icon: TrendingUp, color: "text-orange-500", trend: "+201 since last hour" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-[#111] border border-[#222] p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-gray-500">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="sales" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Sales</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-bold text-gray-400">
                                        OM
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Olivia Martin</p>
                                        <p className="text-xs text-gray-500">olivia.martin@email.com</p>
                                    </div>
                                </div>
                                <div className="font-bold text-white">+₹1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
