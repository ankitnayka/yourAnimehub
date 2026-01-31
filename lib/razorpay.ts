import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Create a Razorpay order
 * @param amount Amount in rupees (will be converted to paise)
 * @param receipt Unique receipt ID
 * @param notes Additional notes for the order
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
    amount: number,
    receipt: string,
    notes?: Record<string, string>
) {
    try {
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt,
            notes: notes || {},
        };

        const order = await razorpayInstance.orders.create(options);
        return { success: true, order };
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        return { success: false, error };
    }
}

/**
 * Verify Razorpay payment signature
 * @param orderId Razorpay order ID
 * @param paymentId Razorpay payment ID
 * @param signature Razorpay signature
 * @returns Boolean indicating if signature is valid
 */
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    try {
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
}

/**
 * Format amount from paise to rupees
 * @param amountInPaise Amount in paise
 * @returns Amount in rupees
 */
export function formatAmount(amountInPaise: number): number {
    return amountInPaise / 100;
}
