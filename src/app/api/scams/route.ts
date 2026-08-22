import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { scamScenarios, scamAttempts } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const scenarios = await db.select().from(scamScenarios).orderBy(asc(scamScenarios.orderIndex));

  let attemptedIds = new Set<number>();
  let correctIds = new Set<number>();
  if (user) {
    const attempts = await db.select().from(scamAttempts).where(eq(scamAttempts.userId, user.id));
    attemptedIds = new Set(attempts.map((a) => a.scenarioId));
    correctIds = new Set(attempts.filter((a) => a.correct).map((a) => a.scenarioId));
  }

  return NextResponse.json({
    scenarios: scenarios.map((s) => {
      // Never leak the correct answer / explanation before the user attempts it.
      const { correctOptionIndex: _correctOptionIndex, explanation: _explanation, safetyLesson: _safetyLesson, ...safe } = s;
      void _correctOptionIndex;
      void _explanation;
      void _safetyLesson;
      return {
        ...safe,
        attempted: attemptedIds.has(s.id),
        solvedCorrectly: correctIds.has(s.id),
      };
    }),
  });
}

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(80),
  difficulty: z.enum(["easy", "medium", "advanced"]).default("easy"),
  channel: z.string().trim().max(40).default("SMS"),
  message: z.string().trim().min(3),
  context: z.string().trim().optional(),
  options: z.array(z.string().trim().min(1)).min(2).max(6),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().trim().min(3),
  safetyLesson: z.string().trim().min(3),
  orderIndex: z.number().int().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const [scenario] = await db.insert(scamScenarios).values(parsed.data).returning();
  return NextResponse.json({ scenario }, { status: 201 });
}
