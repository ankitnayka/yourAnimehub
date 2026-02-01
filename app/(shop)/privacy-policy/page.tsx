import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white">Privacy Policy</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Introduction</h2>
                    <p>
                        Your privacy is important to us. It is YourAnimeHub's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Information We Collect</h2>
                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                        We also let you know why we’re collecting it and how it will be used.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Data Retention</h2>
                    <p>
                        We only retain collected information for as long as necessary to provide you with your requested service.
                        What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">Sharing of Data</h2>
                    <p>
                        We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
                    </p>
                </section>
            </div>
        </div>
    );
}
