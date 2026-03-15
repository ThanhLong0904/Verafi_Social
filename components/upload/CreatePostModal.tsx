"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import MediaUpload from "./MediaUpload";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { account } = useWallet();

  // Format wallet address
  const walletAddress = account?.address?.toString();
  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Not connected";

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-2xl shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface border-b border-border/40 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-foreground hover:text-muted transition-colors text-[15px] font-medium"
          >
            Cancel
          </button>
          <h2 className="text-[15px] font-semibold text-foreground absolute left-1/2 -translate-x-1/2">
            {displayAddress}
          </h2>
          <div className="flex items-center gap-2">
            {/* Attachment icon */}
            <button className="text-muted hover:text-foreground transition-colors p-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            {/* Emoji icon */}
            <button className="text-muted hover:text-foreground transition-colors p-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <MediaUpload
            onUploadSuccess={() => {
              onClose();
              router.push("/");
              router.refresh();
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              alert(`Upload failed: ${error}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
