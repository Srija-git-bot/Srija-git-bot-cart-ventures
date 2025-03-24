
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-9 w-full mt-auto" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
