import React, { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { CircleX, Edit } from "lucide-react";
import { Post } from "../types";
import { trpc } from "@/trpc/client";

const PostComponent: React.FC<Pick<Post, "id" | "title" | "content" | "comments">> = ({ id, title, content, comments }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newContent, setNewContent] = useState(content ?? "");
  const [newTitle, setNewTitle] = useState(title ?? "");
  const [editMode, setEditMode] = useState(false);
  const utils = trpc.useUtils();

  const postCommentMutation = trpc.comment.create.useMutation();
  const deleteCommentMutation = trpc.comment.delete.useMutation();
  const updatePostMutation = trpc.post.update.useMutation();

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    postCommentMutation.mutate(
      { postId: `${id}`, content: newComment },
      {
        onSuccess: () => {
          utils.post.all.invalidate();
          setNewComment("");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(
      { id: commentId },
      { onSuccess: () => utils.post.all.invalidate() },
    );
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handlePostEdit = () => {
    updatePostMutation.mutate(
      {
        id,
        content: newContent,
        title: newTitle,
      },
      {
        onSuccess: () => {
          utils.post.all.invalidate();
          setNewContent("");
          setNewTitle("");
          setEditMode(false);
        },
      }
    );
  };

  return (
    <Card className="mb-4 p-4">
      <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight first-letter:uppercase mb-2">
        {editMode ? (
          <Input
            className="scroll-m-20 text-2xl font-extrabold tracking-tight first-letter:uppercase mb-2"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        ) : (
          title
        )}
        {!editMode && (
          <Button onClick={handleEdit} className="size-6 ml-2">
            <Edit />
          </Button>
        )}
      </h2>
      <p className="mb-2">
        {editMode ? (
          <>
            <Textarea
              className="w-5/6 mb-2"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <Button onClick={handlePostEdit}>Save</Button>
          </>
        ) : (
          content
        )}
      </p>
      {comments && comments.length > 0 && (
        <div className="mb-2">
          <Button onClick={() => setShowComments((prev) => !prev)} className="p-0" variant="link">
            Comments ({comments.length})
          </Button>
        </div>
      )}
      {showComments && (
        <>
          {comments?.map((comment) => (
            <Card key={comment.id} className="mb-4 p-4 relative">
              <p className="scroll-m-20 text-base tracking-tight pr-6">{comment.content}</p>
              <Button onClick={() => handleDeleteComment(comment.id)} className="absolute top-2 right-2" variant="ghost" size="icon">
                <CircleX />
              </Button>
            </Card>
          ))}
        </>
      )}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
          Send
        </Button>
      </div>
    </Card>
  );
};

export default PostComponent;
