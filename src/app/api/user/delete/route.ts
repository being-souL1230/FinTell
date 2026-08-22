import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { clearSessionCookie, getSessionPayload } from "@/lib/auth";

export async function POST() {
  const session = await getSessionPayload();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete user record (foreign keys have ON DELETE CASCADE)
    await db.delete(users).where(eq(users.id, session.userId));

    // Clear session cookie
    await clearSessionCookie();

    return NextResponse.json({ ok: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
