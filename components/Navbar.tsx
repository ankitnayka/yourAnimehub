"use client";

import { ShoppingCart, User, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      className="
        absolute top-0 left-0 w-full z-50
        bg-transparent text-white
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          TRENZIC
        </h1>

        {/* Menu Links */}
        <ul className="hidden md:flex gap-8 font-medium">
          <li className="hover:text-gray-300 cursor-pointer">Home</li>
          <li className="hover:text-gray-300 cursor-pointer">All Products</li>
          <li className="hover:text-gray-300 cursor-pointer">Catalog</li>
          <li className="hover:text-gray-300 cursor-pointer">Contact</li>
          <li className="hover:text-gray-300 cursor-pointer">About Us</li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Search className="cursor-pointer hover:text-gray-300" />
          <User className="cursor-pointer hover:text-gray-300" />
          <ShoppingCart className="cursor-pointer hover:text-gray-300" />
        </div>
      </div>
    </nav>
  );
}





