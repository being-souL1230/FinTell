import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { lessons, lessonProgress } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));

  let progressByLesson: Record<number, { completed: boolean; quizScore: number | null; quizTotal: number | null }> = {};
  if (user) {
    const progress = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, user.id));
    progressByLesson = Object.fromEntries(
      progress.map((p) => [p.lessonId, { completed: p.completed, quizScore: p.quizScore, quizTotal: p.quizTotal }]),
    );
  }

  return NextResponse.json({
    lessons: allLessons.map((l) => ({
      ...l,
      progress: progressByLesson[l.id] ?? null,
    })),
  });
}

const createSchema = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(80),
  icon: z.string().trim().max(10).optional(),
  difficulty: z.enum(["easy", "medium", "advanced"]).default("easy"),
  summary: z.string().trim().min(5),
  whyItMatters: z.string().trim().min(5),
  explanation: z.string().trim().min(5),
  example: z.string().trim().min(5),
  commonMistake: z.string().trim().min(5),
  safetyTip: z.string().trim().min(5),
  orderIndex: z.number().int().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const [lesson] = await db
    .insert(lessons)
    .values({ ...parsed.data, icon: parsed.data.icon ?? "📘" })
    .returning();

  return NextResponse.json({ lesson }, { status: 201 });
}
