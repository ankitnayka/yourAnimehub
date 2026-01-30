export const ROLES = {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    SUB_ADMIN: 'sub-admin',
    USER: 'user',
} as const;

export const PERMISSIONS = {
    // Product Management
    MANAGE_PRODUCTS: 'manage_products',
    VIEW_PRODUCTS: 'view_products',

    // Order Management
    MANAGE_ORDERS: 'manage_orders',
    VIEW_ORDERS: 'view_orders',

    // Customer Management
    VIEW_CUSTOMERS: 'view_customers',
    MANAGE_CUSTOMERS: 'manage_customers',

    // Content Management (Dynamic)
    MANAGE_CATEGORIES: 'manage_categories',
    MANAGE_NAVBAR: 'manage_navbar',

    // System & Settings
    MANAGE_SETTINGS: 'manage_settings',
    MANAGE_ADMINS: 'manage_admins', // Only Super Admin usually
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
