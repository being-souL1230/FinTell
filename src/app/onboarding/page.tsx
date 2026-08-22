"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Card, Field, Input, Pill, ProgressBar } from "@/components/ui";
import { ArrowLeft, ArrowRight, Briefcase, Globe, GraduationCap, IndianRupee, Target } from "lucide-react";
import { inr } from "@/lib/calculators";
import { buildMoneyPlan, type FinancialGoal } from "@/lib/money-coach";
import { LANGS, type LangCode } from "@/lib/i18n";

const LANGUAGES = LANGS.map((l) => ({
  code: l.code,
  label: l.nativeName,
  sub: l.englishName,
}));

const LEVELS = [
  { code: "new" as const, label: "Complete beginner", sub: "I just opened my first bank account" },
  { code: "some" as const, label: "Some experience", sub: "I use ATM and UPI but do not fully understand them" },
  { code: "basic" as const, label: "Basic knowledge", sub: "I know basic banking terms" },
];

const GOALS: { code: FinancialGoal; label: string }[] = [
  { code: "emergency_fund", label: "Emergency fund" },
  { code: "debt_reduction", label: "Reduce debt" },
  { code: "monthly_saving", label: "Save every month" },
  { code: "education", label: "Education" },
  { code: "business", label: "Business" },
  { code: "other", label: "Other" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<LangCode>("en");
  const [hasBusiness, setHasBusiness] = useState(false);
  const [level, setLevel] = useState<"new" | "some" | "basic">("new");
  const [loading, setLoading] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(20000);
  const [fixedExpenses, setFixedExpenses] = useState(9000);
  const [variableExpenses, setVariableExpenses] = useState(5000);
  const [existingDebtEmi, setExistingDebtEmi] = useState(0);
  const [savingsGoalName, setSavingsGoalName] = useState("Emergency fund");
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(30000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyFinancialGoal, setMonthlyFinancialGoal] = useState<FinancialGoal>("emergency_fund");

  const plan = useMemo(
    () =>
      buildMoneyPlan({
        monthlyIncome,
        fixedExpenses,
        variableExpenses,
        existingDebtEmi,
        savingsGoalName,
        savingsGoalAmount,
        currentSavings,
        monthlyFinancialGoal,
      }),
    [monthlyIncome, fixedExpenses, variableExpenses, existingDebtEmi, savingsGoalName, savingsGoalAmount, currentSavings, monthlyFinancialGoal],
  );

  async function finish() {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, experienceLevel: level, hasBusiness }),
      });
      await fetch("/api/money/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome,
          fixedExpenses,
          variableExpenses,
          existingDebtEmi,
          savingsGoalName,
          savingsGoalAmount,
          currentSavings,
          monthlyFinancialGoal,
          preferredMonthlySaving: plan.recommendedSaving,
        }),
      });
      localStorage.setItem("fintell_user_mode", hasBusiness ? "business" : "personal");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f9fb] px-4 py-8">
      <div className="w-full max-w-2xl space-y-3">
        <div className="flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 w-12 rounded-full ${s <= step ? "bg-emerald-600" : "bg-slate-100"}`} />
          ))}
        </div>

        <Card className="animate-fade-in">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-none bg-emerald-50"><Globe className="h-4 w-4 text-emerald-600" /></div>
                <div><h1 className="text-base font-bold text-slate-900">Choose your language</h1><p className="text-xs text-slate-400">You can change this later.</p></div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`cursor-pointer rounded-none border px-3 py-2.5 text-left transition ${language === l.code ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}>
                    <p className="truncate text-sm font-bold text-slate-900">{l.label}</p><p className="truncate text-[11px] text-slate-400">{l.sub}</p>
                  </button>
                ))}
              </div>
              <Button className="w-full" size="lg" onClick={() => setStep(2)}>Next <ArrowRight className="h-3.5 w-3.5" /></Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-none bg-emerald-50"><Briefcase className="h-4 w-4 text-emerald-600" /></div>
                <div><h1 className="text-base font-bold text-slate-900">Do you own or manage a business?</h1><p className="text-xs text-slate-400">This configures your dashboard tools.</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasBusiness(false)}
                  className={`cursor-pointer rounded-none border p-4 text-left transition ${!hasBusiness ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <p className="text-sm font-extrabold text-slate-900">Personal Use Only</p>
                  <p className="text-xs text-slate-500 mt-1">Budgeting, financial literacy, savings goals &amp; scam safety.</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setHasBusiness(true); setMonthlyFinancialGoal("business"); }}
                  className={`cursor-pointer rounded-none border p-4 text-left transition ${hasBusiness ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <p className="text-sm font-extrabold text-slate-900">Yes, I run a Business / Shop</p>
                  <p className="text-xs text-slate-500 mt-1">Unlocks GST Audit, Bank Feed Reconciliation &amp; Document OCR.</p>
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Next <ArrowRight className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-none bg-emerald-50"><GraduationCap className="h-4 w-4 text-emerald-600" /></div>
                <div><h1 className="text-base font-bold text-slate-900">Your banking experience</h1><p className="text-xs text-slate-400">This sets your learning path.</p></div>
              </div>
              <div className="grid gap-2">
                {LEVELS.map((l) => (
                  <button key={l.code} onClick={() => setLevel(l.code)} className={`cursor-pointer rounded-none border px-4 py-2.5 text-left transition ${level === l.code ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}>
                    <p className="text-sm font-bold text-slate-900">{l.label}</p><p className="text-xs text-slate-400">{l.sub}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setStep(2)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><Button className="flex-1" onClick={() => setStep(4)}>Next <ArrowRight className="h-3.5 w-3.5" /></Button></div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-none bg-emerald-50"><IndianRupee className="h-4 w-4 text-emerald-600" /></div>
                <div><h1 className="text-base font-bold text-slate-900">Set up My Money</h1><p className="text-xs text-slate-400">Use approximate monthly numbers. No bank details needed.</p></div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Monthly income"><Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} /></Field>
                  <Field label="Fixed expenses"><Input type="number" value={fixedExpenses} onChange={(e) => setFixedExpenses(Number(e.target.value))} /></Field>
                  <Field label="Variable expenses"><Input type="number" value={variableExpenses} onChange={(e) => setVariableExpenses(Number(e.target.value))} /></Field>
                  <Field label="Existing debt / EMI"><Input type="number" value={existingDebtEmi} onChange={(e) => setExistingDebtEmi(Number(e.target.value))} /></Field>
                  <Field label="Savings goal name"><Input value={savingsGoalName} onChange={(e) => setSavingsGoalName(e.target.value)} /></Field>
                  <Field label="Savings goal amount"><Input type="number" value={savingsGoalAmount} onChange={(e) => setSavingsGoalAmount(Number(e.target.value))} /></Field>
                  <Field label="Current savings"><Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} /></Field>
                  <Field label="Monthly financial goal">
                    <select className="w-full rounded-none border border-slate-200 bg-white px-2.5 py-1.5 text-xs" value={monthlyFinancialGoal} onChange={(e) => setMonthlyFinancialGoal(e.target.value as FinancialGoal)}>
                      {GOALS.map((g) => <option key={g.code} value={g.code}>{g.label}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="rounded-none border border-slate-200 bg-slate-50/50 p-3">
                  <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Preview plan</p><Pill tone={plan.health === "strong" ? "success" : plan.health === "stable" ? "info" : "warning"}>{plan.health}</Pill></div>
                  <div className="mt-2 space-y-1.5 text-[11px]">
                    <div className="flex justify-between"><span className="text-slate-500">Income</span><strong>{inr(plan.income)}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Expenses + EMI</span><strong>{inr(plan.totalExpenses)}</strong></div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5"><span className="text-slate-600">Available</span><strong className={plan.available >= 0 ? "text-emerald-600" : "text-red-600"}>{inr(plan.available)}</strong></div>
                  </div>
                  <div className="mt-3 rounded-none bg-white p-2 text-[11px] leading-relaxed text-slate-600">
                    Keep about <strong>{inr(plan.recommendedBuffer)}</strong> as buffer and put <strong>{inr(plan.recommendedSaving)}</strong> toward your goal as an example plan.
                  </div>
                  <div className="mt-3"><div className="flex justify-between text-[10px] text-slate-400"><span>{savingsGoalName}</span><span>{plan.progressPct}%</span></div><ProgressBar value={plan.progressPct} className="mt-1" /></div>
                  {plan.monthsToGoal && <p className="mt-2 text-[10px] text-slate-400">Approx time: {plan.monthsToGoal} months</p>}
                </div>
              </div>

              <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setStep(3)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><Button className="flex-1" onClick={finish} disabled={loading}><Target className="h-3.5 w-3.5" /> {loading ? "Setting up..." : "Open Dashboard"}</Button></div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
