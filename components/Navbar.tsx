"use client";

import React, { useState } from "react";
import { Search, Menu, X, User, ShoppingCart } from "lucide-react";
import SearchModal from "./Modals/SearchModal";
// import SearchModal from "./SearchModal";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full z-50 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">

          {/* Logo */}
          {/* Mobile Hamburger */}
          <button
            className="md:hidden "
            onClick={() => setOpenMenu(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
          <h1 className="text-xl font-bold tracking-wide  ">
            Your<span className="text-red-600">Anime</span>Hub
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 font-medium">
            <li className="relative cursor-pointer hover:text-red-500
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-red-500
  after:transition-all after:duration-200
  hover:after:w-full
"
onClick={() => setActive("home")}>

              Home
            </li>

            <li className="relative cursor-pointer hover:text-red-500
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-red-500
  after:transition-all after:duration-200
  hover:after:w-full
"
onClick={() => setActive("all-products")} 
>All Products</li>
            <li className="relative cursor-pointer hover:text-red-500
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-red-500
  after:transition-all after:duration-200
  hover:after:w-full
"
onClick={() => setActive("catalog")} 
>Catalog</li>
            <li className="relative cursor-pointer hover:text-red-500
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-red-500
  after:transition-all after:duration-200
  hover:after:w-full
"
onClick={() => setActive("contact")} 
>Contact</li>
            <li className="relative cursor-pointer hover:text-red-500
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-red-500
  after:transition-all after:duration-200
  hover:after:w-full
"
onClick={() => setActive("about-us")} 
>About Us</li>
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button onClick={() => setOpenSearch(true)}>
              <Search className="w-6 h-6" />
            </button>
            <button>
              <User className="w-6 h-6" />
            </button>
            <button>
              <ShoppingCart className="w-6 h-6" />
            </button>


          </div>
        </div>
      </nav>

      {/* ✅ Mobile Menu Drawer */}
      {openMenu && (
        <div className="fixed inset-0  bg-black/70 z-[999]">
          <div className="bg-black w-[80%] h-full p-6">

            {/* Close Button */}
            <button
              className="mb-6"
              onClick={() => setOpenMenu(false)}
            >
              <X className="text-black w-7 h-7" />
            </button>

            {/* Mobile Links */}
            <ul className="flex flex-col gap-6 text-lg font-semibold text-white">
              <li className="hover:text-red-500 cursor-pointer">Home</li>
              <li className="hover:text-red-500 cursor-pointer">All Products</li>
              <li className="hover:text-red-500 cursor-pointer">Catalog</li>
              <li className="hover:text-red-500 cursor-pointer">Contact</li>
              <li className="hover:text-red-500 cursor-pointer">About Us</li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {openSearch && <SearchModal close={() => setOpenSearch(false)} />}
    </>
  );
}
