import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/layout/LoginForm";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-8rem)]">
      <div className="p-8 max-w-md w-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-white/50">Sign in to manage your expenses.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
