import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { lessonProgress, quizQuestions } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { addXp, evaluateBadges } from "@/lib/scoring";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  answers: z.array(z.object({ questionId: z.number().int(), chosenOption: z.enum(["a", "b", "c", "d"]) })).default([]),
});

export async function POST(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { id } = await params;
  const lessonId = Number(id);
  if (Number.isNaN(lessonId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const parsed = schema.safeParse(await request.json().catch(() => ({ answers: [] })));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { answers } = parsed.data;
  let quizScore: number | null = null;
  let quizTotal: number | null = null;
  const results: { questionId: number; correct: boolean; correctOption: string; explanation: string }[] = [];

  if (answers.length > 0) {
    const questionIds = answers.map((a) => a.questionId);
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(and(eq(quizQuestions.lessonId, lessonId), inArray(quizQuestions.id, questionIds)));

    quizTotal = questions.length;
    quizScore = 0;
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const correct = question.correctOption === answer.chosenOption;
      if (correct) quizScore += 1;
      results.push({
        questionId: question.id,
        correct,
        correctOption: question.correctOption,
        explanation: question.explanation,
      });
    }
  }

  const [existing] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lessonId)))
    .limit(1);

  const wasAlreadyCompleted = existing?.completed ?? false;

  if (existing) {
    await db
      .update(lessonProgress)
      .set({ completed: true, quizScore, quizTotal, completedAt: new Date() })
      .where(eq(lessonProgress.id, existing.id));
  } else {
    await db.insert(lessonProgress).values({
      userId: user.id,
      lessonId,
      completed: true,
      quizScore,
      quizTotal,
      completedAt: new Date(),
    });
  }

  let xpAwarded = 0;
  if (!wasAlreadyCompleted) {
    xpAwarded += 10;
    if (quizTotal) xpAwarded += 20;
    await addXp(user.id, xpAwarded);
  }

  const newBadges = await evaluateBadges(user.id);

  return NextResponse.json({ ok: true, quizScore, quizTotal, results, xpAwarded, newBadges });
}
