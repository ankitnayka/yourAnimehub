"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash } from "lucide-react";

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const products = [
        { id: 1, name: "Alpha Drip Sweatshirt", category: "Sweatshirt", price: 899, stock: 45, status: "Active" },
        { id: 2, name: "Midnight Black Tee", category: "T-Shirt", price: 599, stock: 120, status: "Active" },
        { id: 3, name: "Urban Frost Hoodie", category: "Hoodie", price: 1999, stock: 0, status: "Out of Stock" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">Products</h1>
                <button className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2 transition-colors">
                    <Plus size={18} /> Add New
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#222] text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-6 py-4 text-gray-400">{product.category}</td>
                                <td className="px-6 py-4 text-white">₹{product.price}</td>
                                <td className="px-6 py-4 text-gray-400">{product.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="hover:text-primary"><Edit size={16} /></button>
                                        <button className="hover:text-red-500"><Trash size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
