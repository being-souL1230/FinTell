import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { moneyProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { buildMoneyPlan } from "@/lib/money-coach";

const schema = z.object({
  monthlyIncome: z.coerce.number().int().min(0).max(10_000_000),
  fixedExpenses: z.coerce.number().int().min(0).max(10_000_000),
  variableExpenses: z.coerce.number().int().min(0).max(10_000_000),
  existingDebtEmi: z.coerce.number().int().min(0).max(10_000_000).optional().default(0),
  savingsGoalName: z.string().trim().min(1).max(160).default("Emergency fund"),
  savingsGoalAmount: z.coerce.number().int().min(1).max(100_000_000),
  currentSavings: z.coerce.number().int().min(0).max(100_000_000).optional().default(0),
  preferredMonthlySaving: z.coerce.number().int().min(0).max(10_000_000).optional().default(0),
  monthlyFinancialGoal: z
    .enum(["emergency_fund", "debt_reduction", "monthly_saving", "education", "home", "business", "other"])
    .default("emergency_fund"),
  bufferPreference: z.coerce.number().int().min(20).max(80).optional().default(50),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);
  if (!profile) return NextResponse.json({ profile: null, plan: null });

  const plan = buildMoneyPlan(profile);
  return NextResponse.json({ profile, plan });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid money profile input" }, { status: 400 });
  }

  const [existing] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);

  const values = { ...parsed.data, userId: user.id, updatedAt: new Date() };
  const [profile] = existing
    ? await db.update(moneyProfiles).set(values).where(eq(moneyProfiles.userId, user.id)).returning()
    : await db.insert(moneyProfiles).values(values).returning();

  const plan = buildMoneyPlan(profile);
  return NextResponse.json({ profile, plan });
}
