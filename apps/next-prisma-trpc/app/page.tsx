"use client";
import { trpc } from "@/trpc/client";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Feed from "./components/Feed";
import PostsSkeleton from "./components/PostsSkeleton";

// export default async function Index() {
//   void trpc.post.all.prefetch({ limit: 50 });

//   return (
//     <div>
//       <ClientGreeting />
//     </div>
//   );
// }

export default function Home() {
  const fetchingRef = useRef(false);
  const { ref: loadingRef, inView: isLoadingVisible } = useInView({
    rootMargin: "50%",
    threshold: 0.1,
  });

  const postQuery = trpc.post.all.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch, isStale } =
    postQuery;

  useEffect(() => {
    const shouldFetch =
      isLoadingVisible && hasNextPage && !isFetchingNextPage && !isFetching && !fetchingRef.current;

    if (shouldFetch) {
      fetchingRef.current = true;
      fetchNextPage().finally(() => {
        fetchingRef.current = false;
      });
    }
  }, [isLoadingVisible, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching]);

  useEffect(() => {
    // Refetch the data when the cache is invalidated
    if (isStale) {
      refetch();
    }
  }, [isStale, refetch]);

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
        Social feed
      </h1>
      {data?.pages ? (
        data.pages.map((page, pageIndex) => <Feed key={pageIndex} posts={page.posts} />)
      ) : (
        <PostsSkeleton num={5} />
      )}
      <div ref={loadingRef} className="h-10">
        {isFetchingNextPage && <PostsSkeleton num={1} />}
      </div>
    </div>
  );
}
