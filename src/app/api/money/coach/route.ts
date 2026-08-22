import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { aiChatLogs, moneyProfiles, monthlyMoneyProgress } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { buildCoachAnswer, buildMoneyPlan } from "@/lib/money-coach";
import { callGroqLlm } from "@/lib/ai-service";

const schema = z.object({ question: z.string().trim().min(1).max(600) });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a question" }, { status: 400 });
  }

  const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);
  if (!profile) {
    return NextResponse.json({
      answer:
        "Set up your My Money profile first. I need your income, expenses, debt EMI and savings goal to give useful educational guidance.",
      source: "money_coach",
    });
  }

  const [latestProgress] = await db
    .select()
    .from(monthlyMoneyProgress)
    .where(eq(monthlyMoneyProgress.userId, user.id))
    .orderBy(desc(monthlyMoneyProgress.monthKey))
    .limit(1);

  const plan = buildMoneyPlan(profile, latestProgress ?? undefined);
  const fallbackAnswer = buildCoachAnswer(parsed.data.question, plan, profile);

  // Formulate rich context for Groq AI
  const prompt = `User Question: "${parsed.data.question}"
User Financial Profile Context:
- Monthly Income: ₹${profile.monthlyIncome.toLocaleString("en-IN")}
- Fixed Expenses: ₹${profile.fixedExpenses.toLocaleString("en-IN")}
- Variable Expenses: ₹${profile.variableExpenses.toLocaleString("en-IN")}
- Current Debt EMI: ₹${profile.existingDebtEmi.toLocaleString("en-IN")}
- Current Savings: ₹${profile.currentSavings.toLocaleString("en-IN")}
- Savings Goal: ${profile.savingsGoalName} (Target: ₹${profile.savingsGoalAmount.toLocaleString("en-IN")})
- Recommended Monthly Savings: ₹${plan.recommendedSaving.toLocaleString("en-IN")}
- Recommended Emergency Buffer: ₹${plan.recommendedBuffer.toLocaleString("en-IN")}

Answer the user's question directly with actionable, structured advice. Use Markdown with bold terms, numbered steps, and bullet points. Never ask for OTP, PIN, passwords, or personal details.`;

  const sysPrompt = "You are FinTell's elite AI Financial Coach. Provide hyper-personalized, structured, clear, and encouraging money management advice tailored to the user's exact financial profile.";

  const groqAnswer = await callGroqLlm(prompt, sysPrompt, 0.3, 700);
  const finalAnswer = groqAnswer || fallbackAnswer;

  await db.insert(aiChatLogs).values({
    userId: user.id,
    question: parsed.data.question,
    answer: finalAnswer,
    source: groqAnswer ? "groq_ai" : "money_coach",
  });

  return NextResponse.json({ answer: finalAnswer, source: groqAnswer ? "groq_ai" : "money_coach", plan });
}
