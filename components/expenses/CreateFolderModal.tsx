"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { createFolder } from "@/actions/expenses";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ isOpen, onClose }: Props) {
  const [state, action, pending] = useActionState(createFolder, undefined);

  useEffect(() => {
    if (state?.message === "success") {
      onClose();
    }
  }, [state, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Folder">
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="folder-name" className="block text-sm font-medium text-white/70 mb-1.5">
            Folder Name
          </label>
          <input
            type="text"
            id="folder-name"
            name="name"
            placeholder="e.g. Groceries"
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
            required
          />
          {state?.errors?.name && (
            <p className="text-red-400 text-sm mt-1">{state.errors.name[0]}</p>
          )}
        </div>
        {state?.message && state.message !== "success" && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-xl py-2 px-3">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 mt-4 rounded-xl bg-white/90 text-black font-semibold hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </form>
    </Modal>
  );
}
