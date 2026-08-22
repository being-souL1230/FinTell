"use client";

import { useMemo, useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Mail,
  PhoneCall,
  Lock,
  ChevronRight,
  ShieldCheck,
  Info,
  Check,
  Wifi,
  Battery,
  Search,
  Phone,
  Award,
} from "lucide-react";
import {
  SmsChannelIcon,
  EmailChannelIcon,
  CallChannelIcon,
  UpiChannelIcon,
} from "@/components/dashboard/ScamIllustrations";

import { FraudChecker } from "@/components/dashboard/FraudChecker";
import { VoiceScamSimulator } from "@/components/dashboard/VoiceScamSimulator";
import { SafetyCertificate } from "@/components/dashboard/SafetyCertificate";

type Scenario = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  channel: string;
  message: string;
  context: string | null;
  options: string[];
  attempted: boolean;
  solvedCorrectly: boolean;
};

type AnswerResult = {
  correct: boolean;
  correctOptionIndex: number;
  explanation: string;
  safetyLesson: string;
  xpAwarded: number;
  newBadges: { id: number; name: string; icon: string }[];
};

export function ScamSimulator({ scenarios, userName = "User" }: { scenarios: Scenario[]; userName?: string }) {
  const [activeTab, setActiveTab] = useState<"DRILLS" | "CHECKER" | "VOICE" | "CERTIFICATE">("DRILLS");
  const [selectedId, setSelectedId] = useState<number | null>(scenarios[0]?.id ?? null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = useMemo(() => Array.from(new Set(scenarios.map((s) => s.category))), [scenarios]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const visibleScenarios = categoryFilter ? scenarios.filter((s) => s.category === categoryFilter) : scenarios;
  const selected = scenarios.find((s) => s.id === selectedId) ?? null;

  const totalSolved = scenarios.filter((s) => s.attempted).length;
  const correctCount = scenarios.filter((s) => s.solvedCorrectly).length;
  const accuracyPct = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;
  const safetyScore = Math.min(100, Math.max(50, accuracyPct));

  function selectScenario(id: number) {
    setSelectedId(id);
    setChosen(null);
    setResult(null);
  }

  async function submitAnswer() {
    if (!selected || chosen === null || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/scams/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: selected.id, optionIndex: chosen }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        selected.attempted = true;
        if (data.correct) selected.solvedCorrectly = true;
      }
    } finally {
      setSubmitting(false);
    }
  }

  function renderChannelIcon(channel: string) {
    const c = channel.toLowerCase();
    if (c.includes("sms") || c.includes("text")) return <SmsChannelIcon className="h-4 w-4" />;
    if (c.includes("email") || c.includes("mail")) return <EmailChannelIcon className="h-4 w-4" />;
    if (c.includes("call") || c.includes("voice")) return <CallChannelIcon className="h-4 w-4" />;
    if (c.includes("upi") || c.includes("pay")) return <UpiChannelIcon className="h-4 w-4" />;
    return <SmsChannelIcon className="h-4 w-4" />;
  }

  if (scenarios.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-slate-300 bg-white p-12 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-sm font-extrabold text-slate-700">No Scam Drills Available</h3>
        <p className="text-xs text-slate-400">Check back later for new scenarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TAB NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white p-2.5 rounded-none shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("DRILLS")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              activeTab === "DRILLS" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>Scenario Drills</span>
          </button>

          <button
            onClick={() => setActiveTab("CHECKER")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              activeTab === "CHECKER" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Search className="h-4 w-4 text-emerald-400" />
            <span>Link &amp; UPI AI Checker</span>
          </button>

          <button
            onClick={() => setActiveTab("VOICE")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              activeTab === "VOICE" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Phone className="h-4 w-4 text-teal-400" />
            <span>Emergency Call Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("CERTIFICATE")}
            className={`flex items-center gap-2 rounded-none px-4 py-2 text-xs font-black cursor-pointer transition ${
              activeTab === "CERTIFICATE" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Award className="h-4 w-4 text-amber-400" />
            <span>Safety Certificate</span>
          </button>
        </div>
      </div>

      {activeTab === "CHECKER" && <FraudChecker />}
      {activeTab === "VOICE" && <VoiceScamSimulator />}
      {activeTab === "CERTIFICATE" && (
        <SafetyCertificate
          userName={userName}
          safetyScore={safetyScore}
          totalSolved={totalSolved}
          accuracyPct={accuracyPct}
        />
      )}

      {activeTab === "DRILLS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: COMPACT SCENARIOS LIBRARY */}
          <div className="lg:col-span-4 flex flex-col rounded-none border border-slate-200 bg-white p-5 shadow-xs lg:h-[720px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Scam Scenario Library</h2>
              </div>
              <span className="rounded-none bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {visibleScenarios.length} Drills
              </span>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-1.5 py-3">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`rounded-none px-2.5 py-1 text-[11px] font-extrabold cursor-pointer transition ${
                  !categoryFilter ? "bg-red-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-none px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
                    categoryFilter === cat ? "bg-red-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List of Drills */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {visibleScenarios.map((s) => {
                const active = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    onClick={() => selectScenario(s.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-none border text-left transition cursor-pointer ${
                      active
                        ? "border-red-600 bg-red-50/60 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-slate-100">
                        {renderChannelIcon(s.channel)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{s.category} • {s.difficulty}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {s.solvedCorrectly ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-none bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : s.attempted ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-none bg-amber-100 text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN SIMULATOR & DECISION CARD */}
          <div className="lg:col-span-8 flex flex-col rounded-none border border-slate-200 bg-white p-5 sm:p-6 shadow-xs lg:h-[720px] overflow-y-auto">
            {!selected ? (
              <div className="m-auto text-center text-slate-400">Select a scam drill from the library.</div>
            ) : (
              <div className="space-y-4">
                {/* DRILL HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-none bg-red-100 border border-red-300 px-2.5 py-0.5 text-[10px] font-extrabold text-red-800">
                        {selected.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Channel: {selected.channel}
                      </span>
                    </div>
                    <h2 className="text-base font-black text-slate-900 mt-1">{selected.title}</h2>
                  </div>

                  {selected.solvedCorrectly && (
                    <span className="inline-flex items-center gap-1 rounded-none bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Solved Correctly
                    </span>
                  )}
                </div>

                {/* CONTEXT CALLOUT */}
                {selected.context && (
                  <div className="flex items-start gap-2.5 rounded-none bg-amber-50 border border-amber-200 p-3 text-xs">
                    <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="font-semibold text-amber-950">{selected.context}</p>
                  </div>
                )}

                {/* 📱 RECTANGULAR SMARTPHONE DISPLAY MOCKUP */}
                <div className="mx-auto max-w-lg w-full overflow-hidden rounded-none border-2 border-slate-800 bg-slate-950 p-4 shadow-md text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1">
                      <span>09:41 AM</span>
                      <span className="text-[9px] text-slate-500">• {selected.channel}</span>
                    </div>
                    <div className="h-2 w-10 rounded-none bg-slate-800" />
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-none bg-red-950 border border-red-700 text-red-400 font-bold text-xs">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white leading-tight">Sender ID: HP-BANK-ALERT</p>
                        <p className="text-[9px] text-red-400 font-semibold">Unverified Unknown External Source</p>
                      </div>
                    </div>
                    <span className="rounded-none bg-red-950/80 border border-red-800/80 px-2 py-0.5 text-[9px] font-bold text-red-300">
                      Suspicious
                    </span>
                  </div>

                  <div className="my-3 rounded-none bg-slate-900 border border-slate-800 p-3.5 shadow-inner">
                    <p className="text-xs font-semibold text-slate-100 leading-relaxed font-mono">
                      &quot;{selected.message}&quot;
                    </p>
                    <p className="text-[9px] text-slate-500 text-right mt-2 font-bold">Delivered • Just Now</p>
                  </div>
                </div>

                {/* DECISION QUESTION & COMPACT OPTIONS CARDS */}
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    What is your immediate decision?
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    {selected.options.map((opt, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isChosen = chosen === idx;
                      const showFeedback = result !== null;
                      const isCorrectOpt = showFeedback && idx === result.correctOptionIndex;
                      const isWrongChosen = showFeedback && isChosen && !result.correct;

                      return (
                        <button
                          key={idx}
                          disabled={showFeedback}
                          onClick={() => setChosen(idx)}
                          className={`flex items-start gap-2.5 w-full rounded-none border p-3 text-left text-xs font-bold transition cursor-pointer ${
                            isCorrectOpt
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500"
                              : isWrongChosen
                              ? "border-red-500 bg-red-50 text-red-950 ring-1 ring-red-500"
                              : isChosen
                              ? "border-red-500 bg-red-50/90 text-red-950"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none font-black text-xs transition ${
                              isCorrectOpt
                                ? "bg-emerald-600 text-white"
                                : isWrongChosen
                                ? "bg-red-600 text-white"
                                : isChosen
                                ? "bg-red-600 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {letter}
                          </span>

                          <div className="min-w-0 flex-1 pt-0.5 leading-relaxed font-semibold">
                            {opt}
                          </div>

                          {showFeedback && isCorrectOpt && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
                          {showFeedback && isWrongChosen && <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* SUBMIT BUTTON OR FEEDBACK ANALYSIS */}
                  {!result ? (
                    <div className="pt-1">
                      <button
                        onClick={submitAnswer}
                        disabled={chosen === null || submitting}
                        className="flex items-center justify-center gap-2 w-full rounded-none bg-red-600 py-3 text-xs font-black text-white hover:bg-red-500 shadow-xs transition cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? "Checking Security Logic..." : "Submit My Security Decision"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div
                        className={`flex items-center justify-between rounded-none p-3 text-xs font-extrabold ${
                          result.correct
                            ? "bg-emerald-500 text-slate-950 shadow-xs"
                            : "bg-red-600 text-white shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {result.correct ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-slate-950" />
                              <span>Correct Decision! Spot-on fraud defense.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-white" />
                              <span>Scam Trap Warning! That decision falls into the fraud trap.</span>
                            </>
                          )}
                        </div>
                        {result.correct && (
                          <span className="rounded-none bg-slate-950 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                            +{result.xpAwarded} XP
                          </span>
                        )}
                      </div>

                      <div className="rounded-none border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                        <div>
                          <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> FinTell Security Analysis
                          </h4>
                          <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                            {result.explanation}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200">
                          <h4 className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> FinTell Safety Rule
                          </h4>
                          <p className="text-slate-700 mt-0.5 font-semibold leading-relaxed">
                            {result.safetyLesson}
                          </p>
                        </div>
                      </div>

                      {(() => {
                        const currentIndex = visibleScenarios.findIndex((s) => s.id === selected.id);
                        const next = visibleScenarios[currentIndex + 1];
                        return next ? (
                          <button
                            onClick={() => selectScenario(next.id)}
                            className="flex items-center justify-center gap-2 w-full rounded-none border border-slate-300 bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                          >
                            Proceed to Next Scam Drill <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
