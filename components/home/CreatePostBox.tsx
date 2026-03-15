"use client";

import { useCreatePostModal } from "@/components/providers/CreatePostModalProvider";

interface CreatePostBoxProps {
  userAvatar?: string;
  userName?: string;
}

export default function CreatePostBox({
  userAvatar,
  userName,
}: CreatePostBoxProps) {
  const { openModal } = useCreatePostModal();

  return (
    <div
      className="border-b border-border/40 py-4 px-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
      onClick={openModal}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-surface/80 border border-border/40 overflow-hidden flex items-center justify-center">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted font-medium">
                {(userName || "U")[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center min-h-[36px]">
            <span className="text-muted text-[15px]">What&apos;s new?</span>
          </div>
        </div>

        {/* Post button */}
        <div className="flex-shrink-0 flex items-center">
          <button
            className="text-sm font-semibold text-muted hover:text-foreground transition-colors px-4 py-1.5 rounded-lg border border-border/40 hover:border-border"
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
