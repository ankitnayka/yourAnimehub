import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="w-full mb-4">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
                        <Link
                            href={item.href}
                            className={`text-sm font-medium uppercase tracking-wider ${index === items.length - 1
                                    ? 'text-white pointer-events-none'
                                    : 'text-gray-500 hover:text-white transition-colors'
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
