import { Skeleton } from "@/components/ui/Skeleton";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-white/5">
                    {Array.from({ length: columns }).map((_, j) => (
                        <td key={j} className="p-4">
                            <Skeleton className="h-4 w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
