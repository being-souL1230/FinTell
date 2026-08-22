import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, quizQuestions, lessonProgress } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardLabel, Pill, DynamicIcon } from "@/components/ui";
import { LessonQuiz } from "@/components/dashboard/LessonQuiz";
import { ArrowLeft, CheckCircle2, Lightbulb, BookOpen, AlertTriangle, Shield, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const [lesson] = await db.select().from(lessons).where(eq(lessons.slug, slug)).limit(1);
  if (!lesson) notFound();

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.lessonId, lesson.id))
    .orderBy(asc(quizQuestions.orderIndex));

  const [progress] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lesson.id)));

  const isCompleted = progress?.completed ?? false;

  // Next lesson link
  const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const next = allLessons[idx + 1];

  const sections = [
    { Icon: Target, label: "Why this matters", body: lesson.whyItMatters, accent: "text-emerald-600" },
    { Icon: BookOpen, label: "Simple explanation", body: lesson.explanation, accent: "text-slate-600" },
    { Icon: Lightbulb, label: "Real-life example", body: lesson.example, accent: "text-sky-600" },
    { Icon: AlertTriangle, label: "Common mistake", body: lesson.commonMistake, accent: "text-amber-600" },
    { Icon: Shield, label: "Safety tip", body: lesson.safetyTip, accent: "text-red-600" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/learn" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-emerald-600 transition">
          <ArrowLeft className="h-3 w-3" /> All lessons
        </Link>
        {next && (
          <Link href={`/dashboard/learn/${next.slug}`} className="text-[11px] font-medium text-slate-400 hover:text-emerald-600 transition">
            Next: {next.title}
          </Link>
        )}
      </div>

      {/* Header merged into a single compact bar */}
      <Card className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-emerald-50 text-emerald-600 shadow-xs">
          <DynamicIcon name={lesson.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{lesson.category}</p>
          <h1 className="truncate text-base font-bold leading-tight text-slate-900">{lesson.title}</h1>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {isCompleted ? (
            <Pill tone="success"><CheckCircle2 className="mr-0.5 inline h-2.5 w-2.5" />Complete</Pill>
          ) : (
            <Pill tone="neutral">{lesson.difficulty}</Pill>
          )}
          <span className="text-[10px] text-slate-400">{questions.length} questions</span>
        </div>
      </Card>

      {/* All lesson sections merged into ONE card with dividers instead of 5 separate boxes */}
      <Card pad={false}>
        {sections.map((s, i) => (
          <div key={s.label} className={`px-4 py-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${s.accent}`}>
              <s.Icon className="h-3 w-3" />
              {s.label}
            </div>
            <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-slate-600">{s.body}</p>
          </div>
        ))}
      </Card>

      <CardLabel icon={<Lightbulb className="h-3 w-3" />}>Check your understanding</CardLabel>
      <LessonQuiz lessonId={lesson.id} questions={questions} alreadyCompleted={isCompleted} />
    </div>
  );
}
