"use client";

import React, { useState, ChangeEvent, JSX } from "react";
import { X, Search } from "lucide-react";

/* ----------------------------------------
   ✅ Types
---------------------------------------- */

type Product = {
  name: string;
  price: string;
  image: string;
};

type SearchModalProps = {
  close: () => void;
};

/* ----------------------------------------
   ✅ Dummy Data (Typed)
---------------------------------------- */

const products: Product[] = [
  {
    name: "Shadow Geometry Jacket-Blue Mist",
    price: "₹1,099.00",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Urban Drift Acid Wash T-Shirt-Indigo Blue",
    price: "₹1,499.00",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "CDS Hype Bomber – Steel Blue Fade",
    price: "₹1,099.00",
    image: "https://via.placeholder.com/60",
  },
];

const suggestions: string[] = [
  "light blue",
  "blue grey",
  "jacket blue mist",
  "steel blue fade",
  "unisex t shirt indigo blue",
];

/* ----------------------------------------
   ✅ Component
---------------------------------------- */

export default function SearchModal({
  close,
}: SearchModalProps): JSX.Element {
  const [query, setQuery] = useState<string>("");

  /* ----------------------------------------
     ✅ Highlight Function (Typed)
  ---------------------------------------- */

  const highlightText = (text: string): React.ReactNode => {
    if (!query) return text;

    const regex: RegExp = new RegExp(`(${query})`, "gi");

    const parts: string[] = text.split(regex);

    return parts.map((part: string, index: number) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-300 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ----------------------------------------
     ✅ Input Change Handler (Typed)
  ---------------------------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40">
      {/* Modal Box */}
      <div className="absolute top-0 left-0 w-full bg-white shadow-lg">
        
        {/* Search Input */}
        <div className="max-w-5xl mx-auto flex items-center border px-4 py-3 mt-6 rounded-md">
          
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleChange}
            className="w-full outline-none text-lg"
          />

          {/* Close Button */}
          <button
            onClick={close}
            type="button"
            className="ml-2"
          >
            <X className="text-gray-500 hover:text-black" />
          </button>

          {/* Search Icon */}
          <Search className="ml-3 text-gray-600" />
        </div>

        {/* Suggestions + Products */}
        {/* Suggestions + Products */}
<div className="max-w-5xl mx-auto mt-6 border-t">

  <div className="grid md:grid-cols-2 grid-cols-1">
    
    {/* Suggestions */}
    <div className="p-6 md:border-r">
      <h2 className="font-semibold mb-4">Suggestions</h2>

      <ul className="space-y-3 text-gray-700">
        {suggestions
          .filter((item: string) =>
            item.toLowerCase().includes(query.toLowerCase())
          )
          .map((item: string, index: number) => (
            <li
              key={index}
              className="cursor-pointer hover:text-black"
            >
              {highlightText(item)}
            </li>
          ))}
      </ul>
    </div>

    {/* Products */}
    <div className="p-6">
      <h2 className="font-semibold mb-4">Products</h2>

      <div className="space-y-6 max-h-[300px] overflow-y-auto">
        {products
          .filter((product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          )
          .map((product: Product, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-md"
              />

              <div>
                <p className="text-gray-800 font-medium">
                  {highlightText(product.name)}
                </p>

                <p className="text-red-500 font-semibold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
</div>


        {/* Footer */}
        <p className="text-sm text-gray-500 max-w-5xl mx-auto px-6 py-4 border-t">
          Results for "<span className="font-semibold">{query}</span>"
        </p>
      </div>
    </div>
  );
}
