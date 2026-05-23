import { getUserDashboardData } from "@/actions/dashboard";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const data = await getUserDashboardData();
    // Pass raw data to the Client component
    return <DashboardClient trips={data.trips as any[]} folders={data.folders as any[]} currency={data.currency} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/api/auth/signin"); // Send unauthenticated users to the default NextAuth login
    }
    return <div className="text-red-500">Failed to load dashboard data. Please ensure your database is running and credentials in .env.local are correct.</div>;
  }
}
