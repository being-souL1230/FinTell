import { inr } from "@/lib/calculators";

export type FinancialGoal =
  | "emergency_fund"
  | "debt_reduction"
  | "monthly_saving"
  | "education"
  | "home"
  | "business"
  | "other";

export type MoneyProfileInput = {
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  existingDebtEmi?: number;
  savingsGoalName: string;
  savingsGoalAmount: number;
  currentSavings?: number;
  preferredMonthlySaving?: number;
  monthlyFinancialGoal?: FinancialGoal;
  bufferPreference?: number;
};

export type MoneyProgressInput = {
  monthKey: string;
  plannedSaving: number;
  actualSaving: number;
  actualFixedExpenses: number;
  actualVariableExpenses: number;
  note?: string | null;
};

export type MoneyPlan = {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  debtEmi: number;
  totalExpenses: number;
  available: number;
  recommendedBuffer: number;
  recommendedSaving: number;
  flexibleSurplus: number;
  needs: number;
  wants: number;
  savings: number;
  progressPct: number;
  monthsToGoal: number | null;
  targetByNow: number;
  currentSavings: number;
  behindOrAhead: number;
  health: "tight" | "stable" | "strong";
  headline: string;
  focus: string[];
  tradeoffs: string[];
  coachQuestions: string[];
};

