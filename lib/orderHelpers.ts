import Order from '@/models/Order';

/**
 * Calculate total amount from order items
 */
export function calculateOrderTotal(items: any[]): number {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Generate unique order receipt ID
 */
export function generateOrderReceipt(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORDER_${timestamp}_${random}`;
}

/**
 * Get status badge color based on order status
 */
export function getOrderStatusColor(status: string): string {
    const colors: Record<string, string> = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
        'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
        'Delivered': 'bg-green-100 text-green-800 border-green-200',
        'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Get payment status badge color
 */
export function getPaymentStatusColor(status: string): string {
    const colors: Record<string, string> = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Paid': 'bg-green-100 text-green-800 border-green-200',
        'Failed': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Format order date
 */
export function formatOrderDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format currency to Indian Rupees
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
