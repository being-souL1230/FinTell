import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { scamScenarios, scamAttempts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { addXp, evaluateBadges } from "@/lib/scoring";

const schema = z.object({
  scenarioId: z.number().int(),
  optionIndex: z.number().int().min(0),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { scenarioId, optionIndex } = parsed.data;

  const [scenario] = await db.select().from(scamScenarios).where(eq(scamScenarios.id, scenarioId)).limit(1);
  if (!scenario) return NextResponse.json({ error: "Scenario not found" }, { status: 404 });

  const correct = scenario.correctOptionIndex === optionIndex;

  await db.insert(scamAttempts).values({
    userId: user.id,
    scenarioId,
    chosenIndex: optionIndex,
    correct,
  });

  let xpAwarded = 0;
  if (correct) {
    xpAwarded = 25;
    await addXp(user.id, xpAwarded);
  }

  const newBadges = await evaluateBadges(user.id);

  return NextResponse.json({
    correct,
    correctOptionIndex: scenario.correctOptionIndex,
    explanation: scenario.explanation,
    safetyLesson: scenario.safetyLesson,
    xpAwarded,
    newBadges,
  });
}