export const GOAL_LABELS: Record<FinancialGoal, string> = {
  emergency_fund: "Emergency fund",
  debt_reduction: "Reduce debt",
  monthly_saving: "Build monthly saving habit",
  education: "Education expense",
  home: "Home or family goal",
  business: "Small business goal",
  other: "Other goal",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function safeNumber(n: number | null | undefined) {
  return Number.isFinite(Number(n)) ? Math.max(0, Math.round(Number(n))) : 0;
}

export function buildMoneyPlan(profile: MoneyProfileInput, progress?: MoneyProgressInput | null): MoneyPlan {
  const income = safeNumber(profile.monthlyIncome);
  const fixedExpenses = safeNumber(profile.fixedExpenses);
  const variableExpenses = safeNumber(profile.variableExpenses);
  const debtEmi = safeNumber(profile.existingDebtEmi);
  const currentSavings = safeNumber(profile.currentSavings);
  const goalAmount = Math.max(1, safeNumber(profile.savingsGoalAmount));
  const preferredSaving = safeNumber(profile.preferredMonthlySaving);
  const bufferPreference = clamp(profile.bufferPreference ?? 50, 20, 80);

  const totalExpenses = fixedExpenses + variableExpenses + debtEmi;
  const available = income - totalExpenses;

  let recommendedSaving = 0;
  let recommendedBuffer = 0;
  if (available > 0) {
    // Practical, situation-based split. Lower-income users often need more buffer.
    const bufferShare = income <= 25000 ? bufferPreference / 100 : Math.min(0.45, bufferPreference / 100);
    recommendedBuffer = Math.round(available * bufferShare);
    const maxSaving = available - recommendedBuffer;
    recommendedSaving = preferredSaving > 0 ? Math.min(preferredSaving, maxSaving) : maxSaving;
    if (recommendedSaving < 0) recommendedSaving = 0;
  }

  const flexibleSurplus = Math.max(0, available - recommendedBuffer - recommendedSaving);
  const savings = preferredSaving > 0 ? Math.min(preferredSaving, Math.max(0, available)) : recommendedSaving;
  const needs = fixedExpenses + debtEmi;
  const wants = variableExpenses;
  const progressPct = Math.round((currentSavings / goalAmount) * 100);
  const monthsToGoal = recommendedSaving > 0 ? Math.ceil(Math.max(0, goalAmount - currentSavings) / recommendedSaving) : null;

  const monthNumber = progress?.monthKey ? Number(progress.monthKey.split("-")[1]) || 1 : 1;
  const targetByNow = recommendedSaving * monthNumber;
  const actualProgress = progress ? progress.actualSaving : currentSavings;
  const behindOrAhead = actualProgress - targetByNow;

  const fixedRatio = income > 0 ? fixedExpenses / income : 0;
  const debtRatio = income > 0 ? debtEmi / income : 0;
  const variableRatio = income > 0 ? variableExpenses / income : 0;
  const savingsRatio = income > 0 ? savings / income : 0;

  const health: MoneyPlan["health"] =
    available <= 0 || debtRatio > 0.35 ? "tight" : savingsRatio >= 0.15 && available > income * 0.15 ? "strong" : "stable";

  const focus: string[] = [];
  if (available <= 0) {
    focus.push("List unavoidable expenses first, then pause non-essential spending until income and expenses are balanced.");
    focus.push("If possible, speak with the lender before missing an EMI. Do not take another high-cost loan to pay an EMI.");
  } else {
    focus.push(`Keep about ${inr(recommendedBuffer)} as a practical buffer for food, travel, medical needs and small surprises.`);
    focus.push(`Use about ${inr(recommendedSaving)} as an example allocation toward ${profile.savingsGoalName || "your goal"}.`);
  }
  if (variableRatio > 0.25) {
    focus.push("Track variable expenses like food delivery, travel, mobile recharge and small daily purchases for 7 days.");
  }
  if (debtRatio > 0.25) {
    focus.push("Debt EMI is high compared with income. Avoid new borrowing until current EMI becomes comfortable.");
  }
  if (currentSavings < Math.min(goalAmount, totalExpenses)) {
    focus.push("Build a small emergency reserve before considering risky products or locked-in investments.");
  }

  const tradeoffs: string[] = [
    "More savings means faster goal completion, but less cash buffer for daily uncertainty.",
    "More buffer improves stability, but your savings goal takes longer.",
    "Debt repayment reduces future pressure, but only if essential monthly expenses are still covered.",
  ];

  const coachQuestions = [
    "Is your emergency fund already enough for one month of essential expenses?",
    "Do you have any upcoming expense in the next 30 days?",
    "Is any EMI or loan payment due before your next income arrives?",
    "Can one variable expense be reduced this week without affecting basic needs?",
  ];

  const headline =
    available > 0
      ? `You have approximately ${inr(available)} available this month after expenses and EMI.`
      : `Your planned expenses are ${inr(Math.abs(available))} higher than your income this month.`;

  return {
    income,
    fixedExpenses,
    variableExpenses,
    debtEmi,
    totalExpenses,
    available,
    recommendedBuffer,
    recommendedSaving,
    flexibleSurplus,
    needs,
    wants,
    savings,
    progressPct: clamp(progressPct, 0, 100),
    monthsToGoal,
    targetByNow,
    currentSavings,
    behindOrAhead,
    health,
    headline,
    focus: focus.slice(0, 4),
    tradeoffs,
    coachQuestions,
  };
}

export function getCurrentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function buildCoachAnswer(question: string, plan: MoneyPlan, profile: MoneyProfileInput) {
  const q = question.toLowerCase();
  const lines: string[] = [];

  lines.push("I can help you think through this safely. I will not recommend a stock, app, or specific product.");
  lines.push("");
  lines.push(`Current picture: income ${inr(plan.income)}, expenses plus EMI ${inr(plan.totalExpenses)}, available ${inr(plan.available)}.`);

  if (q.includes("extra") || q.includes("5000") || q.includes("left") || q.includes("surplus")) {
    lines.push("");
    lines.push("Before using extra money, check these in order:");
    lines.push("1. Is your emergency fund below one month of essential expenses?");
    lines.push("2. Is any EMI or bill due before next income?");
    lines.push("3. Do you have an upcoming family, medical, school, farming, or travel expense?");
    lines.push("4. Will using this money still leave a small buffer?");
    lines.push("");
    lines.push(`A safe educational split could be: keep ${inr(plan.recommendedBuffer)} buffer and put ${inr(plan.recommendedSaving)} toward ${profile.savingsGoalName}.`);
  } else if (q.includes("debt") || q.includes("emi") || q.includes("loan")) {
    lines.push("");
    lines.push("For debt decisions, compare interest cost, due dates and cash buffer. Paying high-interest debt early can reduce future pressure, but missing essential expenses is risky.");
    lines.push(`Your current EMI load is ${inr(plan.debtEmi)} per month.`);
  } else if (q.includes("save") || q.includes("goal") || q.includes("emergency")) {
    lines.push("");
    lines.push(`${profile.savingsGoalName} target is ${inr(profile.savingsGoalAmount)}. Current progress is ${inr(plan.currentSavings)} (${plan.progressPct}%).`);
    lines.push(plan.monthsToGoal ? `At ${inr(plan.recommendedSaving)} per month, approximate time is ${plan.monthsToGoal} months.` : "Right now there is no positive monthly surplus, so first focus on balancing income and expenses.");
  } else if (q.includes("spend") || q.includes("expense") || q.includes("budget")) {
    lines.push("");
    lines.push("Start by separating fixed expenses from variable expenses. Fixed expenses are harder to change. Variable expenses are where small weekly control usually works best.");
    lines.push(`Your variable expenses are ${inr(plan.variableExpenses)} this month.`);
  } else {
    lines.push("");
    lines.push("A practical monthly plan is: protect essentials first, pay mandatory EMI on time, keep a buffer, then save toward the goal. After that, learn about suitable products from official sources.");
  }

  lines.push("");
  lines.push("Trade-offs to remember:");
  plan.tradeoffs.forEach((t) => lines.push(`• ${t}`));
  lines.push("");
  lines.push("Educational note: verify real product terms with official bank channels before taking action.");

  return lines.join("\n");
}
