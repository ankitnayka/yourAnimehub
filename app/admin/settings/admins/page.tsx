"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Plus, Shield, Check, X, Trash } from "lucide-react";
import axios from "axios";

export default function AdminManagementPage() {
    const { user, accessToken } = useAuthStore();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "sub-admin",
        permissions: [] as string[]
    });

    const AVAILABLE_PERMISSIONS = [
        { id: "manage_products", label: "Manage Products" },
        { id: "manage_orders", label: "Manage Orders" },
        { id: "view_customers", label: "View Customers" },
        { id: "manage_settings", label: "Manage Settings" }
    ];

    useEffect(() => {
        fetchAdmins();
    }, [accessToken]);

    const fetchAdmins = async () => {
        if (!accessToken) return;
        try {
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (data.success) {
                setAdmins(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionId: string) => {
        setFormData(prev => {
            const permissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setShowForm(false);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "sub-admin",
                permissions: []
            });
            fetchAdmins();
        } catch (error) {
            alert("Failed to create user");
        }
    };

    if (!user || (user.role !== 'super-admin' && user.role !== 'admin')) {
        return <div className="text-white">Access Denied</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Admin Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Sub-Admin
                </button>
            </div>

            {showForm && (
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Create New Admin</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" placeholder="Name" required
                                className="bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email" placeholder="Email" required
                                className="bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="password" placeholder="Password" required
                                className="bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <select
                                className="bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="sub-admin">Sub Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-400 text-sm mb-2 block">Permissions</label>
                            <div className="flex gap-4 flex-wrap">
                                {AVAILABLE_PERMISSIONS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handlePermissionToggle(p.id)}
                                        className={`px-3 py-1 rounded text-sm border ${formData.permissions.includes(p.id)
                                                ? 'bg-red-600/20 border-red-600 text-red-500'
                                                : 'border-[#333] text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button type="submit" className="bg-primary px-6 py-2 rounded text-white font-bold">Create</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#222] text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Permissions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4 text-white">Loading...</td></tr>
                        ) : (
                            admins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-[#1a1a1a] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{admin.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${admin.role === 'super-admin' ? 'bg-purple-500/20 text-purple-500' :
                                                admin.role === 'admin' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {admin.permissions?.map((p: string) => (
                                                <span key={p} className="text-[10px] bg-[#333] rounded px-1 text-gray-300">{p}</span>
                                            ))}
                                            {(!admin.permissions || admin.permissions.length === 0) && <span className="text-gray-600">-</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
