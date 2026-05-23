"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip, Folder } from "@/types/db";
import { Card } from "@/components/ui/Card";
import { CreateFolderModal } from "@/components/expenses/CreateFolderModal";

interface Props {
  trips: (Trip & { total_expenses: string | number })[];
  folders: (Folder & { total_expenses: string | number })[];
  currency: string;
}

export default function DashboardClient({ trips, folders, currency }: Props) {
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false);

  return (
    <div className="space-y-14">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-white">Overview</h1>
        <p className="text-white/40 mt-2 text-base">
          Manage your trips and general expenses in one place.
        </p>
      </header>

      {/* Folders Section (Primary Focus) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">My Folders</h2>
          <button
            onClick={() => setFolderModalOpen(true)}
            className="glass-btn text-sm font-medium px-4 py-2 rounded-full text-white/80 cursor-pointer active:scale-95 transition-transform duration-200"
          >
            + New Folder
          </button>
        </div>

        {folders.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center text-white/40">
            No folders yet. Create one for your general expenses!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folders.map((folder) => (
              <Link href={`/dashboard/folder/${folder.id}`} key={folder.id} className="block">
                <Card
                  title={folder.name}
                  amount={Number(folder.total_expenses)}
                  currency={currency}
                  aspectSquare
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trips Section (Collapsible Accordion) */}
      <section>
        <button
          onClick={() => setIsTripsOpen(!isTripsOpen)}
          className="w-full flex items-center justify-between p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <h2 className="text-2xl font-semibold text-white">My Trips</h2>
          <div
            className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ${
              isTripsOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-white/80"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isTripsOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {trips.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center text-white/40">
                No trips found. Trips managed externally will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Link href={`/dashboard/trip/${trip.id}`} key={trip.id} className="block">
                    <Card
                      title={trip.title}
                      subtitle={`${new Date(trip.start_date).toLocaleDateString()} – ${new Date(trip.end_date).toLocaleDateString()}`}
                      amount={Number(trip.total_expenses)}
                      currency={currency}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setFolderModalOpen(false)}
      />
    </div>
  );
}
