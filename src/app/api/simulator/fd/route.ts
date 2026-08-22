import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { simulatorHistory } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { calculateFd, calculateRd } from "@/lib/calculators";
import { addXp, evaluateBadges } from "@/lib/scoring";

const schema = z.object({
  mode: z.enum(["fd", "rd"]).default("fd"),
  principal: z.number().min(100).max(100_000_000).optional(),
  monthlyDeposit: z.number().min(50).max(10_000_000).optional(),
  annualRatePercent: z.number().min(0.1).max(20),
  years: z.number().min(0.25).max(30).optional(),
  months: z.number().int().min(3).max(360).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  let result;

  if (data.mode === "rd") {
    if (!data.monthlyDeposit || !data.months) {
      return NextResponse.json({ error: "monthlyDeposit aur months required hai" }, { status: 400 });
    }
    result = calculateRd({
      monthlyDeposit: data.monthlyDeposit,
      annualRatePercent: data.annualRatePercent,
      months: data.months,
    });
  } else {
    if (!data.principal || !data.years) {
      return NextResponse.json({ error: "principal aur years required hai" }, { status: 400 });
    }
    result = calculateFd({
      principal: data.principal,
      annualRatePercent: data.annualRatePercent,
      years: data.years,
    });
  }

  await db.insert(simulatorHistory).values({
    userId: user.id,
    type: "fd",
    inputJson: data,
    resultJson: result,
  });

  await addXp(user.id, 15);
  const newBadges = await evaluateBadges(user.id);

  return NextResponse.json({ result, newBadges });
}
