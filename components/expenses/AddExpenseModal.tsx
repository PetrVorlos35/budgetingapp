"use client";

import { useActionState, useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { addExpense } from "@/actions/expenses";

export interface ExpenseTarget {
  type: "folder" | "trip";
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  target: ExpenseTarget | null;
}

export function AddExpenseModal({ isOpen, onClose, target }: Props) {
  const [state, action, pending] = useActionState(addExpense, undefined);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (state?.message === "success") {
      setIsRecurring(false);
      onClose();
    }
  }, [state, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) setIsRecurring(false);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={target ? `Add to ${target.name}` : "Add Expense"}>
      {target && (
        <form action={action} className="space-y-4">
          <input type="hidden" name="targetType" value={target.type} />
          <input type="hidden" name="targetId" value={target.id} />

          <div>
            <label htmlFor="expense-description" className="block text-sm font-medium text-white/70 mb-1.5">
              Description
            </label>
            <input
              type="text"
              id="expense-description"
              name="description"
              placeholder="What was it for?"
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="expense-amount" className="block text-sm font-medium text-white/70 mb-1.5">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="expense-amount"
              name="amount"
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
              required
            />
          </div>

          {target.type === "folder" && (
            <div>
              <label htmlFor="expense-category" className="block text-sm font-medium text-white/70 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  id="expense-category"
                  name="category"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-[#1c1c1e] text-white">Select a category</option>
                  <option value="housing" className="bg-[#1c1c1e] text-white">Housing</option>
                  <option value="food" className="bg-[#1c1c1e] text-white">Food</option>
                  <option value="transport" className="bg-[#1c1c1e] text-white">Transport</option>
                  <option value="entertainment" className="bg-[#1c1c1e] text-white">Entertainment</option>
                  <option value="utilities" className="bg-[#1c1c1e] text-white">Utilities</option>
                  <option value="other" className="bg-[#1c1c1e] text-white">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">
                    Make this a recurring expense
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isRecurring"
                      className="sr-only peer" 
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      value="true"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300 border border-white/10 shadow-inner"></div>
                    <div className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-full shadow-md"></div>
                  </label>
                </div>
                
                {isRecurring && (
                  <div className="mt-4">
                    <label htmlFor="recurrenceInterval" className="block text-sm font-medium text-white/70 mb-1.5">
                      Recurrence Interval
                    </label>
                    <div className="relative">
                      <select
                        id="recurrenceInterval"
                        name="recurrenceInterval"
                        defaultValue="monthly"
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="weekly" className="bg-[#1c1c1e] text-white">Weekly</option>
                        <option value="monthly" className="bg-[#1c1c1e] text-white">Monthly</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {target.type === "trip" && (
            <>
              <div>
                <label htmlFor="expense-category" className="block text-sm font-medium text-white/70 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="expense-category"
                    name="category"
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-[#1c1c1e] text-white">Select a category</option>
                    <option value="Food" className="bg-[#1c1c1e] text-white">Food</option>
                    <option value="Transport" className="bg-[#1c1c1e] text-white">Transport</option>
                    <option value="Accommodation" className="bg-[#1c1c1e] text-white">Accommodation</option>
                    <option value="Activities" className="bg-[#1c1c1e] text-white">Activities</option>
                    <option value="Other" className="bg-[#1c1c1e] text-white">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium text-white/70 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  id="expense-date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
                  style={{ colorScheme: "dark" }}
                  required
                />
              </div>
            </>
          )}

          {state?.message && state.message !== "success" && (
            <p className="text-red-400 text-sm bg-red-500/10 rounded-xl py-2 px-3">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 mt-4 rounded-xl bg-white/90 text-black font-semibold hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {pending ? "Saving..." : "Add Expense"}
          </button>
        </form>
      )}
    </Modal>
  );
}
