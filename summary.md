# Fash - Project Analysis & Summary

## 🏗️ Project Architecture & Tech Stack

*   **Framework:** Next.js 16.1.1 (App Router)
*   **Language:** TypeScript
*   **Database:** MongoDB (via Mongoose ODM)
*   **Styling:** Tailwind CSS + Framer Motion (for animations)
*   **Authentication:** NextAuth.js (User & Admin sessions)
*   **State Management:** Zustand
*   **Media Storage:** Cloudinary
*   **Payments:** Razorpay
*   **Deployment Target:** Vercel (implied by configuration files)

---

## 🔍 Detailed Functionality Analysis

### 1. 🛡️ Authentication & User Management
A robust dual-layer authentication system handles both regular customers and administrators.
*   **Sign Up/Login:** Users can register using email/password (Credentials) or Google OAuth.
*   **Role-Based Access Control (RBAC):** Distinct roles for `user`, `admin`, `super-admin`, and `sub-admin`.
*   **Session Persistence:** Uses JWT strategies with refresh token capabilities to keep users logged in.
*   **User Profile:**
    *   **Address Book:** Manage multiple shipping addresses.
    *   **Order History:** View past orders and their status.
    *   **Wishlist:** Save products for later (synced with the database).

### 2. 🛍️ Storefront (Client Features)
The public-facing side of the application (`app/(shop)`) allows customers to browse and purchase.
*   **Dynamic Home Page:**
    *   **Hero Slider:** Admin-controlled carousel supporting both images and videos with call-to-action buttons.
    *   **Featured Collections:** Sections for "New Arrivals" and "Featured Products".
*   **Product Catalog:**
    *   **Filtering:** Filter products by Category, Price, and other attributes.
    *   **Product Details:** Rich product pages with galleries (Cloudinary-optimized), descriptions, and related items.
*   **Shopping Cart:**
    *   **Real-time Updates:** Add/remove items and adjust specific quantities instantly.
    *   **Persistence:** Cart state is saved to the user's database profile, ensuring they don't lose items if they switch devices.
*   **Checkout & Payments:**
    *   **Gateway:** Integrated Razorpay for secure online payments.
    *   **Cash on Delivery (COD):** Option available for orders.
    *   **Order Creation:** Automatically generates order records linked to the user and updates inventory.

### 3. ⚙️ Admin Dashboard (`/admin`)
A comprehensive backend interface for store owners to manage the business.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for products, including image uploads and stock management.
*   **Category Management:** Organize products into categories for better navigation.
*   **Order Fulfillment:** View incoming orders, update shipping status (Processing, Shipped, Delivered), and generate/print invoices.
*   **Content Management (CMS):**
    *   **Hero Slides:** Upload and reorder the main homepage banners.
    *   **Site Settings:** Configure global settings like navigation menus.
*   **Customer Insights:** View registered users and their purchase history.

### 4. 🔧 Backend API (`/app/api`)
The application exposes a RESTful API to handle data operations, serving both the frontend and admin panel.
*   **Endpoints:**
    *   `/api/auth/*`: Handles login, registration, and token refreshing.
    *   `/api/products/*`: Fetches product data, handles filtering and search.
    *   `/api/orders/*`: Manages order creation and status updates.
    *   `/api/upload/*`: Handles secure file uploads to Cloudinary.
    *   `/api/admin/*`: Protected routes for sensitive admin operations.

### 5. 🎨 UI/UX Design
*   **Responsive Design:** Fully mobile-first implementation ensuring the site works on phones, tablets, and desktops.
*   **Theming:** Dark and Light mode support using `next-themes`.
*   **Animations:** Smooth transitions and interactive elements powered by `framer-motion`.
*   **Components:** Reusable UI library (Modals, Toasts, Sliders) ensuring consistency across the app.

---

## 📝 Executive Summary

**Fash** is a modern, full-stack e-commerce platform built for performance and scalability. It features a complete shopping lifecycle—from product discovery and cart management to secure checkout and order tracking.

For store owners, it provides a powerful **Admin Dashboard** to manage inventory, process orders, and control marketing assets like homepage banners without touching code. The architecture uses **MongoDB** for flexible data storage and **Next.js** for high-performance rendering, ensuring a fast and SEO-friendly experience for users.

**Key Highlights:**
*   ✅ **Admin-Controlled Content:** The homepage is dynamic and manageable via the admin panel.
*   ✅ **Secure Payments:** Full integration with Razorpay.
*   ✅ **Persistent User Experience:** Carts and wishlists are saved to user profiles.
*   ✅ **Modern Stack:** Built on the latest Next.js 16 with a clean, type-safe architecture.
