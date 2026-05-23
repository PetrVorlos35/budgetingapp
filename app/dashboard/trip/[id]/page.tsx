import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RowDataPacket } from "mysql2";
import { AddExpenseButton } from "@/components/expenses/AddExpenseButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SwipeToDeleteExpense } from "@/components/expenses/SwipeToDeleteExpense";

export default async function TripDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tripId = parseInt(params.id, 10);
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const db = await getDb();

  const [settings] = await db.query(
    "SELECT currency FROM user_settings WHERE user_id = ?",
    [session.user.id]
  ) as [RowDataPacket[], unknown];
  const currency = settings.length > 0 ? settings[0].currency : "$";

  const [tripRows] = await db.query(
    "SELECT * FROM trips WHERE id = ? AND user_id = ?",
    [tripId, session.user.id]
  ) as [RowDataPacket[], unknown];

  if (tripRows.length === 0) {
    return (
      <div className="space-y-8">
        <Link href="/dashboard" className="glass-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 cursor-pointer active:scale-95 transition-transform duration-200">
          ← Back to Dashboard
        </Link>
        <div className="glass-card rounded-3xl p-10 text-center text-white/40">Trip not found or unauthorized.</div>
      </div>
    );
  }
  const trip = tripRows[0];

  const [expenses] = await db.query(
    "SELECT * FROM trip_expenses WHERE trip_id = ? ORDER BY date DESC",
    [tripId]
  ) as [RowDataPacket[], unknown];

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="glass-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white cursor-pointer active:scale-95 transition-transform duration-200">
        ← Back to Dashboard
      </Link>
      
      <header className="glass-card p-8 rounded-3xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{trip.title}</h1>
          <p className="text-white/40">
            {new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Total spent</p>
          <p className="text-4xl font-bold text-white">
            <AnimatedCounter value={totalSpent} currency={currency} />
          </p>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Expenses</h2>
          <AddExpenseButton target={{ type: "trip", id: trip.id, name: trip.title }} />
        </div>
        {expenses.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center text-white/40">
            No expenses recorded for this trip yet. Add one from the Dashboard!
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((exp) => (
              <SwipeToDeleteExpense
                key={exp.id}
                id={exp.id}
                type="trip"
                description={exp.description}
                amount={Number(exp.amount)}
                currency={currency}
                category={exp.category}
                dateStr={new Date(exp.date).toLocaleDateString()}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
