"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { deleteFolder } from "@/actions/expenses";

interface Props {
  folderId: number;
}

export function DeleteFolderButton({ folderId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFolder(folderId);
      setIsOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
        title="Delete Folder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-xl">
          <div className="absolute inset-0 cursor-pointer" onClick={() => !isDeleting && setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/20 shadow-2xl text-center m-4 z-10">
            <h3 className="text-xl font-semibold text-white mb-2">Delete Folder?</h3>
            <p className="text-white/70 text-sm mb-6">
              Are you sure? This will permanently delete this folder and all its expenses.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
