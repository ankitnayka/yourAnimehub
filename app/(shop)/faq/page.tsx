import React from 'react';

export default function FAQPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-center text-black dark:text-white">Frequently Asked Questions</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Find answers to common questions about shipping, returns, product details, and more.
            </p>

            <div className="space-y-4">
                <Accordion
                    title="What is your return policy?"
                    content="We accept returns within 30 days of purchase. Items must be unused and in original packaging. Please visit our Refund Policy page for more details."
                />
                <Accordion
                    title="How long does shipping take?"
                    content="Standard shipping typically takes 5-7 business days. Express shipping is available and takes 2-3 business days. Processing times are usually 1-3 business days."
                />
                <Accordion
                    title="Do you ship internationally?"
                    content="Yes, we ship to select international destinations. Shipping rates and times vary by location calculated at checkout."
                />
                <Accordion
                    title="Can I track my order?"
                    content="Absolutely! Once your order ships, you will receive a confirmation email with a tracking number. You can also use our Track Order page."
                />
                <Accordion
                    title="How do I care for my anime apparel?"
                    content="We recommend washing inside out in cold water and hanging to dry to preserve the print quality and fabric life."
                />
                <Accordion
                    title="Are your products officially licensed?"
                    content="Yes, we work directly with licensed distributors to ensure all our merchandise is 100% authentic."
                />
            </div>
        </div>
    );
}

function Accordion({ title, content }: { title: string, content: string }) {
    return (
        <details className="group bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg overflow-hidden transition-colors shadow-sm">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="font-bold text-black dark:text-white text-lg">{title}</h3>
                <span className="text-primary transition-transform group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </span>
            </summary>
            <div className="px-6 pb-6 text-gray-700 dark:text-gray-400 leading-relaxed">
                {content}
            </div>
        </details>
    );
}
