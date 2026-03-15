"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/types";

// Mock posts data
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    user_id: "user1",
    shelby_file_id: "file1",
    shelby_file_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    file_type: "image",
    media_width: 800,
    media_height: 600,
    caption:
      "Just finished reading an amazing book about building decentralized apps. The future of web3 is so exciting! 🚀",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user1",
      wallet_address: "0x1234...5678",
      username: "alex_dev",
      display_name: "Alex Chen",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      bio: "Full-stack developer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 42,
    comments_count: 8,
    is_liked: false,
  },
  {
    id: "2",
    user_id: "user2",
    shelby_file_id: "file2",
    shelby_file_url:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    file_type: "image",
    media_width: 800,
    media_height: 600,
    caption:
      "Morning hike to clear my mind. Sometimes the best ideas come when you step away from the screen. What's your favorite way to reset? 🏔️",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user2",
      wallet_address: "0xabcd...efgh",
      username: "sarah_wanderer",
      display_name: "Sarah Johnson",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Adventure seeker & photographer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 156,
    comments_count: 23,
    is_liked: true,
  },
  {
    id: "3",
    user_id: "user3",
    shelby_file_id: "file3",
    shelby_file_url:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    file_type: "image",
    media_width: 800,
    media_height: 600,
    caption:
      "Late night coding session. Building something special with the team. Can't wait to share what we've been working on! Stay tuned 👨‍💻✨",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user3",
      wallet_address: "0x9876...5432",
      username: "mike_codes",
      display_name: "Mike Thompson",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      bio: "Startup founder & code enthusiast",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 89,
    comments_count: 15,
    is_liked: false,
  },
  {
    id: "4",
    user_id: "user4",
    shelby_file_id: "file4",
    shelby_file_url:
      "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800",
    file_type: "image",
    media_width: 800,
    media_height: 600,
    caption:
      "Coffee and contemplation. Grateful for another day to create, learn, and grow. Remember: progress over perfection ☕️💭",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user4",
      wallet_address: "0x5555...9999",
      username: "emma_creates",
      display_name: "Emma Wilson",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      bio: "Designer & creative thinker",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 203,
    comments_count: 31,
    is_liked: true,
  },
];

export default function Feed() {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-foreground/20 border-r-foreground"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted text-sm mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-foreground hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted text-[15px]">No posts yet</p>
        <p className="text-muted/60 text-sm mt-1">
          Follow people to see their posts here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
