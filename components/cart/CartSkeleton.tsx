import { Skeleton } from "@/components/ui/Skeleton";

export default function CartSkeleton() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center mb-12">
                    <Skeleton className="h-10 w-64" />
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Cart Items List */}
                    <div className="lg:flex-[2] space-y-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0">
                                <div className="flex-shrink-0 w-32 h-40">
                                    <Skeleton className="w-full h-full" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-6 w-1/2" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                        <Skeleton className="h-4 w-12" />
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <Skeleton className="h-10 w-32" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:flex-1">
                        <div className="sticky top-24 space-y-8">
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-32 w-full rounded-md" />

                            <div className="pt-4 border-t border-gray-100/10">
                                <div className="flex justify-between items-end mb-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                                <Skeleton className="h-4 w-full mb-6" />
                                <Skeleton className="h-14 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
