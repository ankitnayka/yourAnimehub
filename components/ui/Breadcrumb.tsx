'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();

    // Mapping for readable names
    const routeNameMap: Record<string, string> = {
        'account': 'My Account',
        'dashboard': 'Dashboard',
        'addresses': 'Saved Addresses',
        'wishlist': 'Wishlist',
        'my-orders': 'My Orders',
        'products': 'All Products',
        'cart': 'Cart',
        'checkout': 'Checkout'
    };

    const getBreadcrumbs = () => {
        // Remove query parameters
        const asPathWithoutQuery = pathname.split('?')[0];

        // Split pathname into segments
        const asPathNestedRoutes = asPathWithoutQuery.split('/').filter(v => v.length > 0);

        // Build breadcrumbs list
        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
            // Build the URL for this breadcrumb
            const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');

            // Format the text
            let text = routeNameMap[subpath] || subpath.replace(/-/g, ' ');

            // Capitalize first letter of each word
            text = text.replace(/\b\w/g, c => c.toUpperCase());

            // Handle dynamic IDs (simple heuristic: if it looks like an ID)
            if (subpath.match(/^[0-9a-fA-F]{24}$/) || (text.length > 20 && !routeNameMap[subpath])) {
                text = 'Item Details'; // Generic fallback for IDs
                // If it's an order ID, maybe just say "Order Details"
                if (asPathNestedRoutes[idx - 1] === 'my-orders') {
                    text = 'Order Details';
                }
                // If it's a product slug, it usually stays as slug but formatted
            }

            return { href, text };
        });

        // Special handling: if we are in dashboard, we want the path to be Home > My Account
        // If we are in addresses, we want Home > My Account > Saved Addresses (where My Account links to /account/dashboard)

        // Adjust hrefs specifically for Account structure
        const adjustedCrumbs = crumblist.map(crumb => {
            if (crumb.text === 'My Account') {
                return { ...crumb, href: '/account/dashboard' };
            }
            return crumb;
        });

        return [{ href: '/', text: 'Home' }, ...adjustedCrumbs];
    };

    const breadcrumbs = getBreadcrumbs();

    // Don't show on home page
    if (pathname === '/') return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-2 text-sm text-neutral-400">
                {breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;

                    return (
                        <li key={crumb.href} className="flex items-center">
                            {idx > 0 && <ChevronRight className="w-4 h-4 mx-2 text-neutral-600" />}

                            {isLast ? (
                                <span className="font-semibold text-white pointer-events-none" aria-current="page">
                                    {crumb.text}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    {idx === 0 && <Home className="w-3.5 h-3.5" />}
                                    {crumb.text}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
