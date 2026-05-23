import React from "react";
import { AnimatedCounter } from "./AnimatedCounter";

interface CardProps {
  title: string;
  subtitle?: string;
  amount: number;
  currency: string;
  onAddExpense?: (e: React.MouseEvent) => void;
  aspectSquare?: boolean;
}

export function Card({ title, subtitle, amount, currency, onAddExpense, aspectSquare }: CardProps) {
  return (
    <div className={`p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between ${aspectSquare ? "aspect-square" : ""}`}>
      <div>
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-white/40">{subtitle}</p>}
      </div>
      <div className="mt-auto pt-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Total spent</p>
          <p className="text-3xl font-bold text-white mt-4">
            <AnimatedCounter value={amount} currency={currency} />
          </p>
        </div>
        {onAddExpense && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddExpense(e);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center text-lg shrink-0 ml-4"
            title="Add Expense"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
