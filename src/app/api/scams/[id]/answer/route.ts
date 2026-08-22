import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { scamScenarios, scamAttempts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { addXp, evaluateBadges } from "@/lib/scoring";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({ chosenIndex: z.number().int().min(0) });

export async function POST(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { id } = await params;
  const scenarioId = Number(id);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const [scenario] = await db.select().from(scamScenarios).where(eq(scamScenarios.id, scenarioId)).limit(1);
  if (!scenario) return NextResponse.json({ error: "Scenario not found" }, { status: 404 });

  const correct = scenario.correctOptionIndex === parsed.data.chosenIndex;

  await db.insert(scamAttempts).values({
    userId: user.id,
    scenarioId,
    chosenIndex: parsed.data.chosenIndex,
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
