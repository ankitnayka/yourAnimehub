"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import AnnouncementBar from "./layout/AnnouncementBar";
import SearchModal from "./Modals/SearchModal";
import CartDrawer from "./cart/CartDrawer";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Catalog", href: "/catalog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"}`}>
      <AnnouncementBar />

      <div className="max-w-[1920px] mx-auto px-10 py-6 flex justify-between items-center relative gap-8">

        {/* Mobile Menu Trigger & Left Nav (Desktop) */}
        <div className="flex items-center gap-12 flex-1">
          <button className="lg:hidden text-white" onClick={() => setOpenMenu(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden lg:flex gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-white/90 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Logo - Animated */}
        <div className="flex-none flex justify-center">
          <Link href="/" className="group relative">
            <div className="flex items-center gap-1">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase font-display group-hover:text-gray-200 transition-colors">
                Your
              </span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-primary uppercase font-display animate-pulse">
                Anime
              </span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase font-display group-hover:text-gray-200 transition-colors">
                Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-8 flex-1 text-white">
          <button onClick={() => setOpenSearch(true)} className="hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <Search className="w-5 h-5" />
          </button>
          <Link href={isAuthenticated ? "/account/dashboard" : "/auth/login"} className="hidden md:block hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/wishlist" className="hidden md:block hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <Heart className="w-5 h-5" />
          </Link>
          <button onClick={() => setOpenCart(true)} className="relative hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/90 z-[100] transition-transform duration-300 ${openMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full bg-secondary w-[85%] sm:w-[50%] p-8">
          <button onClick={() => setOpenMenu(false)} className="self-end mb-8 text-white">
            <X className="w-8 h-8" />
          </button>

          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-2xl font-black uppercase text-white hover:text-primary tracking-wider"
                  onClick={() => setOpenMenu(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {openSearch && <SearchModal close={() => setOpenSearch(false)} />}
    </header>
  );
}
