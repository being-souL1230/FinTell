import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { badges, lessonProgress, lessons, moneyProfiles, scamScenarios, scamAttempts, userBadges } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { computeSafetyScore } from "@/lib/scoring";
import { buildMoneyPlan } from "@/lib/money-coach";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [allLessons, progressRows, allScams, scamRows, moneyProfileRows] = await Promise.all([
    db.select().from(lessons).orderBy(asc(lessons.orderIndex)),
    db.select().from(lessonProgress).where(eq(lessonProgress.userId, user.id)),
    db.select().from(scamScenarios),
    db.select().from(scamAttempts).where(eq(scamAttempts.userId, user.id)),
    db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1),
  ]);

  const progressMap = new Map(progressRows.map((p) => [p.lessonId, p]));
  const completedCount = progressRows.filter((p) => p.completed).length;
  const completionPct = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const scamAccuracy = scamRows.length
    ? Math.round((scamRows.filter((s) => s.correct).length / scamRows.length) * 100)
    : 0;

  const continueLesson = allLessons.find((l) => !progressMap.get(l.id)?.completed) ?? allLessons[0];
  const nextScam = allScams.find((s) => !scamRows.some((a) => a.scenarioId === s.id));

  const safetyScore = await computeSafetyScore(user.id);
  const moneyProfile = moneyProfileRows[0] ?? null;
  const moneyPlan = moneyProfile ? buildMoneyPlan(moneyProfile) : null;

  const earnedBadges = await db
    .select({ id: badges.id, name: badges.name, icon: badges.icon, description: badges.description })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, user.id));

  return (
    <DashboardClient
      userName={user.name}
      userXp={user.xp}
      hasBusiness={user.hasBusiness}
      completedCount={completedCount}
      totalLessons={allLessons.length}
      completionPct={completionPct}
      scamAccuracy={scamAccuracy}
      safetyScore={safetyScore}
      continueLesson={continueLesson}
      nextScam={nextScam}
      moneyPlan={moneyPlan}
      earnedBadges={earnedBadges}
    />
  );
}
