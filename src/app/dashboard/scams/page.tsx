import { db } from "@/db";
import { scamScenarios, scamAttempts } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { ScamSimulator } from "@/components/dashboard/ScamSimulator";
import { ScamHeroIllustration } from "@/components/dashboard/ScamIllustrations";
import { ShieldAlert, ShieldCheck, Zap, AlertTriangle, CheckCircle2, Lock, Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ScamsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const scenarios = await db.select().from(scamScenarios).orderBy(asc(scamScenarios.orderIndex));
  const attempts = await db.select().from(scamAttempts).where(eq(scamAttempts.userId, user.id));
  const attemptedIds = new Set(attempts.map((a) => a.scenarioId));
  const correctIds = new Set(attempts.filter((a) => a.correct).map((a) => a.scenarioId));

  const safeScenarios = scenarios.map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    difficulty: s.difficulty,
    channel: s.channel,
    message: s.message,
    context: s.context,
    options: s.options,
    attempted: attemptedIds.has(s.id),
    solvedCorrectly: correctIds.has(s.id),
  }));

  const totalSolved = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const accuracyPct = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 🌟 HERO BANNER WITH SHARP RECTANGULAR EDGES */}
      <div className="relative overflow-hidden rounded-none border border-red-900 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Stats (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-none bg-red-500/20 border border-red-400/30 px-3 py-1 text-xs font-bold text-red-300">
                FinTell Pillar 4: Fraud Defense
              </span>
              <span className="text-xs text-slate-300">Interactive Scam Simulator</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center gap-2 flex-wrap">
              <span>Spot Digital Scams <span className="text-red-400">Before</span> They Spot You</span>
              <ShieldCheck className="h-7 w-7 text-red-400 inline stroke-[2.5]" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Practice identifying fake KYC messages, OTP traps, phishing emails, and UPI payment fraud in a safe, risk-free environment.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-none bg-white/10 border border-white/10 p-3 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Drills Solved</p>
                <p className="text-lg font-black text-white mt-0.5">{totalSolved} / {scenarios.length}</p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Fraud Detection Acc.</p>
                <p className={`text-lg font-black mt-0.5 ${accuracyPct >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
                  {accuracyPct}%
                </p>
              </div>

              <div className="rounded-none bg-white/10 border border-white/10 p-3 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Safety Status</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">
                  {accuracyPct >= 70 ? "Protected" : "Learning"}
                </p>
              </div>
            </div>
          </div>

          {/* Right SVG Illustration (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <ScamHeroIllustration className="w-full h-[220px] sm:h-[260px] lg:h-[280px] max-w-[440px] drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* GOLDEN RULE NOTICE CARD WITH SHARP EDGES */}
      <div className="flex items-center gap-3 rounded-none border border-amber-200 bg-amber-50/80 p-4 text-xs shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-amber-100 text-amber-800 font-bold">
          <Lightbulb className="h-4.5 w-4.5 text-amber-700" />
        </div>
        <div>
          <h4 className="font-extrabold text-amber-950">Golden Rule of Financial Safety</h4>
          <p className="text-amber-900/80 mt-0.5">
            Banks, government agencies, and wallet apps <strong>NEVER ask for your OTP, ATM PIN, CVV, or passwords</strong> over call, SMS, or third-party links. Always verify through official banking apps or customer care numbers printed on your card.
          </p>
        </div>
      </div>

      {/* INTERACTIVE SCAM SIMULATOR COMPONENT */}
      <ScamSimulator scenarios={safeScenarios} userName={user.name} />
    </div>
  );
}
