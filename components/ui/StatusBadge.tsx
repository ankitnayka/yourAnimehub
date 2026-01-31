'use client';

import { getOrderStatusColor, getPaymentStatusColor } from '@/lib/orderHelpers';

interface StatusBadgeProps {
    status: string;
    type?: 'order' | 'payment';
}

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
    const colorClass = type === 'order'
        ? getOrderStatusColor(status)
        : getPaymentStatusColor(status);

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {status}
        </span>
    );
}
