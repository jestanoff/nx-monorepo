import { Post } from "../types";
import PostComponent from "./Post";

interface FeedProps {
  posts: Post[];
  refreshPosts: () => Promise<void>;
}

const Feed = ({ posts, refreshPosts }: FeedProps) => {
  return (
    <>
      {posts.map(
        (post) =>
          post.published && (
            <PostComponent
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              comments={post.comments}
              refreshPosts={refreshPosts}
            />
          ),
      )}
    </>
  );
};

export default Feed;
