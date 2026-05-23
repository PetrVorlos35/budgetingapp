"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium text-white/50 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
      title="Log out"
    >
      Sign out
    </button>
  );
}
