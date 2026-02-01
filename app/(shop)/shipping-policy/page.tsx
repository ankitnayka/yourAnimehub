import React from 'react';

export default function ShippingPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white">Shipping Policy</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Order Processing</h2>
                    <p>
                        All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Shipping Rates & Delivery Estimates</h2>
                    <p className="mb-4">
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Standard Shipping:</strong> 5-7 business days - Free for orders over ₹1799</li>
                        <li><strong>Express Shipping:</strong> 2-3 business days - ₹150</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Shipment Confirmation & Order Tracking</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                        The tracking number will be active within 24 hours.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Damages</h2>
                    <p>
                        YourAnimeHub is not liable for any products damaged or lost during shipping. If you received your order damaged,
                        please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
                    </p>
                </section>
            </div>
        </div>
    );
}
