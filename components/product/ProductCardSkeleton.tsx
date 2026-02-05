import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
    return (
        <div className="flex flex-col bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden h-full">
            {/* Image Container Skeleton */}
            <div className="aspect-[4/5] w-full bg-gray-200 dark:bg-white/5 relative">
                <Skeleton className="absolute inset-0 w-full h-full" />
            </div>

            {/* Product Details Skeleton */}
            <div className="p-3 flex flex-col gap-3 flex-1">
                {/* Title */}
                <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Price Row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-5 w-12 rounded-sm" />
                </div>

                {/* Action Button */}
                <div className="mt-2 text-center">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}
