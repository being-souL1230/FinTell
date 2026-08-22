import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { simulatorHistory } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { calculateSavingsGoal } from "@/lib/calculators";
import { addXp, evaluateBadges } from "@/lib/scoring";

const schema = z.object({
  monthlyIncome: z.number().min(0).max(10_000_000),
  monthlyExpenses: z.number().min(0).max(10_000_000),
  targetAmount: z.number().min(1).max(100_000_000),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const result = calculateSavingsGoal(parsed.data);

  await db.insert(simulatorHistory).values({
    userId: user.id,
    type: "savings",
    inputJson: parsed.data,
    resultJson: result,
  });

  await addXp(user.id, 15);
  const newBadges = await evaluateBadges(user.id);

  return NextResponse.json({ result, newBadges });
}
