import Link from "next/link";
import { db } from "@/db";
import { badges, lessonProgress, lessons, scamAttempts, scamScenarios, userBadges } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { computeSafetyScore } from "@/lib/scoring";
import { Card, CardLabel, Pill, ProgressBar, SectionHeader, StatStrip, DynamicIcon } from "@/components/ui";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [allLessons, progressRows, allBadges, earned, scamRows, allScams] = await Promise.all([
    db.select().from(lessons).orderBy(asc(lessons.orderIndex)),
    db.select().from(lessonProgress).where(eq(lessonProgress.userId, user.id)),
    db.select().from(badges),
    db.select().from(userBadges).where(eq(userBadges.userId, user.id)),
    db.select().from(scamAttempts).where(eq(scamAttempts.userId, user.id)),
    db.select().from(scamScenarios),
  ]);

  const progressMap = new Map(progressRows.map((p) => [p.lessonId, p]));
  const earnedIds = new Set(earned.map((e) => e.badgeId));
  const completedCount = progressRows.filter((p) => p.completed).length;
  const completionPct = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const s = await computeSafetyScore(user.id);
  const scamAccuracy = scamRows.length ? Math.round((scamRows.filter((r) => r.correct).length / scamRows.length) * 100) : 0;

  return (
    <div className="space-y-3.5">
      <SectionHeader title="My Progress" subtitle="Your learning journey, badges and safety score" />

      <StatStrip
        items={[
          { label: "XP earned", value: user.xp, tone: "warn", hint: `${earnedIds.size} of ${allBadges.length} badges` },
          { label: "Lessons", value: `${completedCount}/${allLessons.length}`, hint: `${completionPct}% complete` },
          { label: "Scam drills", value: `${scamRows.length}/${allScams.length}`, hint: `${scamAccuracy}% correct`, tone: scamAccuracy >= 70 ? "good" : "warn" },
          { label: "Safety score", value: `${s.score}/100`, tone: s.score >= 70 ? "good" : "warn" },
        ]}
      />

      {/* Score breakdown and badges merged side by side */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardLabel>Score breakdown</CardLabel>
          <div className="mt-3 space-y-2.5">
            {[
              { label: "Lesson completion", value: s.lessonsCompletionPct, weight: "20% weight" },
              { label: "Quiz understanding", value: s.quizAvgPct, weight: "30% weight" },
              { label: "Scam detection accuracy", value: s.scamAccuracyPct, weight: "50% weight" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{row.label} <span className="text-slate-300">{row.weight}</span></span>
                  <span className="font-semibold tabular-nums text-slate-700">{row.value}%</span>
                </div>
                <ProgressBar value={row.value} className="mt-0.5" />
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-slate-100 pt-2.5 text-[10px] leading-relaxed text-slate-400">
            Scam detection carries the highest weight because recognising fraud causes the most immediate harm. This is
            an awareness score, not a credit score.
          </p>
        </Card>

        <Card>
          <CardLabel>Badges</CardLabel>
          <div className="mt-3 space-y-1.5">
            {allBadges.map((b) => {
              const has = earnedIds.has(b.id);
              return (
                <div key={b.id} className={`flex items-center gap-3 rounded-none border px-3.5 py-2.5 transition ${has ? "border-amber-200/80 bg-amber-50/60" : "border-slate-100 bg-slate-50/30 opacity-60"}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-none ${has ? "bg-amber-100 text-amber-700 shadow-xs" : "bg-slate-200 text-slate-400"}`}>
                    <DynamicIcon name={b.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-bold ${has ? "text-amber-950" : "text-slate-500"}`}>{b.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{b.description}</p>
                  </div>
                  {has ? <Pill tone="success">Unlocked</Pill> : <Pill tone="neutral">Locked</Pill>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Learning path: single dense panel */}
      <Card pad={false}>
        <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2">
          <CardLabel>Learning path</CardLabel>
          <Link href="/dashboard/learn" className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
            Open lessons
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {allLessons.map((lesson, i) => {
            const p = progressMap.get(lesson.id);
            const done = p?.completed ?? false;
            return (
              <Link key={lesson.id} href={`/dashboard/learn/${lesson.slug}`} className="group flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-none text-[10px] font-bold ${done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs font-semibold ${done ? "text-slate-500" : "text-slate-800"}`}>{lesson.title}</p>
                  <p className="text-[10px] text-slate-400">{lesson.category}</p>
                </div>
                {p?.quizTotal ? <Pill tone={p.quizScore === p.quizTotal ? "success" : "warning"}>{p.quizScore}/{p.quizTotal}</Pill> : null}
                {done ? <Pill tone="success">Done</Pill> : <Circle className="h-3 w-3 shrink-0 text-slate-200" />}
                <ChevronRight className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-emerald-600" />
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
