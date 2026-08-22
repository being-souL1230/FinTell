"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingDown,
  Info,
  HelpCircle,
  IndianRupee,
  Search,
  Scale,
  Check,
} from "lucide-react";
import { InvestTutorialIllustration } from "@/components/dashboard/ScamIllustrations";

export default function InvestPage() {
  const [schemeName, setSchemeName] = useState("High Yield Daily Crypto Growth");
  const [returnPct, setReturnPct] = useState(25);
  const [hasRecruitment, setHasRecruitment] = useState(true);
  const [lockInMonths, setLockInMonths] = useState(12);
  const [isRegulated, setIsRegulated] = useState(false);

  // Deterministic Risk Score computation
  let riskScore = 20;
  const redFlags: string[] = [];
  const verifications: string[] = [
    "Verify if scheme operator is registered with SEBI / RBI.",
    "Inspect physical business registration and audited financial records.",
    "Never transfer funds to personal UPI accounts or unverified wallet addresses.",
  ];

  if (returnPct > 15) {
    riskScore += 40;
    redFlags.push(`Guaranteed ${returnPct}% return per month is mathematically unsustainable and indicates a Ponzi trap.`);
  }
  if (hasRecruitment) {
    riskScore += 30;
    redFlags.push("Recruitment-based incentive structure relies on fresh downline money rather than real profits.");
  }
  if (!isRegulated) {
    riskScore += 20;
    redFlags.push("Unregulated product with no investor grievance redressal or statutory protection.");
  }
  if (lockInMonths > 6) {
    riskScore += 10;
    redFlags.push(`Long lock-in period (${lockInMonths} months) prevents early exit when red flags appear.`);
  }

  riskScore = Math.min(riskScore, 98);
  const riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";

  return (
    <div className="space-y-6">
      {/* 🌟 HERO TUTORIAL BANNER WITH EXACT SCAM DEFENSE THEME COLOR */}
      <div className="relative overflow-hidden rounded-none border border-red-900 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Tutorial Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-none bg-red-500/20 border border-red-400/30 px-3 py-1 text-xs font-bold text-red-300">
                FinTell Pillar 4: Protect Tutorial
              </span>
              <span className="text-xs text-slate-300">Investment Safety Analyzer</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center gap-2 flex-wrap">
              <span>Investment Safety <span className="text-red-400">Analyzer</span></span>
              <ShieldCheck className="h-7 w-7 text-red-400 inline stroke-[2.5]" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              How it works: Evaluate any financial scheme or plan before investing real money. Detect fee traps, Ponzi structures, &amp; lock-in risks with evidence.
            </p>

            {/* 3-STEP QUICK TUTORIAL RIBBON */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="rounded-none bg-white/10 border border-white/10 p-2.5 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-black text-red-300 uppercase tracking-wider">Step 1</span>
                <p className="text-xs font-bold text-white leading-tight">Enter Details</p>
                <p className="text-[10px] text-slate-300">Yield, lock-in &amp; referral rules</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-2.5 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-black text-red-300 uppercase tracking-wider">Step 2</span>
                <p className="text-xs font-bold text-white leading-tight">Risk Audit</p>
                <p className="text-[10px] text-slate-300">Deterministic rule check</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-2.5 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-black text-red-300 uppercase tracking-wider">Step 3</span>
                <p className="text-xs font-bold text-white leading-tight">Inspect Evidence</p>
                <p className="text-[10px] text-slate-300">SEBI / RBI checklist</p>
              </div>
            </div>
          </div>

          {/* Right SVG Illustration (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <InvestTutorialIllustration className="w-full h-[220px] sm:h-[260px] lg:h-[280px] max-w-[440px] drop-shadow-2xl object-contain" />
          </div>
        </div>
      </div>

      {/* 🏛️ MAIN 2-COLUMN GRID: ANALYZER FORM & EVIDENCE-BASED OUTPUT (Equal Height & Compact Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* LEFT COLUMN: INVESTMENT DETAILS FORM */}
        <div className="rounded-none border border-slate-200 bg-white p-5 sm:p-6 shadow-xs lg:h-[620px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              <h2 className="text-sm font-extrabold text-slate-900">Step 1: Enter Product Parameters</h2>
            </div>

            <div className="space-y-4 text-xs pt-3">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Investment Scheme Name</label>
                <input
                  type="text"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="e.g. Guaranteed Daily Income Plan"
                />
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-slate-700 mb-1">
                  <span>Promised Monthly Return %</span>
                  <span className="text-amber-700 font-black">{returnPct}% / month</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={returnPct}
                  onChange={(e) => setReturnPct(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-none border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-extrabold text-slate-900">Mandatory Downline Recruitment?</p>
                  <p className="text-[10px] text-slate-500">Requires bringing new members to earn bonus</p>
                </div>
                <input
                  type="checkbox"
                  checked={hasRecruitment}
                  onChange={(e) => setHasRecruitment(e.target.checked)}
                  className="h-5 w-5 accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-none border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-extrabold text-slate-900">Regulated by SEBI / RBI / IRDAI?</p>
                  <p className="text-[10px] text-slate-500">Official government financial regulator approval</p>
                </div>
                <input
                  type="checkbox"
                  checked={isRegulated}
                  onChange={(e) => setIsRegulated(e.target.checked)}
                  className="h-5 w-5 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Lock-in Period (Months)</label>
                <select
                  value={lockInMonths}
                  onChange={(e) => setLockInMonths(Number(e.target.value))}
                  className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-semibold text-slate-900 outline-none"
                >
                  <option value={0}>No lock-in (Liquid)</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={36}>36 Months (3 Years)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3">
            * Deterministic Risk Engine updates scores in real time based on SEBI safety benchmarks.
          </div>
        </div>

        {/* RIGHT COLUMN: RISK DETECTION WITH EVIDENCE (Slide 7) */}
        <div className="rounded-none border border-slate-200 bg-white p-5 sm:p-6 shadow-xs lg:h-[620px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900">Steps 2 &amp; 3: Risk Audit &amp; Evidence</h2>
              <span className="text-xs font-bold text-slate-400">PDF Slide 7 Specification</span>
            </div>

            {/* RISK LEVEL GAUGE WIDGET matching Slide 7 */}
            <div className="flex items-center gap-4 rounded-none border border-slate-200 bg-slate-50 p-4 mt-3">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="7" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={riskLevel === "HIGH" ? "#ef4444" : riskLevel === "MEDIUM" ? "#f59e0b" : "#10b981"}
                    strokeWidth="7"
                    strokeDasharray="201"
                    strokeDashoffset={201 - (201 * riskScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">{riskScore}%</span>
                  <span className="text-[9px] font-bold text-slate-400">RISK</span>
                </div>
              </div>

              <div>
                <span
                  className={`inline-block rounded-none px-3 py-1 text-xs font-black ${
                    riskLevel === "HIGH"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : riskLevel === "MEDIUM"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  RISK LEVEL: {riskLevel}
                </span>
                <p className="mt-1 text-xs font-extrabold text-slate-900 truncate max-w-[200px]">{schemeName}</p>
                <p className="text-[11px] text-slate-500">Evidence-based evaluation output</p>
              </div>
            </div>

            {/* WHY THIS MATTERS SECTION matching Slide 7 */}
            <div className="space-y-2 pt-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Why This Matters (Detected Evidence)
              </h3>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {redFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-none border border-red-200 bg-red-50/60 p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="font-semibold text-red-950">{flag}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT USER SHOULD VERIFY SECTION matching Slide 7 */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                What User Should Verify
              </h3>
              <div className="space-y-1.5 text-xs">
                {verifications.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-bold text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-400 italic">
            * FinTell does not manage funds; it analyzes risk evidence to protect your money.
          </div>
        </div>

      </div>
    </div>
  );
}
