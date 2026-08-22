import { NextResponse } from "next/server";
import { db } from "@/db";
import { badges, lessonProgress, lessons, scamAttempts, userBadges } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { computeSafetyScore } from "@/lib/scoring";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));
  const progressRows = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, user.id));
  const scamRows = await db
    .select()
    .from(scamAttempts)
    .where(eq(scamAttempts.userId, user.id))
    .orderBy(desc(scamAttempts.attemptedAt));

  const earnedBadges = await db
    .select({
      id: badges.id,
      code: badges.code,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      earnedAt: userBadges.earnedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, user.id))
    .orderBy(desc(userBadges.earnedAt));

  const safetyScore = await computeSafetyScore(user.id);

  const completedCount = progressRows.filter((p) => p.completed).length;

  return NextResponse.json({
    xp: user.xp,
    totalLessons: allLessons.length,
    completedLessons: completedCount,
    completionPct: allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0,
    safetyScore,
    earnedBadges,
    scamAttemptsCount: scamRows.length,
    recentScamAttempts: scamRows.slice(0, 5),
  });
}
