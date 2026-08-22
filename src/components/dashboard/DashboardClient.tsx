"use client";

import Link from "next/link";
import { useUserMode } from "@/components/ModeContext";
import { inr } from "@/lib/calculators";
import { InteractiveExpensesChart } from "@/components/dashboard/InteractiveExpensesChart";
import { InteractiveBudgetDonut } from "@/components/dashboard/InteractiveBudgetDonut";
import {
  BookOpen,
  Calculator,
  ShieldAlert,
  Lock,
  ArrowRight,
  Sparkles,
  Trophy,
  IndianRupee,
  ArrowUpRight,
  TrendingUp,
  Award,
  HelpCircle,
  FileSearch,
  Scale,
  ShieldCheck,
  BarChart3,
  Bot,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  ChevronRight,
  Zap,
  Info,
  Building2,
  User as UserIcon,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  Check,
} from "lucide-react";

interface DashboardClientProps {
  userName: string;
  userXp: number;
  hasBusiness?: boolean;
  completedCount: number;
  totalLessons: number;
  completionPct: number;
  scamAccuracy: number;
  safetyScore: {
    score: number;
    lessonsCompletionPct: number;
    quizAvgPct: number;
    scamAccuracyPct: number;
    strongAreas: string[];
    needsImprovement: string[];
  };
  continueLesson: any;
  nextScam: any;
  moneyPlan: any;
  earnedBadges: any[];
}

