import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    List,
    Menu,
    Shield
} from "lucide-react";
import { PERMISSIONS } from "@/lib/constants";

export interface SidebarItem {
    name: string;
    href: string;
    icon: any;
    requiredPermission?: string;
}

export const ADMIN_SIDEBAR_CONFIG: SidebarItem[] = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Package,
        requiredPermission: PERMISSIONS.MANAGE_PRODUCTS
    },
    {
        name: "Categories",
        href: "/admin/categories",
        icon: List,
        requiredPermission: PERMISSIONS.MANAGE_CATEGORIES
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
        requiredPermission: PERMISSIONS.MANAGE_ORDERS
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: Users,
        requiredPermission: PERMISSIONS.VIEW_CUSTOMERS
    },
    {
        name: "Navbar Manager",
        href: "/admin/settings/navbar",
        icon: Menu,
        requiredPermission: PERMISSIONS.MANAGE_NAVBAR
    },
    {
        name: "Admin Team",
        href: "/admin/settings/admins",
        icon: Shield,
        requiredPermission: PERMISSIONS.MANAGE_ADMINS
    },
    {
        name: "Announcement",
        href: "/admin/settings/announcement",
        icon: Settings, // Using Settings icon as it's a setting
        requiredPermission: PERMISSIONS.MANAGE_SETTINGS
    },
    {
        name: "Hero Slider",
        href: "/admin/hero",
        icon: LayoutDashboard,
        requiredPermission: PERMISSIONS.MANAGE_SETTINGS
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
        requiredPermission: PERMISSIONS.MANAGE_SETTINGS
    },
];
