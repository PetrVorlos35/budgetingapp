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
      await controls.start({ x: -100 });
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
    <div className="relative w-full rounded-2xl">
      <div className="absolute inset-y-0 right-0 flex items-center justify-end px-6 bg-red-500/20 w-full rounded-2xl border border-red-500/20">
        <button
          onClick={handleDelete}
          className="text-red-500 font-bold tracking-wide hover:text-red-400 transition-all duration-200 bg-red-500/10 px-4 py-2 rounded-xl cursor-pointer active:scale-95"
        >
          Delete
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing w-full"
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
        <div className="text-xl font-bold text-white whitespace-nowrap">
          <AnimatedCounter value={Number(amount)} currency={currency} />
        </div>
      </motion.div>
    </div>
  );
}
