import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

const PostsSkeleton = ({ num }: { num: number }) => (
  <div>
    {[...Array(num)].map((_, index) => (
      <Card key={index} className="mb-4 p-4 flex flex-direction-column">
        <Skeleton className="w-[100%] h-[20px] mb-1" />
        <Skeleton className="w-[80%] h-[20px] mb-1" />
        <Skeleton className="w-[80%] h-[20px] mb-1" />
        <Skeleton className="w-[80%] h-[20px] mb-3" />
      </Card>
    ))}
  </div>
);

export default PostsSkeleton;
