import React from 'react';

export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white">Terms of Service</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">1. Terms</h2>
                    <p>
                        By accessing the website at YourAnimeHub, you are agreeing to be bound by these terms of service, all applicable laws and regulations,
                        and agree that you are responsible for compliance with any applicable local laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on YourAnimeHub's website for personal,
                        non-commercial transitory viewing only.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">3. Disclaimer</h2>
                    <p>
                        The materials on YourAnimeHub's website are provided on an 'as is' basis. YourAnimeHub makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">4. Limitations</h2>
                    <p>
                        In no event shall YourAnimeHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on YourAnimeHub's website.
                    </p>
                </section>
            </div>
        </div>
    );
}
