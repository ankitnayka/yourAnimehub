"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Users, Search, Mail, Calendar } from "lucide-react";
import api from "@/lib/api";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    image?: string;
}

export default function CustomersPage() {
    const { accessToken } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, [accessToken]);

    const fetchCustomers = async () => {
        if (!accessToken) return;
        try {
            const { data } = await api.get('/api/admin/users?role=user');
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white flex items-center gap-3">
                    <Users className="text-primary" size={32} />
                    Customers
                </h1>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2 rounded-lg focus:border-primary outline-none w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-[#1a1a1a] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-bold text-gray-300 border border-[#333] group-hover:border-gray-600 transition-colors">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        user.name?.[0]?.toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={14} />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-900/20 text-green-500 border border-green-900/50">
                                                Active
                                            </span>
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
