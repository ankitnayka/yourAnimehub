"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import AnnouncementBar from "./layout/AnnouncementBar";
import { ThemeToggle } from "./ThemeToggle";
import SearchModal from "./Modals/SearchModal";
import CartDrawer from "./cart/CartDrawer";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  // Using store for cart state
  const { items, isOpen: openCart, setIsOpen: setOpenCart, fetchCart } = useCartStore();
  const { isAuthenticated, accessToken } = useAuthStore();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchCart(accessToken);
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [navLinks, setNavLinks] = useState([
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Catalog", href: "/catalog" },
    { name: "Contact", href: "/contact" },
  ]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await fetch('/api/navbar');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const mappedLinks = data.data.map((item: any) => ({
            name: item.label,
            href: item.path,
          }));
          setNavLinks(mappedLinks);
        }
      } catch (error) {
        console.error("Failed to fetch navbar items", error);
      }
    };

    fetchNavItems();
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent dark:bg-gradient-to-b dark:from-black/80 dark:to-transparent"}`}>
      <AnnouncementBar />

      <div className="max-w-[1920px] mx-auto px-6 py-6 flex justify-between items-center relative gap-8">

        {/* Mobile Menu Trigger & Left Nav (Desktop) */}
        <div className="flex items-center gap-12 flex-1">
          <button className="lg:hidden text-foreground" onClick={() => setOpenMenu(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden lg:flex gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-foreground/90 hover:text-primary transition-colors relative group"
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
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase font-display group-hover:text-gray-500 transition-colors">
                Your
              </span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-primary uppercase font-display animate-pulse">
                Anime
              </span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase font-display group-hover:text-gray-500 transition-colors">
                Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-8 flex-1 text-foreground">
          <button onClick={() => setOpenSearch(true)} className="hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <Search className="w-5 h-5" />
          </button>
          <Link href={isAuthenticated ? "/account/dashboard" : "/auth/login"} className="hidden md:block hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/wishlist" className="hidden md:block hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <Heart className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          <button onClick={() => setOpenCart(true)} className="relative hover:text-primary transition-colors transform hover:scale-110 duration-200">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-in zoom-in duration-300">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/90 z-[100] transition-transform duration-300 ${openMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full bg-secondary w-[85%] sm:w-[50%] p-8 relative">
          <button onClick={() => setOpenMenu(false)} className="absolute top-6 right-6 text-white p-2">
            <X className="w-8 h-8" />
          </button>

          <div className="mt-12 flex flex-col h-full">
            {/* Nav Links */}
            <ul className="flex flex-col gap-6 mb-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-2xl font-black uppercase text-black dark:text-white hover:text-primary tracking-wider"
                    onClick={() => setOpenMenu(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account/dashboard"
                    onClick={() => setOpenMenu(false)}
                    className="w-full bg-neutral-800 text-white text-center py-4 rounded-lg font-bold uppercase tracking-widest border border-white/10"
                  >
                    My Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpenMenu(false)}
                    className="w-full bg-white text-black text-center py-4 rounded-lg font-bold uppercase tracking-widest"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpenMenu(false)}
                    className="w-full bg-transparent text-white border border-white/20 text-center py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white/5"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {openSearch && <SearchModal close={() => setOpenSearch(false)} />}
    </header>
  );
}
