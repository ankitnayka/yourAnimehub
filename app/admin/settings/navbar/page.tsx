"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit, Trash, X, Save, Menu } from "lucide-react";
import api from "@/lib/api";
import TableSkeleton from "@/components/admin/TableSkeleton";

export default function AdminNavbarPage() {
    const { accessToken } = useAuthStore();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        label: "",
        path: "",
        order: 0,
        isActive: true,
        isExternal: false
    });

    useEffect(() => {
        fetchItems();
    }, [accessToken]);

    const fetchItems = async () => {
        if (!accessToken) return;
        try {
            const { data } = await api.get('/api/admin/navbar');
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch navbar items");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formType === 'add') {
                await api.post('/api/admin/navbar', formData);
            } else {
                if (!selectedId) return;
                await api.put(`/api/admin/navbar/${selectedId}`, formData);
            }

            resetForm();
            fetchItems();
        } catch (error: any) {
            alert(error.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this link?")) return;
        try {
            await api.delete(`/api/admin/navbar/${id}`);
            fetchItems();
        } catch (error) {
            alert("Failed to delete item");
        }
    };

    const handleEdit = (item: any) => {
        setFormData({
            label: item.label,
            path: item.path,
            order: item.order || 0,
            isActive: item.isActive,
            isExternal: item.isExternal || false
        });
        setSelectedId(item._id);
        setFormType('edit');
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setFormData({
            label: "",
            path: "",
            order: 0,
            isActive: true,
            isExternal: false
        });
        setSelectedId(null);
        setFormType('add');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Navbar Manager</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Link
                </button>
            </div>

            {showForm && (
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">{formType === 'add' ? 'New Link' : 'Edit Link'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Label</label>
                                <input
                                    type="text" required
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Path / URL</label>
                                <input
                                    type="text" required
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                    value={formData.path}
                                    onChange={e => setFormData({ ...formData, path: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Order</label>
                                <input
                                    type="number"
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex items-center gap-6 mt-7">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="w-5 h-5 accent-red-600"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActive" className="text-white">Active</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isExternal"
                                        className="w-5 h-5 accent-red-600"
                                        checked={formData.isExternal}
                                        onChange={e => setFormData({ ...formData, isExternal: e.target.checked })}
                                    />
                                    <label htmlFor="isExternal" className="text-white">External Link</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button type="submit" className="bg-primary px-6 py-2 rounded text-white font-bold flex items-center gap-2">
                                <Save size={18} /> {formType === 'add' ? 'Create' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#222] text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Label</th>
                            <th className="px-6 py-4">Path</th>
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <TableSkeleton rows={5} columns={5} />
                        ) : (
                            items.map((item) => (
                                <tr key={item._id} className="hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="px-6 py-4 font-bold text-white">
                                        {item.label}
                                        {item.isExternal && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-500 px-1 rounded uppercase">Ext</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{item.path}</td>
                                    <td className="px-6 py-4 text-gray-400">{item.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                            }`}>
                                            {item.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(item)} className="hover:text-primary"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="hover:text-red-500"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && items.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No links found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
