"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import CreatePostModal from "@/components/upload/CreatePostModal";

interface CreatePostModalContextType {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

const CreatePostModalContext = createContext<
  CreatePostModalContextType | undefined
>(undefined);

export function CreatePostModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <CreatePostModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <CreatePostModal isOpen={isOpen} onClose={closeModal} />
    </CreatePostModalContext.Provider>
  );
}

export function useCreatePostModal() {
  const context = useContext(CreatePostModalContext);
  if (!context) {
    throw new Error(
      "useCreatePostModal must be used within CreatePostModalProvider",
    );
  }
  return context;
}
