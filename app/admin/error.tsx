'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#111] border border-[#222] rounded-xl m-4 h-[50vh]">
            <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong!</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
                We encountered an error while loading this section.
                <br />
                <span className="text-xs text-gray-600 font-mono mt-2 block">{error.message}</span>
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold uppercase text-sm transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
