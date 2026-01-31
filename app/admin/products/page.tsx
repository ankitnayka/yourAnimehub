"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Search, Edit, Trash, X, Save, Upload, Loader2, DollarSign, Package } from "lucide-react";
import api from "@/lib/api";

export default function AdminProductsPage() {
    const { accessToken } = useAuthStore();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "" as string | number, // Selling Price
        originalPrice: "" as string | number, // MRP
        category: "",
        image: "",
        stock: 0,
        status: "Active",
        isFeatured: false,
        isNewArrival: false,
    });

    useEffect(() => {
        fetchData();
    }, [accessToken]);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get("/api/products"),
                api.get("/api/admin/categories")
            ]);

            if (prodRes.data?.success) setProducts(prodRes.data.data);
            if (catRes.data?.success) setCategories(catRes.data.data);

        } catch (error) {
            console.error("Failed to fetch data", error);
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
                setFormData(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                stock: Number(formData.stock)
            };

            if (formType === 'add') {
                await api.post('/api/products', payload);
            } else {
                if (!selectedId) return;
                await api.put(`/api/products/${selectedId}`, payload);
            }

            resetForm();
            fetchData();
        } catch (error: any) {
            alert(error.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/api/products/${id}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            originalPrice: product.originalPrice || "",
            category: product.category,
            image: product.image,
            stock: product.stock || 0,
            status: product.status || "Active",
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false
        });
        setSelectedId(product._id || product.id);
        setFormType('edit');
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setFormData({
            name: "",
            description: "",
            price: "",
            originalPrice: "",
            category: "",
            image: "",
            stock: 0,
            status: "Active",
            isFeatured: false,
            isNewArrival: false,
        });
        setSelectedId(null);
        setFormType('add');
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Products</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Search */}
            {!showForm && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            {showForm && (
                <div className="bg-[#111] border border-[#222] p-6 rounded-xl mb-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white uppercase">{formType === 'add' ? 'New Product' : 'Edit Product'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Product Name</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none h-32"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-b border-[#222] pb-4 mb-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Selling Price (₹)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input
                                                type="number" required
                                                placeholder="e.g. 899"
                                                className="w-full bg-black border border-[#333] pl-9 p-3 rounded text-white focus:border-red-600 outline-none"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Original Price / MRP (₹)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input
                                                type="number" required
                                                placeholder="e.g. 1999"
                                                className="w-full bg-black border border-[#333] pl-9 p-3 rounded text-white focus:border-red-600 outline-none"
                                                value={formData.originalPrice}
                                                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Stock Available</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                        <input
                                            type="number" required
                                            className="w-full bg-black border border-[#333] pl-9 p-3 rounded text-white focus:border-red-600 outline-none"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Category</label>
                                    <select
                                        required
                                        className="w-full bg-black border border-[#333] p-3 rounded text-white focus:border-red-600 outline-none appearance-none"
                                        value={formData.category} // Store standard category name
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c.name}>{c.name}</option> // Use standard name
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Product Image</label>
                                    <div className="border border-dashed border-[#333] bg-black rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-500 transition-colors relative">
                                        {formData.image ? (
                                            <div className="relative w-full h-48">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: "" })}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {uploading ? <Loader2 className="animate-spin text-primary mb-2" /> : <Upload className="text-gray-500 mb-2" size={32} />}
                                                <p className="text-gray-400 text-sm">{uploading ? "Uploading..." : "Click to upload image"}</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    disabled={uploading}
                                                />
                                            </>
                                        )}
                                    </div>
                                    {formData.image && <p className="text-xs text-gray-500 mt-2 truncate">{formData.image}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-2 bg-[#0a0a0a] p-3 rounded border border-[#222]">
                                        <input
                                            type="checkbox"
                                            id="isFeatured"
                                            className="w-4 h-4 accent-red-600"
                                            checked={formData.isFeatured}
                                            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        />
                                        <label htmlFor="isFeatured" className="text-gray-300 text-sm font-bold">Featured Product</label>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#0a0a0a] p-3 rounded border border-[#222]">
                                        <input
                                            type="checkbox"
                                            id="isNewArrival"
                                            className="w-4 h-4 accent-red-600"
                                            checked={formData.isNewArrival}
                                            onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                        />
                                        <label htmlFor="isNewArrival" className="text-gray-300 text-sm font-bold">New Arrival</label>
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
                                {formType === 'add' ? 'Create Product' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#222] text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8 text-white"><Loader2 className="animate-spin mx-auto mb-2" />Loading products...</td></tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id || product.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-[#222] overflow-hidden flex-shrink-0">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600"><Package size={16} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{product.name}</p>
                                                {product.isFeatured && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1 rounded mr-1">Featured</span>}
                                                {product.isNewArrival && <span className="text-[10px] bg-blue-500/20 text-blue-500 px-1 rounded">New</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{product.category}</td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        <div className="flex flex-col">
                                            <span className="font-bold">₹{product.price}</span>
                                            <span className="text-gray-500 text-[10px] line-through">₹{product.originalPrice}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{product.stock || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                            }`}>
                                            {product.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="hover:text-primary p-1"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product._id || product.id)} className="hover:text-red-500 p-1"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && filteredProducts.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-500">No products found. Add one above!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
