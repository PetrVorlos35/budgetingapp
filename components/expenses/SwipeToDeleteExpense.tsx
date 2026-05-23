"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState } from "react";
import { deleteExpense } from "@/actions/expenses";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface Props {
  id: number;
  type: "folder" | "trip";
  description: string;
  amount: number;
  currency: string;
  category?: string;
  dateStr: string;
}

export function SwipeToDeleteExpense({ id, type, description, amount, currency, category, dateStr }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      await controls.start({ x: -96 });
    } else {
      await controls.start({ x: 0 });
    }
  };

  const handleDelete = async () => {
    // Animate out gracefully
    await controls.start({ opacity: 0, height: 0, marginBottom: 0 });
    setIsDeleting(true);
    await deleteExpense(type, id);
  };

  if (isDeleting) return null;

  return (
    <div className="relative mb-2 w-full">
      <div className="absolute right-0 top-0 bottom-0 w-24 flex justify-center items-center text-white font-medium rounded-2xl">
        <button
          onClick={handleDelete}
          className="w-full h-full text-white font-bold tracking-wide hover:text-red-500 transition-all duration-200 cursor-pointer flex items-center justify-center rounded-2xl"
        >
          Delete
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -96 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-grab active:cursor-grabbing w-full"
      >
        <div>
          <h3 className="text-lg font-semibold text-white">{description}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
            {category && (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white capitalize">
                {category}
              </span>
            )}
            <span>{dateStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-bold text-white whitespace-nowrap">
              <AnimatedCounter value={Number(amount)} currency={currency} />
            </div>
          </div>
          {/* The subtle visual hint */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
