import { NextResponse } from "next/server";
import { db } from "@/db";
import { badges, userBadges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const allBadges = await db.select().from(badges);

  let earnedIds = new Set<number>();
  if (user) {
    const earned = await db.select().from(userBadges).where(eq(userBadges.userId, user.id));
    earnedIds = new Set(earned.map((e) => e.badgeId));
  }

  return NextResponse.json({
    badges: allBadges.map((b) => ({ ...b, earned: earnedIds.has(b.id) })),
  });
}
