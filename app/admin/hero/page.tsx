"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit, Trash, X, Save, Upload, Loader2, Image as ImageIcon, Video as VideoIcon, MoveUp, MoveDown } from "lucide-react";
import api from "@/lib/api";

export default function AdminHeroPage() {
    const { accessToken } = useAuthStore();
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        type: "image",
        mediaUrl: "",
        link: "/products",
        cta: "Shop Now",
        order: slides.length as string | number,
        isActive: true,
    });

    useEffect(() => {
        fetchSlides();
    }, [accessToken]);

    const fetchSlides = async () => {
        if (!accessToken) return;
        try {
            const res = await api.get("/api/admin/hero-slides");
            if (res.data.success) {
                setSlides(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch slides", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await api.post("/api/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, mediaUrl: res.data.url }));
            }
        } catch (error) {
            alert("Upload failed. Make sure you are logged in and the file is an image/video.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const headers = { Authorization: `Bearer ${accessToken}` };
            const payload = {
                ...formData,
                order: Number(formData.order)
            };

            if (formType === 'add') {
                await api.post('/api/admin/hero-slides', payload);
            } else {
                if (!selectedId) return;
                await api.put(`/api/admin/hero-slides/${selectedId}`, payload);
            }

            resetForm();
            fetchSlides();
        } catch (error: any) {
            alert(error.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;
        try {
            await api.delete(`/api/admin/hero-slides/${id}`);
            fetchSlides();
        } catch (error) {
            alert("Failed to delete slide");
        }
    };

    const handleEdit = (slide: any) => {
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle || "",
            description: slide.description || "",
            type: slide.type || "image",
            mediaUrl: slide.mediaUrl,
            link: slide.link || "/products",
            cta: slide.cta || "Shop Now",
            order: slide.order ?? slides.length,
            isActive: slide.isActive !== undefined ? slide.isActive : true,
        });
        setSelectedId(slide._id || slide.id);
        setFormType('edit');
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setFormData({
            title: "",
            subtitle: "",
            description: "",
            type: "image",
            mediaUrl: "",
            link: "/products",
            cta: "Shop Now",
            order: slides.length,
            isActive: true,
        });
        setSelectedId(null);
        setFormType('add');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Hero Slider</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Slide
                </button>
            </div>

            {showForm && (
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl mb-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white uppercase">{formType === 'add' ? 'New Slide' : 'Edit Slide'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Title (Highlighted)</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                        placeholder="e.g. DARKER THE DRIP"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Subtitle (Primary Color)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                        placeholder="e.g. LOUDER THE VIBE"
                                        value={formData.subtitle}
                                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none h-24"
                                        placeholder="Brief description of the collection"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">CTA Text</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                            value={formData.cta}
                                            onChange={e => setFormData({ ...formData, cta: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Link Path</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                            value={formData.link}
                                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Media Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'image' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded border transition-colors ${formData.type === 'image' ? 'bg-primary border-primary text-white' : 'bg-black border-[#333] text-gray-400 hover:border-gray-500'}`}
                                        >
                                            <ImageIcon size={18} /> Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'video' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded border transition-colors ${formData.type === 'video' ? 'bg-primary border-primary text-white' : 'bg-black border-[#333] text-gray-400 hover:border-gray-500'}`}
                                        >
                                            <VideoIcon size={18} /> Video
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Media URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text" required
                                            className="flex-1 bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                            placeholder="Paste URL or upload"
                                            value={formData.mediaUrl}
                                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                        />
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="h-full px-4 bg-[#222] border border-[#333] rounded text-gray-400 hover:text-white transition-colors"
                                            >
                                                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                            </button>
                                            <input
                                                type="file"
                                                accept={formData.type === 'image' ? "image/*" : "video/*"}
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {formData.mediaUrl && (
                                    <div className="bg-black border border-[#333] rounded-lg p-2 h-48 overflow-hidden flex items-center justify-center relative group">
                                        {formData.type === 'image' ? (
                                            <img src={formData.mediaUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <video src={formData.mediaUrl} className="max-w-full max-h-full" muted loop autoPlay />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, mediaUrl: "" })}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Sort Order</label>
                                        <input
                                            type="number"
                                            className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            className="w-4 h-4 accent-red-600"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <label htmlFor="isActive" className="text-gray-300 text-sm font-bold">Active Slide</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-[#222]">
                            <button type="button" onClick={resetForm} className="px-6 py-2 rounded text-gray-400 font-bold hover:text-white hover:bg-[#222] transition-colors">Cancel</button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-primary hover:bg-red-600 text-white px-8 py-2 rounded font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {formType === 'add' ? 'Create Slide' : 'Update Slide'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#222] text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Slide</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8 text-white"><Loader2 className="animate-spin mx-auto mb-2" />Loading slides...</td></tr>
                        ) : (
                            slides.map((slide) => (
                                <tr key={slide._id || slide.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-10 rounded bg-[#222] overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {slide.type === 'image' ? (
                                                    <img src={slide.mediaUrl} alt={slide.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <VideoIcon className="text-gray-500" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm truncate max-w-[200px]">{slide.title}</p>
                                                <p className="text-gray-500 text-xs truncate max-w-[200px]">{slide.subtitle}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            {slide.type === 'image' ? <ImageIcon size={14} /> : <VideoIcon size={14} />}
                                            <span className="text-xs uppercase font-bold">{slide.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">{slide.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${slide.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {slide.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(slide)} className="hover:text-primary p-1"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(slide._id || slide.id)} className="hover:text-red-500 p-1"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && slides.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-12 text-gray-500">No slides found. Add your first hero slide!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
