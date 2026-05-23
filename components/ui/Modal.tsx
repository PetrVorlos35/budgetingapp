"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-xl">
      {/* Light dismiss overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Modal content box */}
      <div className="relative w-full max-w-lg p-8 rounded-[2rem] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/20 shadow-2xl m-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm z-10 cursor-pointer active:scale-95"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-white mb-6 pr-10">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
}
