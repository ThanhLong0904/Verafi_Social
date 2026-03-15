"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useRef } from "react";
import { encodeFile } from "@/utils/encodeFile";
import { useSubmitFileToChain } from "@/hooks/useSubmitFileToChain";
import { useUploadFile } from "@/hooks/useUploadFile";

interface MediaUploadProps {
  onUploadSuccess?: (data: {
    fileId: string;
    fileUrl: string;
    fileType: "image" | "video";
  }) => void;
  onUploadError?: (error: string) => void;
}

export default function MediaUpload({
  onUploadSuccess,
  onUploadError,
}: MediaUploadProps) {
  const { account, wallet } = useWallet();
  const { uploadFileToRcp } = useUploadFile();
  const { submitFileToChain } = useSubmitFileToChain();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (
      !selectedFile.type.startsWith("image/") &&
      !selectedFile.type.startsWith("video/")
    ) {
      onUploadError?.("Please select an image or video file");
      return;
    }

    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      onUploadError?.("File size must be less than 100MB");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file || !account || !wallet) {
      onUploadError?.("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage("");

    try {
      // Determine file type
      const fileType = file.type.startsWith("image/") ? "image" : "video";

      // Generate unique blob name to avoid conflicts (timestamp-originalname.ext)
      const timestamp = Date.now();
      const uniqueBlobName = `${timestamp}-${file.name}`;

      // Step 1: Encode the file
      setUploadStage("Encoding file...");
      setUploadProgress(10);
      const commitments = await encodeFile(file);

      // Step 2: Submit the file to the chain
      setUploadStage("Submitting transaction to chain...");
      setUploadProgress(30);
      await submitFileToChain(commitments, file, uniqueBlobName);

      // Step 3: Upload the file to the RPC
      setUploadStage("Uploading file to Shelby RPC...");
      setUploadProgress(60);
      await uploadFileToRcp(file, uniqueBlobName);

      // Step 4: Get the blob URL
      setUploadStage("Getting file URL...");
      setUploadProgress(80);
      const shelbyApiUrl =
        process.env.NEXT_PUBLIC_SHELBY_API_URL ||
        "https://api.shelbynet.shelby.xyz";
      const fileUrl = `${shelbyApiUrl}/v1/blobs/${account.address.toString()}/${uniqueBlobName}`;
      const fileId = `${account.address.toString()}/${uniqueBlobName}`;

      // Step 5: Save metadata to Supabase
      setUploadStage("Saving post metadata...");
      setUploadProgress(90);
      const formData = new FormData();
      formData.append("shelbyFileId", fileId);
      formData.append("shelbyFileUrl", fileUrl);
      formData.append("fileType", fileType);
      if (caption) {
        formData.append("caption", caption);
      }

      const saveResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save post metadata");
      }

      setUploadProgress(100);
      setUploadStage("Upload complete!");

      // Call success callback
      onUploadSuccess?.({
        fileId,
        fileUrl,
        fileType,
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setCaption("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      onUploadError?.(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  return (
    <div className="w-full">
      {/* User info + Caption Input */}
      <div className="px-4 py-3">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-surface/80 border border-border/40 overflow-hidden flex items-center justify-center">
              <span className="text-xs text-muted font-medium">
                {account?.address?.toString()[0]?.toUpperCase() || "U"}
              </span>
            </div>
          </div>

          {/* Caption Input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's new?"
              className="w-full bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="px-4 pb-3">
        <div
          className="border border-border/30 rounded-xl overflow-hidden cursor-pointer hover:bg-white/[0.02] transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {preview ? (
            <div className="relative">
              {file?.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full object-cover"
                />
              ) : (
                <video src={preview} controls className="w-full" />
              )}
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-10 w-10 text-muted"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-muted">
                Click to add photo or video
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Icons */}
      <div className="px-4 py-2 flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-muted hover:text-foreground transition-colors"
          title="Add photo/video"
        >
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button className="text-muted hover:text-foreground transition-colors">
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
        <button className="text-muted hover:text-foreground transition-colors">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span>{uploadStage || "Uploading..."}</span>
            <span className="font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-foreground h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between">
        <button className="flex items-center gap-2 text-muted hover:text-foreground text-[13px] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Reply options
        </button>

        <button
          onClick={handleUpload}
          disabled={isUploading || !account || !file || !caption.trim()}
          className="px-6 py-1.5 bg-foreground text-background rounded-full text-[15px] font-semibold hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isUploading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