export function DashboardClient({
  userName,
  userXp,
  hasBusiness = false,
  completedCount,
  totalLessons,
  completionPct,
  scamAccuracy,
  safetyScore,
  continueLesson,
  nextScam,
  moneyPlan,
  earnedBadges,
}: DashboardClientProps) {
  const { mode, setMode } = useUserMode();
  const activeMode = hasBusiness ? mode : "personal";

  return (
    <div className="space-y-6">
      {/* 🌟 HERO BANNER - MODE SENSITIVE */}
      <div
        className={`relative overflow-hidden rounded-none border p-6 sm:p-8 text-white shadow-md transition-colors duration-300 ${
          activeMode === "personal"
            ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-emerald-900"
            : "bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 border-teal-900"
        }`}
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-none border px-3 py-1 text-xs font-bold ${
                    activeMode === "personal"
                      ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                      : "bg-teal-500/20 border-teal-400/30 text-teal-300"
                  }`}
                >
                  {activeMode === "personal" ? "Personal Mode: Budget & Literacy" : "Business Mode: GST & Reconciliation"}
                </span>
                {hasBusiness && (
                  <button
                    onClick={() => setMode(mode === "personal" ? "business" : "personal")}
                    className="inline-flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-md"
                  >
                    {mode === "personal" ? (
                      <>
                        <Building2 className="h-3.5 w-3.5 text-teal-300" />
                        <span>Switch to Business Mode</span>
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Switch to Personal Mode</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Hello, {userName.split(" ")[0]}!</span>
                <Sparkles className="h-6 w-6 text-emerald-400 inline" />
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 font-medium">
                {activeMode === "personal"
                  ? "Here is your personal financial health, budget & fraud safety overview."
                  : "Here is your business document intelligence, GST audit & account reconciliation dashboard."}
              </p>
            </div>

            {/* Pillar Action Buttons matching Slide 4 */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/verify"
                className="inline-flex items-center gap-1.5 rounded-none bg-white/10 border border-white/20 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-sm"
              >
                <FileSearch className="h-4 w-4 text-emerald-400" /> Verify Docs
              </Link>
              <Link
                href="/dashboard/reconcile"
                className="inline-flex items-center gap-1.5 rounded-none bg-white/10 border border-white/20 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-sm"
              >
                <Scale className="h-4 w-4 text-teal-400" /> Reconcile
              </Link>
              <Link
                href="/dashboard/assistant"
                className="inline-flex items-center gap-1.5 rounded-none bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 shadow-xs transition cursor-pointer"
              >
                <Bot className="h-4 w-4" /> Ask AI Guardian
              </Link>
            </div>
          </div>

          {/* Mode-specific Quick Metrics Ribbon */}
          {activeMode === "personal" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Financial Health</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-white">82</span>
                  <span className="text-xs text-emerald-200">/ 100</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-300/90 mt-0.5 flex items-center gap-1">
                  <span>Great! Keep going</span>
                  <Sparkles className="h-3 w-3 text-emerald-300 inline" />
                </p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Scam Safety Index</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-white">{safetyScore.score}</span>
                  <span className="text-xs text-emerald-200">/ 100</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-300/90 mt-0.5">Rank: Protected</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Course Lessons</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-white">{completedCount}</span>
                  <span className="text-xs text-emerald-200">/ {totalLessons}</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-300/90 mt-0.5">{completionPct}% Completed</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Rewards &amp; XP</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-amber-400">{userXp}</span>
                  <span className="text-xs text-amber-200">XP</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-300/90 mt-0.5">{earnedBadges.length} Badges Earned</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Reconciled Status</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-emerald-400">4 / 4</span>
                </div>
                <p className="text-[10px] font-bold text-teal-200/90 mt-0.5">100% Transactions Audited</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Duplicate Payments</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-red-400">₹1,250</span>
                </div>
                <p className="text-[10px] font-bold text-red-300 mt-0.5">1 Duplicate Payout Flagged</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">GST Mismatch Flags</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-purple-400">1 GSTIN</span>
                </div>
                <p className="text-[10px] font-bold text-purple-300 mt-0.5">Invoice #INV-2387 Audit</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">OCR Accuracy</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-white">99.4%</span>
                </div>
                <p className="text-[10px] font-bold text-teal-200/90 mt-0.5">Deterministic Rules Engine</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 PERSONAL MODE DASHBOARD */}
      {activeMode === "personal" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. FINANCIAL HEALTH SCORE GAUGE CARD */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Financial Health Score</h2>
                  <p className="text-xs text-slate-500">Overall financial clarity score</p>
                </div>
                <span className="rounded-none bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-black text-emerald-800">
                  82 / 100
                </span>
              </div>

              {/* SVG Radial Gauge */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * 82) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900">82</span>
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                      <span>Great!</span>
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-bold text-slate-600">
                  You are on the right track. Keep going!
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <Link
                  href="/dashboard/money"
                  className="flex items-center justify-center gap-1.5 w-full rounded-none border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900 transition"
                >
                  View Insights &rarr;
                </Link>
              </div>
            </div>

            {/* 2. INTERACTIVE EXPENSES TREND CHART CARD */}
            <InteractiveExpensesChart />

            {/* 3. INTERACTIVE BUDGET OVERVIEW DONUT CARD */}
            <InteractiveBudgetDonut />

          </div>

          {/* LOWER SECTION: PERSONAL RECENT ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Financial Alerts</h3>
                </div>
                <span className="rounded-none bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  3 Personal Items
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-none border border-amber-200 bg-amber-50/50 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-amber-100 text-amber-700 font-bold">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-amber-950">Duplicate payment detected</h4>
                      <span className="text-[10px] font-bold text-amber-700/80">10m ago</span>
                    </div>
                    <p className="text-xs text-amber-900/80 mt-0.5">
                      Electricity Bill payment of <strong>₹1,250</strong> matched duplicate transaction in bank feed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-none border border-blue-200 bg-blue-50/50 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-blue-100 text-blue-700 font-bold">
                    <Info className="h-4.5 w-4.5 text-blue-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-blue-950">Large expense this week</h4>
                      <span className="text-[10px] font-bold text-blue-700/80">1d ago</span>
                    </div>
                    <p className="text-xs text-blue-900/80 mt-0.5">
                      Dining outlay of <strong>₹6,450</strong> exceeded weekly variable expense budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Guardian Card */}
            <div className="rounded-none border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-none bg-white/20 text-white backdrop-blur-md">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">AI Financial Guardian</h3>
                  <p className="text-xs text-emerald-100">Personal Companion</p>
                </div>
              </div>
              <p className="text-xs text-emerald-50/90 leading-relaxed">
                Ask questions in <strong>Hindi or English</strong> about personal budgets, savings, FD rates or scam protection.
              </p>
              <Link
                href="/dashboard/assistant"
                className="flex items-center justify-center gap-2 w-full rounded-none bg-white py-3 text-xs font-black text-emerald-950 hover:bg-emerald-50 transition"
              >
                Start Conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        /* 💼 BUSINESS MODE DASHBOARD (GST & RECONCILIATION FOCUS) */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. GST & RECONCILIATION SUMMARY CARD */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Reconciliation Audit</h2>
                  <p className="text-xs text-slate-500">Bank feed vs Purchase Invoices</p>
                </div>
                <span className="rounded-none bg-teal-100 border border-teal-300 px-2.5 py-1 text-xs font-black text-teal-800">
                  4/4 Audited
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-none bg-emerald-50 border border-emerald-200">
                  <span className="font-extrabold text-emerald-950">Matched Records:</span>
                  <span className="font-black text-emerald-900">2 Transactions</span>
                </div>
                <div className="flex justify-between p-3 rounded-none bg-red-50 border border-red-200">
                  <span className="font-extrabold text-red-950">Duplicate Payments:</span>
                  <span className="font-black text-red-900">₹1,250 Flagged</span>
                </div>
                <div className="flex justify-between p-3 rounded-none bg-purple-50 border border-purple-200">
                  <span className="font-extrabold text-purple-950">GSTIN Tax Errors:</span>
                  <span className="font-black text-purple-900">1 Invoice Mismatch</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <Link
                  href="/dashboard/reconcile"
                  className="flex items-center justify-center gap-1.5 w-full rounded-none border border-teal-200 bg-teal-50 py-2.5 text-xs font-bold text-teal-900 hover:bg-teal-100 transition"
                >
                  Run Full Reconciliation &rarr;
                </Link>
              </div>
            </div>

            {/* 2. DOCUMENT INTELLIGENCE UPLOADER WIDGET */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Document Processing</h2>
                  <p className="text-xs text-slate-500">OCR &amp; Extraction Engine</p>
                </div>
                <span className="rounded-none bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-black text-emerald-800">
                  OCR Ready
                </span>
              </div>

              <div className="rounded-none border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center space-y-2">
                <UploadCloud className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="text-xs font-extrabold text-slate-900">Upload Invoices or Bank CSV</p>
                <p className="text-[10px] text-slate-500">Auto-extracts GSTIN, amounts &amp; dates</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <Link
                  href="/dashboard/verify"
                  className="flex items-center justify-center gap-1.5 w-full rounded-none border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 transition"
                >
                  Open Document Intelligence &rarr;
                </Link>
              </div>
            </div>

            {/* 3. BUSINESS REPORTS & TAX AUDIT WIDGET */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Executive Reports</h2>
                  <p className="text-xs text-slate-500">Downloadable Business Audits</p>
                </div>
                <span className="rounded-none bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  PDF / CSV
                </span>
              </div>

              <div className="p-4 rounded-none bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-teal-400" />
                  <p className="font-extrabold text-white">Monthly Business Audit</p>
                </div>
                <p className="text-[11px] text-slate-300">Includes GST reconciliation summary, duplicate flags &amp; tax voucher logs.</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <Link
                  href="/dashboard/reports"
                  className="flex items-center justify-center gap-1.5 w-full rounded-none border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Generate Tax Audit Report &rarr;
                </Link>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
