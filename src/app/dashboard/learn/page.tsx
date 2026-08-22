import Link from "next/link";
import { db } from "@/db";
import { lessons, lessonProgress, quizQuestions } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { Card, Pill, ProgressBar, SectionHeader, EmptyState, DynamicIcon } from "@/components/ui";
import { BookOpen, CheckCircle2, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;

  const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));

  const quizCounts = await db
    .select({ lessonId: quizQuestions.lessonId, count: sql<number>`count(*)::int` })
    .from(quizQuestions)
    .groupBy(quizQuestions.lessonId);
  const quizMap = new Map(quizCounts.map((q) => [q.lessonId, q.count]));

  const progressRows = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, user.id));
  const progressMap = new Map(progressRows.map((p) => [p.lessonId, p]));

  const categories = Array.from(new Set(allLessons.map((l) => l.category)));
  const filtered = category ? allLessons.filter((l) => l.category === category) : allLessons;

  // Group by category -> one compact panel per category instead of loose cards
  const grouped = new Map<string, typeof allLessons>();
  for (const lesson of filtered) {
    const list = grouped.get(lesson.category) ?? [];
    list.push(lesson);
    grouped.set(lesson.category, list);
  }

  const totalDone = progressRows.filter((p) => p.completed).length;

  return (
    <div className="space-y-3.5">
      <SectionHeader
        title="Learn"
        subtitle={`${totalDone} of ${allLessons.length} lessons complete`}
      />

      {/* Filter row merged with overall progress */}
      <Card pad={false} className="flex items-center gap-3 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0 flex-1">
            <ProgressBar value={allLessons.length ? (totalDone / allLessons.length) * 100 : 0} />
          </div>
          <span className="shrink-0 text-[11px] font-semibold tabular-nums text-slate-500">
            {allLessons.length ? Math.round((totalDone / allLessons.length) * 100) : 0}%
          </span>
        </div>
        <div className="flex shrink-0 gap-1 overflow-x-auto">
          <Link
            href="/dashboard/learn"
            className={`whitespace-nowrap rounded px-2 py-1 text-[10px] font-semibold transition ${!category ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/dashboard/learn?category=${encodeURIComponent(c)}`}
              className={`whitespace-nowrap rounded px-2 py-1 text-[10px] font-semibold transition ${category === c ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {c}
            </Link>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-7 w-7" />} title="No lessons in this category" description="Try another category." />
      ) : (
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([cat, catLessons]) => {
            const done = catLessons.filter((l) => progressMap.get(l.id)?.completed).length;
            const pct = catLessons.length ? (done / catLessons.length) * 100 : 0;
            return (
              <Card key={cat} pad={false}>
                {/* Category header: name, progress and count all in one dense row */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-3.5 py-2">
                  <p className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-slate-700">{cat}</p>
                  <div className="min-w-0 flex-1">
                    <ProgressBar value={pct} tone={pct === 100 ? "emerald" : "slate"} />
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-400">
                    {done}/{catLessons.length}
                  </span>
                </div>

                {/* Dense lesson rows inside the same panel */}
                <div className="divide-y divide-slate-50">
                  {catLessons.map((lesson) => {
                    const p = progressMap.get(lesson.id);
                    const isDone = p?.completed ?? false;
                    const qCount = quizMap.get(lesson.id) ?? 0;
                    return (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/learn/${lesson.slug}`}
                        className="group flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-emerald-50 text-emerald-600 shadow-xs">
                          <DynamicIcon name={lesson.icon} className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-700">{lesson.title}</p>
                            {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                          </div>
                          <p className="truncate text-[11px] text-slate-500">{lesson.summary}</p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          {p?.quizTotal ? (
                            <Pill tone={p.quizScore === p.quizTotal ? "success" : "warning"}>
                              {p.quizScore}/{p.quizTotal}
                            </Pill>
                          ) : qCount > 0 ? (
                            <Pill tone="neutral">{qCount} Q</Pill>
                          ) : null}
                          <Pill tone="neutral">{lesson.difficulty}</Pill>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:text-emerald-600" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
