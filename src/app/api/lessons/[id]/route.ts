import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { lessons, quizQuestions } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const lessonId = Number(id);
  if (Number.isNaN(lessonId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.lessonId, lessonId))
    .orderBy(asc(quizQuestions.orderIndex));

  return NextResponse.json({ lesson, questions });
}

const updateSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  icon: z.string().trim().max(10).optional(),
  difficulty: z.enum(["easy", "medium", "advanced"]).optional(),
  summary: z.string().trim().min(5).optional(),
  whyItMatters: z.string().trim().min(5).optional(),
  explanation: z.string().trim().min(5).optional(),
  example: z.string().trim().min(5).optional(),
  commonMistake: z.string().trim().min(5).optional(),
  safetyTip: z.string().trim().min(5).optional(),
  orderIndex: z.number().int().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const lessonId = Number(id);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const [lesson] = await db
    .update(lessons)
    .set(parsed.data)
    .where(eq(lessons.id, lessonId))
    .returning();

  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  return NextResponse.json({ lesson });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const lessonId = Number(id);
  await db.delete(lessons).where(eq(lessons.id, lessonId));

  return NextResponse.json({ ok: true });
}
