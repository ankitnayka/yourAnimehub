"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit, Trash, X, Save, List, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

export default function AdminCategoriesPage() {
    const { accessToken } = useAuthStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        description: "",
        isActive: true,
        order: 0
    });

    useEffect(() => {
        fetchCategories();
    }, [accessToken]);

    const fetchCategories = async () => {
        if (!accessToken) return;
        try {
            const { data } = await api.get('/api/admin/categories');
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formType === 'add') {
                await api.post('/api/admin/categories', formData);
            } else {
                if (!selectedId) return;
                await api.put(`/api/admin/categories/${selectedId}`, formData);
            }

            resetForm();
            fetchCategories();
        } catch (error: any) {
            alert(error.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/api/admin/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert("Failed to delete category");
        }
    };

    const handleEdit = (category: any) => {
        setFormData({
            name: category.name,
            image: category.image || "",
            description: category.description || "",
            isActive: category.isActive,
            order: category.order || 0
        });
        setSelectedId(category._id);
        setFormType('edit');
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setFormData({
            name: "",
            image: "",
            description: "",
            isActive: true,
            order: 0
        });
        setSelectedId(null);
        setFormType('add');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Categories</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {showForm && (
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">{formType === 'add' ? 'New Category' : 'Edit Category'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Category Image</label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 bg-neutral-900 rounded-lg border border-[#333] flex items-center justify-center overflow-hidden group">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-gray-600 w-8 h-8" />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-primary w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 w-fit transition-colors">
                                                <Upload size={16} />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                                <input
                                                    type="file"
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={uploading}
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2">Recommended: 800x800px (JPG, PNG)</p>
                                        </div>
                                    </div>
                                    {/* Fallback URL input just in case */}
                                    <div className="mt-2 text-xs">
                                        <span onClick={() => {
                                            const url = prompt("Enter Image URL manually:", formData.image);
                                            if (url !== null) setFormData({ ...formData, image: url });
                                        }} className="text-gray-500 hover:text-white cursor-pointer underline">
                                            Or enter URL manually
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">Description</label>
                                <textarea
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Order</label>
                                <input
                                    type="number"
                                    className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                    value={formData.order || 0}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-7">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-5 h-5 accent-red-600"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-white">Active</label>
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
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-4 text-white">Loading...</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                        {cat.image && <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded object-cover bg-neutral-800" />}
                                        {cat.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                                    <td className="px-6 py-4 text-gray-400">{cat.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${cat.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                            }`}>
                                            {cat.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(cat)} className="hover:text-primary"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(cat._id)} className="hover:text-red-500"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && categories.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
