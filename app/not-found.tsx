'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white dark:bg-[#0f172a] p-6 text-center">
            <div className="relative w-full max-w-lg aspect-auto mb-8">
                {/* We would place the generated image here. For now, creating a layout that matches the request */}
                <img
                    src="/404-illustration.png"
                    alt="404 Page Not Found"
                    className="w-full h-auto object-contain"
                />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
                    Ooops!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium">
                    the page you are looking for does not exist!
                </p>

                <Link
                    href="/"
                    className="inline-block mt-6 px-8 py-3 bg-[#7FB3D5] text-white font-bold rounded shadow-md hover:bg-[#6CA6CD] transition-all uppercase tracking-wide"
                >
                    Go Back
                </Link>
            </div>
        </div>
    );
}
