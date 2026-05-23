"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";

export type FormState = {
  message?: string;
  errors?: Record<string, string[]>;
} | undefined;

export async function createFolder(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim() === "") {
    return { errors: { name: ["Name is required."] } };
  }

  try {
    const db = await getDb();
    await db.query(
      "INSERT INTO folders (user_id, name) VALUES (?, ?)",
      [session.user.id, name]
    );
    
    revalidatePath("/dashboard/folders");
    revalidatePath("/dashboard");
    return { message: "success" };
  } catch {
    return { message: "Failed to create folder." };
  }
}

export async function addExpense(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized" };
  }

  const targetType = formData.get("targetType") as string; // 'folder' | 'trip'
  const targetId = parseInt(formData.get("targetId") as string, 10);
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;

  if (!targetType || isNaN(targetId) || isNaN(amount) || !description) {
    return { message: "Missing required fields." };
  }

  try {
    const db = await getDb();

    if (targetType === "folder") {
      const [rows] = await db.query(
        "SELECT id FROM folders WHERE id = ? AND user_id = ?",
        [targetId, session.user.id]
      ) as [RowDataPacket[], unknown];
      if (rows.length === 0) return { message: "Unauthorized or folder not found" };

      const category = formData.get("category") as string || "other";
      const isRecurring = formData.get("isRecurring") === "true";
      const recurrenceInterval = formData.get("recurrenceInterval") as string || null;
      await db.query(
        "INSERT INTO general_expenses (folder_id, amount, description, category, is_recurring, recurrence_interval) VALUES (?, ?, ?, ?, ?, ?)",
        [targetId, amount, description, category, isRecurring, recurrenceInterval]
      );
      revalidatePath(`/dashboard/folders/${targetId}`);
    } else if (targetType === "trip") {
      const category = formData.get("category") as string;
      const date = formData.get("date") as string;
      if (!category || !date) {
        return { message: "Missing required trip fields (category, date)." };
      }

      const [rows] = await db.query(
        "SELECT id FROM trips WHERE id = ? AND user_id = ?",
        [targetId, session.user.id]
      ) as [RowDataPacket[], unknown];
      if (rows.length === 0) return { message: "Unauthorized or trip not found" };

      await db.query(
        "INSERT INTO trip_expenses (trip_id, amount, description, category, date) VALUES (?, ?, ?, ?, ?)",
        [targetId, amount, description, category, date]
      );
      revalidatePath(`/dashboard/trips/${targetId}`);
    } else {
      return { message: "Invalid target type." };
    }

    revalidatePath("/dashboard");
    return { message: "success" };
  } catch {
    return { message: "Failed to add expense." };
  }
}

export async function deleteExpense(type: "folder" | "trip", id: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const db = await getDb();

  if (type === "folder") {
    // Verify ownership via join
    const [rows] = await db.query(`
      SELECT ge.id FROM general_expenses ge
      JOIN folders f ON ge.folder_id = f.id
      WHERE ge.id = ? AND f.user_id = ?
    `, [id, session.user.id]) as [RowDataPacket[], unknown];
    if (rows.length === 0) throw new Error("Unauthorized or not found");

    await db.query("DELETE FROM general_expenses WHERE id = ?", [id]);
  } else if (type === "trip") {
    const [rows] = await db.query(`
      SELECT te.id FROM trip_expenses te
      JOIN trips t ON te.trip_id = t.id
      WHERE te.id = ? AND t.user_id = ?
    `, [id, session.user.id]) as [RowDataPacket[], unknown];
    if (rows.length === 0) throw new Error("Unauthorized or not found");

    await db.query("DELETE FROM trip_expenses WHERE id = ?", [id]);
  }

  revalidatePath("/dashboard");
  if (type === "folder") {
    // In server actions, dynamic routes need `revalidatePath('/path', 'page')` or just exact path but since id isn't in scope of folder page natively, we can revalidate layout or specific page.
    revalidatePath(`/dashboard/folder/[id]`, "page");
  } else {
    revalidatePath(`/dashboard/trip/[id]`, "page");
  }
  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const db = await getDb();

  const [rows] = await db.query(
    "SELECT id FROM folders WHERE id = ? AND user_id = ?",
    [folderId, session.user.id]
  ) as [RowDataPacket[], unknown];
  
  if (rows.length === 0) {
    throw new Error("Unauthorized or folder not found");
  }

  await db.query("DELETE FROM general_expenses WHERE folder_id = ?", [folderId]);
  await db.query("DELETE FROM folders WHERE id = ?", [folderId]);

  revalidatePath("/dashboard");
  return { success: true };
}
