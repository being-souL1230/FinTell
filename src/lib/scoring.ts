import { db } from "@/db";
import { badges, lessonProgress, lessons, scamAttempts, userBadges, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type SafetyScoreBreakdown = {
  score: number;
  lessonsCompletionPct: number;
  quizAvgPct: number;
  scamAccuracyPct: number;
  strongAreas: string[];
  needsImprovement: string[];
};

export async function computeSafetyScore(userId: number): Promise<SafetyScoreBreakdown> {
  const [totalLessonsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(lessons);
  const totalLessons = totalLessonsRow?.count ?? 0;

  const progressRows = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));

  const completedLessons = progressRows.filter((p) => p.completed).length;
  const lessonsCompletionPct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const quizRows = progressRows.filter((p) => p.quizTotal && p.quizTotal > 0);
  const quizAvgPct =
    quizRows.length > 0
      ? (quizRows.reduce((sum, p) => sum + (p.quizScore ?? 0) / (p.quizTotal ?? 1), 0) /
          quizRows.length) *
        100
      : 0;

  const scamRows = await db.select().from(scamAttempts).where(eq(scamAttempts.userId, userId));
  const scamAccuracyPct =
    scamRows.length > 0 ? (scamRows.filter((s) => s.correct).length / scamRows.length) * 100 : 0;

  // Weighted blend: scam-awareness matters most for a "safety" score.
  const hasAnyActivity = progressRows.length > 0 || scamRows.length > 0;
  const score = hasAnyActivity
    ? Math.round(lessonsCompletionPct * 0.2 + quizAvgPct * 0.3 + scamAccuracyPct * 0.5)
    : 0;

  const strongAreas: string[] = [];
  const needsImprovement: string[] = [];

  if (scamRows.length > 0) {
    if (scamAccuracyPct >= 70) strongAreas.push("Scam & Fraud Detection");
    else needsImprovement.push("Scam & Fraud Detection");
  }
  if (quizRows.length > 0) {
    if (quizAvgPct >= 70) strongAreas.push("Quiz Understanding");
    else needsImprovement.push("Quiz Understanding");
  }
  if (totalLessons > 0) {
    if (lessonsCompletionPct >= 70) strongAreas.push("Lesson Completion");
    else needsImprovement.push("Lesson Completion");
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    lessonsCompletionPct: Math.round(lessonsCompletionPct),
    quizAvgPct: Math.round(quizAvgPct),
    scamAccuracyPct: Math.round(scamAccuracyPct),
    strongAreas,
    needsImprovement,
  };
}

export async function addXp(userId: number, amount: number) {
  await db
    .update(users)
    .set({ xp: sql`${users.xp} + ${amount}` })
    .where(eq(users.id, userId));
}

const BADGE_RULES: {
  code: string;
  check: (ctx: {
    completedLessons: number;
    quizAttempts: number;
    correctScamAttempts: number;
    totalScamAttempts: number;
    simulatorRuns: number;
  }) => boolean;
}[] = [
  { code: "first_lesson", check: (c) => c.completedLessons >= 1 },
  { code: "banking_basics_master", check: (c) => c.completedLessons >= 5 },
  { code: "scam_detective", check: (c) => c.correctScamAttempts >= 3 },
  { code: "safety_champion", check: (c) => c.totalScamAttempts >= 5 && c.correctScamAttempts / Math.max(1, c.totalScamAttempts) >= 0.8 },
  { code: "smart_saver", check: (c) => c.simulatorRuns >= 1 },
  { code: "quiz_whiz", check: (c) => c.quizAttempts >= 5 },
];

export async function evaluateBadges(userId: number) {
  const progressRows = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));
  const scamRows = await db.select().from(scamAttempts).where(eq(scamAttempts.userId, userId));

  const simResult = await db.execute(
    sql`select count(*)::int as count from simulator_history where user_id = ${userId}`,
  );
  const simulatorRuns = Number((simResult.rows[0] as { count: number } | undefined)?.count ?? 0);

  const ctx = {
    completedLessons: progressRows.filter((p) => p.completed).length,
    quizAttempts: progressRows.filter((p) => p.quizTotal && p.quizTotal > 0).length,
    correctScamAttempts: scamRows.filter((s) => s.correct).length,
    totalScamAttempts: scamRows.length,
    simulatorRuns,
  };

  const allBadges = await db.select().from(badges);
  const existing = await db.select().from(userBadges).where(eq(userBadges.userId, userId));
  const existingCodes = new Set(
    existing.map((e) => allBadges.find((b) => b.id === e.badgeId)?.code).filter(Boolean),
  );

  const newlyEarned: (typeof allBadges)[number][] = [];

  for (const rule of BADGE_RULES) {
    if (existingCodes.has(rule.code)) continue;
    if (!rule.check(ctx)) continue;
    const badge = allBadges.find((b) => b.code === rule.code);
    if (!badge) continue;
    await db.insert(userBadges).values({ userId, badgeId: badge.id }).onConflictDoNothing();
    await addXp(userId, badge.xpReward);
    newlyEarned.push(badge);
  }

  return newlyEarned;
}
