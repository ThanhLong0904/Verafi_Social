"use client";

import { useState } from "react";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <article className="border-b border-border/40 py-4 px-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex gap-3 max-w-[630px] mx-auto">
        {/* Avatar */}
        <Link href={`/profile/${post.user_id}`} className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-surface/80 border border-border/40 overflow-hidden flex items-center justify-center">
            {post.user?.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.display_name || post.user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted font-medium">
                {(post.user?.display_name ||
                  post.user?.username ||
                  "U")[0].toUpperCase()}
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.user_id}`}>
                <span className="font-semibold text-[15px] hover:underline">
                  {post.user?.display_name || post.user?.username || "Unknown"}
                </span>
              </Link>
              <span className="text-muted text-sm">
                {formatDate(post.created_at)}
              </span>
            </div>
            <button className="text-muted hover:text-foreground p-1 -mr-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="text-[15px] leading-[1.4] mb-3 text-foreground/95 break-words">
              {post.caption}
            </div>
          )}

          {/* Media */}
          {post.shelby_file_url && (
            <Link href={`/post/${post.id}`} className="block mb-3">
              <div className="rounded-xl overflow-hidden border border-border/40 bg-black/5">
                {post.file_type === "image" ? (
                  <img
                    src={post.shelby_file_url}
                    alt={post.caption || "Post image"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    style={{ maxHeight: "500px" }}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.svg";
                    }}
                  />
                ) : (
                  <video
                    src={post.shelby_file_url}
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                    style={{ maxHeight: "500px" }}
                  />
                )}
              </div>
            </Link>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 -ml-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isLiked
                    ? "text-pink-500 fill-pink-500"
                    : "text-muted group-hover:text-pink-400"
                }`}
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {likesCount > 0 && (
                <span className="text-[13px] text-muted group-hover:text-foreground">
                  {likesCount}
                </span>
              )}
            </button>

            {/* Comment */}
            <Link href={`/post/${post.id}`}>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group">
                <svg
                  className="w-5 h-5 text-muted group-hover:text-foreground transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {post.comments_count && post.comments_count > 0 && (
                  <span className="text-[13px] text-muted group-hover:text-foreground">
                    {post.comments_count}
                  </span>
                )}
              </button>
            </Link>

            {/* Repost */}
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group">
              <svg
                className="w-5 h-5 text-muted group-hover:text-emerald-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group">
              <svg
                className="w-5 h-5 text-muted group-hover:text-foreground transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
