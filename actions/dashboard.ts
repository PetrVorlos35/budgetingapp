"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function getUserDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const db = await getDb();

  // Fetch Trips with total expenses
  const [trips] = await db.query(`
    SELECT t.*, COALESCE(SUM(te.amount), 0) AS total_expenses
    FROM trips t
    LEFT JOIN trip_expenses te ON t.id = te.trip_id
    WHERE t.user_id = ?
    GROUP BY t.id
    ORDER BY t.start_date DESC
  `, [userId]) as [RowDataPacket[], unknown];

  // Fetch Folders with total expenses
  const [folders] = await db.query(`
    SELECT f.*, COALESCE(SUM(ge.amount), 0) AS total_expenses
    FROM folders f
    LEFT JOIN general_expenses ge ON f.id = ge.folder_id
    WHERE f.user_id = ?
    GROUP BY f.id
    ORDER BY f.created_at DESC
  `, [userId]) as [RowDataPacket[], unknown];

  const [settings] = await db.query(`
    SELECT currency FROM user_settings WHERE user_id = ?
  `, [userId]) as [RowDataPacket[], unknown];
  const currency = settings.length > 0 ? settings[0].currency : "$";

  return { trips, folders, currency };
}
