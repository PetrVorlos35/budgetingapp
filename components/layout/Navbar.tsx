import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1c1c1e]/60 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-white">Tracker</span>
          </Link>

          {session?.user && (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white/80">
                  {session.user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
