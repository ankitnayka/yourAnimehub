import React from 'react';

export default function RefundPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white">Returns & Refunds</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Return Policy</h2>
                    <p>
                        Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.
                        To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Refunds</h2>
                    <p>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item.
                        We will also notify you of the approval or rejection of your refund.
                        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Exchanges</h2>
                    <p>
                        We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at contact@youranimehub.com.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Shipping Returns</h2>
                    <p>
                        To return your product, you should mail your product to our physical address.
                        You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
                    </p>
                </section>
            </div>
        </div>
    );
}
