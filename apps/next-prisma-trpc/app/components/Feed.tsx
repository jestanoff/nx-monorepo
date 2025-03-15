import { Post } from "../types";
import PostComponent from "./Post";

interface FeedProps {
  posts: Post[];
}

const Feed = ({ posts }: FeedProps) => {
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
            />
          )
      )}
    </>
  );
};

export default Feed;
