"use client";

import { useState } from "react";
import { AddExpenseModal, ExpenseTarget } from "./AddExpenseModal";

interface Props {
  target: ExpenseTarget;
}

export function AddExpenseButton({ target }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="glass-btn px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm active:scale-95 cursor-pointer"
      >
        <span className="text-lg leading-none mb-0.5">+</span> Add Expense
      </button>
      
      <AddExpenseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        target={target}
      />
    </>
  );
}
