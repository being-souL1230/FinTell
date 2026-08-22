"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardLabel,
  Collapse,
  DataTable,
  Field,
  Input,
  Pill,
  ProgressBar,
  Slider,
  SplitBar,
  StatStrip,
} from "@/components/ui";
import { buildMoneyPlan, getCurrentMonthKey, GOAL_LABELS, type FinancialGoal, type MoneyProgressInput } from "@/lib/money-coach";
import { inr } from "@/lib/calculators";
import { FormattedMarkdown } from "@/components/FormattedMarkdown";
import {
  Bot,
  CheckCircle2,
  IndianRupee,
  Lightbulb,
  MessageSquareText,
  Save,
  Send,
  Target,
  TrendingUp,
  WalletCards,
  SlidersHorizontal,
  PieChart,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { StatementAnalyzer } from "@/components/dashboard/StatementAnalyzer";
import { DebtPayoffCalculator } from "@/components/dashboard/DebtPayoffCalculator";
import { CustomGoalTracker } from "@/components/dashboard/CustomGoalTracker";
import { FileSpreadsheet, CreditCard as DebtIcon, Target as GoalIcon } from "lucide-react";

type Profile = {
  id?: number;
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  existingDebtEmi: number;
  savingsGoalName: string;
  savingsGoalAmount: number;
  currentSavings: number;
  preferredMonthlySaving: number;
  monthlyFinancialGoal: FinancialGoal;
  bufferPreference: number;
  notes?: string | null;
};

type Progress = MoneyProgressInput & { id?: number };

type ChatMessage = { role: "user" | "coach"; text: string };

const DEFAULT_PROFILE: Profile = {
  monthlyIncome: 20000,
  fixedExpenses: 9000,
  variableExpenses: 5000,
  existingDebtEmi: 0,
  savingsGoalName: "Emergency fund",
  savingsGoalAmount: 30000,
  currentSavings: 0,
  preferredMonthlySaving: 0,
  monthlyFinancialGoal: "emergency_fund",
  bufferPreference: 50,
};

export function PersonalMoneyCoach({
  initialProfile,
  initialProgress,
}: {
  initialProfile: Profile | null;
  initialProgress: Progress[];
}) {
  const [activeTab, setActiveTab] = useState<"plan" | "goals" | "coach">("plan");
  const [mainTab, setMainTab] = useState<"PLAN" | "STATEMENT" | "DEBT" | "GOALS">("PLAN");
  const [profile, setProfile] = useState<Profile>(initialProfile ?? DEFAULT_PROFILE);
  const [savedProfile, setSavedProfile] = useState<Profile | null>(initialProfile);
  const [progressRows, setProgressRows] = useState<Progress[]>(initialProgress);
  const currentMonth = getCurrentMonthKey();
  const currentProgress = progressRows.find((p) => p.monthKey === currentMonth) ?? null;
  const [progress, setProgress] = useState<Progress>(
    currentProgress ?? {
      monthKey: currentMonth,
      plannedSaving: profile.preferredMonthlySaving || 0,
      actualSaving: profile.currentSavings || 0,
      actualFixedExpenses: profile.fixedExpenses,
      actualVariableExpenses: profile.variableExpenses,
      note: "",
    },
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "coach",
      text:
        "Welcome! I am your Financial Coach. I track your budget, help plan your savings, and answer questions. I never ask for passwords or PINs.",
    },
  ]);
  const [asking, setAsking] = useState(false);

  const plan = useMemo(() => buildMoneyPlan(profile, progress), [profile, progress]);

  function patch<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/money/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, preferredMonthlySaving: profile.preferredMonthlySaving || plan.recommendedSaving }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedProfile(data.profile);
        setProfile(data.profile);
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveProgress() {
    setSavingProgress(true);
    try {
      const res = await fetch("/api/money/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
      const data = await res.json();
      if (res.ok) {
        const next = progressRows.filter((p) => p.monthKey !== data.progress.monthKey);
        setProgressRows([...next, data.progress].sort((a, b) => a.monthKey.localeCompare(b.monthKey)));
        setProgress(data.progress);
      }
    } finally {
      setSavingProgress(false);
    }
  }

  async function askCoach(question = coachQuestion) {
    const q = question.trim();
    if (!q || asking) return;
    setChat((m) => [...m, { role: "user", text: q }]);
    setCoachQuestion("");
    setAsking(true);
    try {
      const res = await fetch("/api/money/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setChat((m) => [...m, { role: "coach", text: data.answer ?? "Please set up your money profile first." }]);
    } finally {
      setAsking(false);
    }
  }

  const remaining = Math.max(0, profile.savingsGoalAmount - profile.currentSavings);
  const progressDelta = progress.actualSaving - progress.plannedSaving;
  const needsTotal = profile.fixedExpenses + profile.existingDebtEmi;
  const wantsTotal = profile.variableExpenses;
  const allocationRows = [
    ["Needs", inr(needsTotal), `${profile.monthlyIncome ? Math.round((needsTotal / profile.monthlyIncome) * 100) : 0}%`, "Fixed expenses & EMI"],
    ["Wants", inr(wantsTotal), `${profile.monthlyIncome ? Math.round((wantsTotal / profile.monthlyIncome) * 100) : 0}%`, "Flexible expenses"],
    ["Savings", inr(plan.recommendedSaving), `${profile.monthlyIncome ? Math.round((plan.recommendedSaving / profile.monthlyIncome) * 100) : 0}%`, profile.savingsGoalName],
    ["Buffer", inr(plan.recommendedBuffer), `${profile.monthlyIncome ? Math.round((plan.recommendedBuffer / profile.monthlyIncome) * 100) : 0}%`, "Emergency cushion"],
  ];

  return (
    <div className="space-y-6">
      {/* TAB NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white p-2.5 rounded-none shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setMainTab("PLAN")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              mainTab === "PLAN" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <WalletCards className="h-4 w-4 text-emerald-400" />
            <span>My Budget Plan</span>
          </button>

          <button
            onClick={() => setMainTab("STATEMENT")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              mainTab === "STATEMENT" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4 text-teal-400" />
            <span>Statement &amp; Subscriptions</span>
          </button>

          <button
            onClick={() => setMainTab("DEBT")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              mainTab === "DEBT" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <DebtIcon className="h-4 w-4 text-purple-400" />
            <span>Debt Payoff Calculator</span>
          </button>

          <button
            onClick={() => setMainTab("GOALS")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              mainTab === "GOALS" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GoalIcon className="h-4 w-4 text-amber-400" />
            <span>Custom Goal Tracker</span>
          </button>
        </div>
      </div>

      {mainTab === "STATEMENT" && <StatementAnalyzer />}
      {mainTab === "DEBT" && <DebtPayoffCalculator />}
      {mainTab === "GOALS" && <CustomGoalTracker />}

      {mainTab === "PLAN" && (
        <div className="space-y-6">
          {!savedProfile && (
            <Alert tone="info">
              <Sparkles className="h-4 w-4 text-lime-700 inline mr-1.5" />
              Start by setting approximate monthly amounts below. Your financial data stays private and safe.
            </Alert>
          )}

      {/* 🌟 UNIFIED EXECUTIVE METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 rounded-none bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3.5 pb-3 sm:pb-0 sm:pr-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-lime-100 text-lime-800 shadow-xs">
            <IndianRupee className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Income</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{inr(plan.income)}</p>
            <p className="text-[11px] font-medium text-slate-500">Gross Budget</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4 pb-3 sm:pb-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-red-50 text-red-600 shadow-xs">
            <TrendingUp className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outflow</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{inr(plan.totalExpenses)}</p>
            <p className="text-[11px] font-medium text-slate-500">Needs + Wants + EMI</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4 pb-3 sm:pb-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-lime-50 text-lime-700 shadow-xs">
            <WalletCards className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available Surplus</p>
            <p className={`text-xl sm:text-2xl font-extrabold leading-tight ${plan.available >= 0 ? "text-lime-700" : "text-red-600"}`}>
              {inr(plan.available)}
            </p>
            <p className="text-[11px] font-bold text-lime-800">{plan.available >= 0 ? "Positive Cash Flow" : "Cash Gap"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-amber-50 text-amber-600 shadow-xs">
            <Target className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Goal Progress</p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 leading-tight">{plan.progressPct}%</p>
            <p className="text-[11px] font-bold text-amber-700">{inr(profile.currentSavings)} / {inr(profile.savingsGoalAmount)}</p>
          </div>
        </div>
      </div>

      {/* 🧭 SEGMENTED NAVIGATION SWITCHER */}
      <div className="flex items-center gap-2 rounded-none bg-amber-50/30 border border-slate-200/80 p-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab("plan")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === "plan"
              ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20"
              : "text-slate-600 hover:bg-lime-50/60 hover:text-slate-900"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" /> 1. Monthly Budget Setup
        </button>

        <button
          onClick={() => setActiveTab("goals")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === "goals"
              ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20"
              : "text-slate-600 hover:bg-lime-50/60 hover:text-slate-900"
          }`}
        >
          <PieChart className="h-4 w-4" /> 2. Goals &amp; Expense Breakdown
        </button>

        <button
          onClick={() => setActiveTab("coach")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === "coach"
              ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20"
              : "text-slate-600 hover:bg-lime-50/60 hover:text-slate-900"
          }`}
        >
          <Bot className="h-4 w-4" /> 3. AI Money Coach &amp; Tracker
        </button>
      </div>

      {/* TAB 1: MONTHLY BUDGET SETUP & RECOMMENDATION */}
      {activeTab === "plan" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Master Panel: Interactive Sliders Setup (6 cols) */}
          <Card className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-lime-700" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Income &amp; Budget Setup</h2>
              </div>
              <Pill tone={plan.health === "strong" ? "success" : plan.health === "stable" ? "info" : "warning"}>
                {plan.health} Health
              </Pill>
            </div>

            <div className="space-y-4">
              <Slider label="Monthly income" value={profile.monthlyIncome} onChange={(v) => patch("monthlyIncome", v)} min={0} max={200000} step={500} format={inr} marks={["₹0", "₹2 Lakh"]} />
              <Slider label="Fixed expenses (Rent, Bills)" value={profile.fixedExpenses} onChange={(v) => patch("fixedExpenses", v)} min={0} max={200000} step={500} format={inr} marks={["₹0", "₹2 Lakh"]} />
              <Slider label="Variable expenses (Food, Shopping)" value={profile.variableExpenses} onChange={(v) => patch("variableExpenses", v)} min={0} max={150000} step={500} format={inr} marks={["₹0", "₹1.5 Lakh"]} />
              <Slider label="Existing Debt EMI" value={profile.existingDebtEmi} onChange={(v) => patch("existingDebtEmi", v)} min={0} max={100000} step={500} format={inr} marks={["₹0", "₹1 Lakh"]} />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <Button className="w-full" size="md" onClick={saveProfile} disabled={savingProfile}>
                <Save className="h-4 w-4" /> {savingProfile ? "Saving Profile..." : "Save Budget Setup"}
              </Button>
            </div>
          </Card>

          {/* Right Master Panel: Monthly Financial Breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Monthly Plan Summary</h2>
                </div>
                <Pill tone={plan.available >= 0 ? "success" : "danger"}>
                  {plan.available >= 0 ? "Surplus Available" : "Deficit Warning"}
                </Pill>
              </div>

              <div className="rounded-none bg-amber-50/40 p-4 border border-amber-200/60">
                <p className="text-xs font-bold leading-relaxed text-slate-800">{plan.headline}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-none bg-slate-50 p-3.5 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Emergency Buffer</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">{inr(plan.recommendedBuffer)}</p>
                </div>
                <div className="rounded-none bg-lime-50/80 p-3.5 border border-lime-200">
                  <p className="text-[10px] font-bold uppercase text-lime-800">Target Savings</p>
                  <p className="mt-1 text-base font-extrabold text-lime-900">{inr(plan.recommendedSaving)}</p>
                </div>
                <div className="rounded-none bg-sky-50 p-3.5 border border-sky-100">
                  <p className="text-[10px] font-bold uppercase text-sky-700">Surplus Cushion</p>
                  <p className="mt-1 text-base font-extrabold text-sky-900">{inr(plan.flexibleSurplus)}</p>
                </div>
              </div>
            </Card>

            <Card pad={false} className="overflow-hidden">
              <div className="border-b border-slate-100 bg-amber-50/20 px-6 py-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-lime-700" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Recommended Action Plan</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {plan.focus.map((f, i) => (
                  <div key={f} className="flex items-start gap-3 p-4 text-xs font-medium text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500 text-[10px] font-extrabold text-slate-950">
                      {i + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SAVINGS GOALS & EXPENSE BREAKDOWN */}
      {activeTab === "goals" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Master Panel: Goal Configuration (6 cols) */}
          <Card className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Savings Goal Settings</h2>
              </div>
              <Pill tone="info">{profile.savingsGoalName}</Pill>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Goal name">
                <Input value={profile.savingsGoalName} onChange={(e) => patch("savingsGoalName", e.target.value)} />
              </Field>
              <Field label="Category">
                <select
                  className="w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 focus:border-lime-500"
                  value={profile.monthlyFinancialGoal}
                  onChange={(e) => patch("monthlyFinancialGoal", e.target.value as FinancialGoal)}
                >
                  {Object.entries(GOAL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Target goal amount (₹)">
                <Input type="number" value={profile.savingsGoalAmount} onChange={(e) => patch("savingsGoalAmount", Number(e.target.value))} />
              </Field>
              <Field label="Current savings balance (₹)">
                <Input type="number" value={profile.currentSavings} onChange={(e) => patch("currentSavings", Number(e.target.value))} />
              </Field>
            </div>

            <Slider
              label="Buffer vs Savings Preference"
              value={profile.bufferPreference}
              onChange={(v) => patch("bufferPreference", v)}
              min={20}
              max={80}
              step={5}
              format={(v) => `${v}% Buffer`}
              marks={["Save More", "Buffer More"]}
            />

            <div className="rounded-none bg-amber-50/40 p-4 border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Goal Progress</span>
                <span className="font-black text-lime-700">{plan.progressPct}%</span>
              </div>
              <ProgressBar value={plan.progressPct} />
              <p className="text-[11px] text-slate-500">
                At {inr(plan.recommendedSaving)}/mo, estimated target completion is in{" "}
                <span className="font-bold text-slate-800">{plan.monthsToGoal ? `${plan.monthsToGoal} months` : "N/A"}</span>.
              </p>
            </div>

            <Button className="w-full" size="md" onClick={saveProfile} disabled={savingProfile}>
              <Save className="h-4 w-4" /> {savingProfile ? "Saving Goal..." : "Update Savings Goal"}
            </Button>
          </Card>

          {/* Right Master Panel: Expense Bucket Split (6 cols) */}
          <Card className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-lime-700" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Needs vs Wants Allocation</h2>
              </div>
            </div>

            <SplitBar
              parts={[
                { value: needsTotal, label: "Needs", color: "bg-slate-700" },
                { value: wantsTotal, label: "Wants", color: "bg-amber-400" },
                { value: plan.recommendedSaving, label: "Savings", color: "bg-lime-500" },
                { value: plan.recommendedBuffer, label: "Buffer", color: "bg-sky-400" },
              ]}
            />

            <DataTable head={["Bucket", "Amount", "% Share", "Category Description"]} rows={allocationRows} />
          </Card>
        </div>
      )}

      {/* TAB 3: AI MONEY COACH & MONTHLY TRACKER */}
      {activeTab === "coach" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Master Panel: AI Financial Coach (7 cols) */}
          <Card className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-lime-700" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">AI Financial Coach</h2>
              </div>
              <Pill tone="success">Active Assistant</Pill>
            </div>

            <div className="h-72 space-y-3 overflow-y-auto rounded-none bg-amber-50/20 p-4 border border-slate-100">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-none px-4 py-3 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "ml-12 bg-slate-900 text-white font-medium"
                      : "mr-12 bg-white text-slate-800 border border-slate-200/80 shadow-xs"
                  }`}
                >
                  {m.role === "coach" ? <FormattedMarkdown content={m.text} /> : m.text}
                </div>
              ))}
              {asking && (
                <div className="mr-12 rounded-none bg-white border border-slate-200/80 px-4 py-3 text-xs text-slate-400 animate-pulse">
                  Coach is analyzing your financial query...
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "I have ₹5,000 extra left. What should I do?",
                "How can I reduce expenses this month?",
                "Am I on track for my emergency fund?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => askCoach(q)}
                  className="cursor-pointer rounded-none border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-lime-50 hover:text-slate-900 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                askCoach();
              }}
              className="flex gap-2"
            >
              <Input
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="Ask any budget, debt or savings question..."
              />
              <Button disabled={!coachQuestion.trim() || asking}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>

          {/* Right Master Panel: Monthly Progress Logger (5 cols) */}
          <Card className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lime-700" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Monthly Progress Log</h2>
              </div>
              <Pill tone={progressDelta >= 0 ? "success" : "warning"}>
                {progressDelta >= 0 ? `${inr(progressDelta)} ahead` : `${inr(Math.abs(progressDelta))} behind`}
              </Pill>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Month">
                <Input value={progress.monthKey} onChange={(e) => setProgress({ ...progress, monthKey: e.target.value })} />
              </Field>
              <Field label="Planned savings (₹)">
                <Input type="number" value={progress.plannedSaving} onChange={(e) => setProgress({ ...progress, plannedSaving: Number(e.target.value) })} />
              </Field>
              <Field label="Actual savings (₹)">
                <Input type="number" value={progress.actualSaving} onChange={(e) => setProgress({ ...progress, actualSaving: Number(e.target.value) })} />
              </Field>
              <Field label="Actual variable (₹)">
                <Input type="number" value={progress.actualVariableExpenses} onChange={(e) => setProgress({ ...progress, actualVariableExpenses: Number(e.target.value) })} />
              </Field>
            </div>

            <Field label="Monthly Note">
              <Input
                value={progress.note ?? ""}
                onChange={(e) => setProgress({ ...progress, note: e.target.value })}
                placeholder="e.g. Festival travel, medical expense, bonus"
              />
            </Field>

            <Button size="md" className="w-full" onClick={saveProgress} disabled={savingProgress}>
              <Save className="h-4 w-4" /> {savingProgress ? "Saving Log..." : "Log Month Progress"}
            </Button>

            {progressRows.length > 0 && (
              <Collapse title="History Logs" badge={`${progressRows.length} Months`}>
                <DataTable
                  head={["Month", "Plan", "Actual", "Status"]}
                  rows={progressRows.map((p) => [
                    p.monthKey,
                    inr(p.plannedSaving),
                    inr(p.actualSaving),
                    p.actualSaving >= p.plannedSaving ? "On Track" : `${inr(p.plannedSaving - p.actualSaving)} Behind`,
                  ])}
                />
              </Collapse>
            )}
          </Card>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
