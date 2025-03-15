export interface Comment {
  id: number;
  content: string;
  postId: number;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number | null;
  comments: Comment[];
}
