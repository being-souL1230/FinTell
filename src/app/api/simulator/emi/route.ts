import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { simulatorHistory } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { calculateEmi } from "@/lib/calculators";
import { addXp, evaluateBadges } from "@/lib/scoring";

const schema = z.object({
  loanAmount: z.number().min(1000).max(100_000_000),
  annualRatePercent: z.number().min(0.1).max(50),
  tenureMonths: z.number().int().min(1).max(360),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const result = calculateEmi(parsed.data);

  await db.insert(simulatorHistory).values({
    userId: user.id,
    type: "emi",
    inputJson: parsed.data,
    resultJson: result,
  });

  await addXp(user.id, 15);
  const newBadges = await evaluateBadges(user.id);

  return NextResponse.json({ result, newBadges });
}
