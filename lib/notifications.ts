import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { formatCurrency } from './orderHelpers';

interface NotificationParams {
    email: string;
    phone: string;
    name: string;
    orderId: string;
    totalAmount: number;
    items: any[];
}

// Helper to get email transporter safely
const getTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Helper to get Twilio client safely
const getTwilioClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};


export async function sendOrderNotifications({ email, phone, name, orderId, totalAmount, items }: NotificationParams) {
    const orderItemsSummary = items.map(item =>
        `- ${item.title} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');

    const totalFormatted = formatCurrency(totalAmount);

    // 1. Send Email
    try {
        const transporter = getTransporter();

        if (!transporter) {
            console.log("Email credentials missing, skipping email.");
        } else {
            const mailOptions = {
                from: `"YourAnimeHub" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Order Confirmation - #${orderId.slice(-6).toUpperCase()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">Order Confirmed!</h1>
                        <p>Hi ${name},</p>
                        <p>Thank you for your order at YourAnimeHub. Your order has been placed successfully.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Order Summary (${orderId.slice(-6).toUpperCase()})</h3>
                            <ul style="list-style: none; padding: 0;">
                                ${items.map(item => `
                                    <li style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between;">
                                        <span>${item.title} <small>(x${item.quantity})</small></span>
                                        <strong>${formatCurrency(item.price * item.quantity)}</strong>
                                    </li>
                                `).join('')}
                            </ul>
                            <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: bold;">
                                <span>TOTAL</span>
                                <span>${totalFormatted}</span>
                            </div>
                        </div>
                        
                        <p>We will notify you once your order is shipped!</p>
                        <p style="font-size: 12px; color: #777;">If you have any questions, reply to this email.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent to ${email}`);
        }
    } catch (error) {
        console.error("Failed to send email:", error);
    }

    // 2. Send WhatsApp
    try {
        const twilioClient = getTwilioClient();
        if (!twilioClient || !process.env.TWILIO_WHATSAPP_NUMBER) {
            console.log("Twilio credentials missing, skipping WhatsApp.");
        } else {
            // Note: Twilio Sandbox usually requires a template for session initiation, 
            // but if the user has replied recently, freeform works. 
            // For production, you need approved templates.
            // This is a basic generic message.

            // Ensure phone number is in E.164 format (e.g. +91XXXXXXXXXX)
            // Assuming input might not have country code, let's prepend generic if missing (users often just type 9876543210)
            // A simple heuristic for now.
            let formattedPhone = phone.replace(/\D/g, ''); // remove non-digits
            if (formattedPhone.length === 10) {
                formattedPhone = `+91${formattedPhone}`; // Default to India as per currency hints earlier
            } else if (!formattedPhone.startsWith('+')) {
                formattedPhone = `+${formattedPhone}`;
            }

            const message = `*Order Confirmed!* 🎉\n\nHi ${name}, thanks for shopping with YourAnimeHub!\n\n*Order ID:* #${orderId.slice(-6).toUpperCase()}\n*Total:* ${totalFormatted}\n\n*Items:*\n${orderItemsSummary}\n\nWe will update you when it ships! 🚀`;

            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: `whatsapp:${formattedPhone}`
            });
            console.log(`WhatsApp notification sent to ${formattedPhone}`);
        }
    } catch (error) {
        console.error("Failed to send WhatsApp:", error);
    }
}
