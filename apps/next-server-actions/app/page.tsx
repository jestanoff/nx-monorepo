"use client";
import { useEffect, useState } from "react";
import Feed from "./components/Feed";
import PostsSkeleton from "./components/PostsSkeleton";
import { listPosts } from "./actions/posts";
import { Post } from "./types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);

  const fetchPosts = async (cursor?: number) => {
    const res = await listPosts(20, cursor);
    if (res.posts) setPosts(res.posts);
    if (res.nextCursor) setCursor(res.nextCursor);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
        Social feed
      </h1>
      <>
      {posts ? (
        <Feed posts={posts} refreshPosts={fetchPosts} />
      ) : (
        <PostsSkeleton num={5} />
      )}
      </>
    </div>
  );
}
