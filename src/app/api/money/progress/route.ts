import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { moneyProfiles, monthlyMoneyProgress } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { buildMoneyPlan, getCurrentMonthKey } from "@/lib/money-coach";

const schema = z.object({
  monthKey: z.string().regex(/^\d{4}-\d{2}$/).default(getCurrentMonthKey()),
  plannedSaving: z.coerce.number().int().min(0).max(100_000_000),
  actualSaving: z.coerce.number().int().min(0).max(100_000_000),
  actualFixedExpenses: z.coerce.number().int().min(0).max(100_000_000),
  actualVariableExpenses: z.coerce.number().int().min(0).max(100_000_000),
  note: z.string().max(500).optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);
  const rows = await db
    .select()
    .from(monthlyMoneyProgress)
    .where(eq(monthlyMoneyProgress.userId, user.id))
    .orderBy(desc(monthlyMoneyProgress.monthKey))
    .limit(12);

  const current = rows.find((r) => r.monthKey === getCurrentMonthKey()) ?? null;
  const plan = profile ? buildMoneyPlan(profile, current ?? undefined) : null;

  return NextResponse.json({ progress: rows.reverse(), current, plan });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid monthly progress input" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(monthlyMoneyProgress)
    .where(and(eq(monthlyMoneyProgress.userId, user.id), eq(monthlyMoneyProgress.monthKey, parsed.data.monthKey)))
    .limit(1);

  const values = { ...parsed.data, userId: user.id, updatedAt: new Date() };
  const [progress] = existing
    ? await db.update(monthlyMoneyProgress).set(values).where(eq(monthlyMoneyProgress.id, existing.id)).returning()
    : await db.insert(monthlyMoneyProgress).values(values).returning();

  const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);
  const plan = profile ? buildMoneyPlan(profile, progress) : null;

  return NextResponse.json({ progress, plan });
}
