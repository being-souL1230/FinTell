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
  Eye,
  Volume2,
  User,
  CreditCard,
  Send,
  Radio,
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

// Web Audio Synthesizer sound effects
function playAudioFeedback(type: "success" | "failure") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25); // Db3
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {}
}

export function ScamSimulator({ scenarios, userName = "User" }: { scenarios: Scenario[]; userName?: string }) {
  const [activeTab, setActiveTab] = useState<"DRILLS" | "CHECKER" | "VOICE" | "CERTIFICATE">("DRILLS");
  const [selectedId, setSelectedId] = useState<number | null>(scenarios[0]?.id ?? null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRedFlags, setShowRedFlags] = useState(false);

  const categories = useMemo(() => Array.from(new Set(scenarios.map((s) => s.category))), [scenarios]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const visibleScenarios = categoryFilter ? scenarios.filter((s) => s.category === categoryFilter) : scenarios;
  const selected = scenarios.find((s) => s.id === selectedId) ?? null;

  const totalSolved = scenarios.filter((s) => s.attempted).length;
  const correctCount = scenarios.filter((s) => s.solvedCorrectly).length;
  const accuracyPct = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;

  function selectScenario(id: number) {
    setSelectedId(id);
    setChosen(null);
    setResult(null);
    setShowRedFlags(false);
  }

  async function submitAnswer() {
    if (!selected || chosen === null || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/scams/${selected.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosenIndex: chosen }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        selected.attempted = true;
        if (data.correct) {
          selected.solvedCorrectly = true;
          playAudioFeedback("success");
        } else {
          playAudioFeedback("failure");
        }
      } else {
        alert(data.error || "Failed to submit security decision.");
      }
    } catch {
      alert("Network error while checking drill decision.");
    } finally {
      setSubmitting(false);
    }
  }


  function renderChannelIcon(channel: string) {
    const ch = channel.toLowerCase();
    if (ch.includes("call") || ch.includes("phone")) return <CallChannelIcon className="h-5 w-5" />;
    if (ch.includes("email") || ch.includes("mail")) return <EmailChannelIcon className="h-5 w-5" />;
    if (ch.includes("upi") || ch.includes("payment")) return <UpiChannelIcon className="h-5 w-5" />;
    return <SmsChannelIcon className="h-5 w-5" />;
  }

  // Highlight suspicious words when inspection mode is active
  function renderHighlightedMessage(msg: string) {
    if (!showRedFlags) return `"${msg}"`;

    const suspiciousKeywords = [
      "AnyDesk", "TeamViewer", "QuickSupport", "screen", "share", "install",
      "immediately", "2 hours", "expired", "blocked", "freeze", "OTP", "PIN",
      "lottery", "prize", "cashback", "refund", "verify", "link", "click", "WhatsApp",
      "police", "CBI", "FedEx", "narcotics"
    ];

    let highlighted = msg;
    suspiciousKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, "gi");
      highlighted = highlighted.replace(regex, `<mark class="bg-red-500 text-white font-extrabold px-1 rounded-none">$1</mark>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: `"${highlighted}"` }} />;
  }

  return (
    <div className="space-y-6">
      {/* MODULE SWITCHER NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("DRILLS")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer transition ${
              activeTab === "DRILLS"
                ? "bg-slate-950 text-lime-400 border-b-2 border-lime-400 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Interactive Drills ({scenarios.length})
          </button>

          <button
            onClick={() => setActiveTab("CHECKER")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer transition ${
              activeTab === "CHECKER"
                ? "bg-slate-950 text-lime-400 border-b-2 border-lime-400 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Sparkles className="h-4 w-4 text-lime-600" />
            AI Link &amp; UPI Fraud Checker
          </button>

          <button
            onClick={() => setActiveTab("VOICE")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer transition ${
              activeTab === "VOICE"
                ? "bg-slate-950 text-lime-400 border-b-2 border-lime-400 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <PhoneCall className="h-4 w-4 text-red-600 animate-pulse" />
            Emergency Call Simulator
          </button>

          <button
            onClick={() => setActiveTab("CERTIFICATE")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer transition ${
              activeTab === "CERTIFICATE"
                ? "bg-slate-950 text-lime-400 border-b-2 border-lime-400 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Award className="h-4 w-4 text-amber-500" />
            Safety Certificate
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-xs font-extrabold text-slate-800">
          <span>Safety Score:</span>
          <span className="text-lime-700 font-mono text-sm">{accuracyPct}%</span>
        </div>
      </div>

      {/* TAB CONTENT 1: CHECKER */}
      {activeTab === "CHECKER" && <FraudChecker />}

      {/* TAB CONTENT 2: VOICE SIMULATOR */}
      {activeTab === "VOICE" && <VoiceScamSimulator />}

      {/* TAB CONTENT 3: CERTIFICATE */}
      {activeTab === "CERTIFICATE" && (
        <SafetyCertificate
          userName={userName}
          safetyScore={accuracyPct}
          totalSolved={totalSolved}
          accuracyPct={accuracyPct}
        />
      )}


      {/* TAB CONTENT 4: INTERACTIVE SCAM DRILLS */}
      {activeTab === "DRILLS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: COMPACT SCENARIOS LIBRARY (4 cols) */}
          <div className="lg:col-span-4 flex flex-col border border-slate-200 bg-white p-5 shadow-xs lg:h-[760px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Scam Scenario Library</h2>
              </div>
              <span className="bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {visibleScenarios.length} Drills
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5 py-3">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`px-2.5 py-1 text-[11px] font-extrabold cursor-pointer transition ${
                  !categoryFilter ? "bg-red-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
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
                    className={`w-full flex items-center justify-between p-3 border text-left transition cursor-pointer ${
                      active
                        ? "border-red-600 bg-red-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-slate-100">
                        {renderChannelIcon(s.channel)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{s.category} • {s.difficulty}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {s.solvedCorrectly ? (
                        <span className="flex h-5 w-5 items-center justify-center bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : s.attempted ? (
                        <span className="flex h-5 w-5 items-center justify-center bg-amber-100 text-amber-700">
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

          {/* RIGHT COLUMN: HIGH-REALISM INTERACTIVE SIMULATOR FRAME (8 cols) */}
          <div className="lg:col-span-8 flex flex-col border border-slate-200 bg-white p-5 sm:p-6 shadow-xs lg:h-[760px] overflow-y-auto">
            {!selected ? (
              <div className="m-auto text-center text-slate-400 font-medium">Select a scam drill from the library to begin practice.</div>
            ) : (
              <div className="space-y-4">
                
                {/* DRILL TOP TOOLBAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-100 border border-red-300 px-2.5 py-0.5 text-[10px] font-extrabold text-red-800">
                        {selected.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Channel: {selected.channel}
                      </span>
                    </div>
                    <h2 className="text-base font-black text-slate-900 mt-1">{selected.title}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRedFlags(!showRedFlags)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold border cursor-pointer transition ${
                        showRedFlags
                          ? "bg-red-600 text-white border-red-600 shadow-xs"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showRedFlags ? "Hide Threat Flags" : "Inspect Threat Flags 🔍"}
                    </button>

                    {selected.solvedCorrectly && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Solved Correctly
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTEXT CALLOUT */}
                {selected.context && (
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 p-3 text-xs">
                    <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="font-semibold text-amber-950">{selected.context}</p>
                  </div>
                )}

                {/* 📱 HIGH-REALISM SMARTPHONE MOCKUP FRAME */}
                <div className="mx-auto max-w-md w-full overflow-hidden border-2 border-slate-900 bg-slate-950 p-4 shadow-xl text-slate-100 relative">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-white font-black">09:41 AM</span>
                      <span className="text-[9px] text-slate-500 font-bold">• Jio 5G</span>
                    </div>
                    {/* Camera Notch */}
                    <div className="h-3 w-16 bg-slate-900 rounded-full border border-slate-800" />
                    <div className="flex items-center gap-1.5">
                      <Wifi className="h-3 w-3 text-slate-300" />
                      <span className="text-[9px] font-mono text-slate-300">84%</span>
                      <Battery className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* DYNAMIC APP HEADER DEPENDING ON CHANNEL */}
                  {selected.channel.toLowerCase().includes("call") ? (
                    /* Incoming Call App Interface */
                    <div className="py-4 text-center space-y-3 bg-slate-900/90 border-b border-slate-800 p-4">
                      <div className="flex justify-center">
                        <div className="h-14 w-14 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-lg animate-pulse">
                          <PhoneCall className="h-7 w-7" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Unknown Caller: HP-BANK-ALERT</p>
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">⚠️ Suspected High-Risk Phone Scam</p>
                        <p className="text-[9px] text-slate-400">Location: New Delhi, India</p>
                      </div>
                    </div>
                  ) : selected.channel.toLowerCase().includes("upi") ? (
                    /* UPI Payment App Interface (GPay / PhonePe style) */
                    <div className="py-3 bg-slate-900 border-b border-slate-800 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-white flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-emerald-400" /> UPI Collect Request
                        </span>
                        <span className="bg-red-950 text-red-300 border border-red-700 text-[9px] font-black px-2 py-0.5">
                          PAYMENT DEMAND
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Requested by: <strong className="text-white">hp-bank-refund@okicici</strong></p>
                    </div>
                  ) : selected.channel.toLowerCase().includes("email") ? (
                    /* Email App Interface */
                    <div className="py-3 bg-slate-900 border-b border-slate-800 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>From: security-alert@unverified-bank.com</span>
                        <span className="text-[9px] text-red-400 bg-red-950 border border-red-800 px-1.5 py-0.5">Unverified Sender</span>
                      </div>
                      <p className="text-xs font-extrabold text-white">Subject: URGENT Account Suspension Notice</p>
                    </div>
                  ) : (
                    /* SMS / WhatsApp Chat Interface */
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white leading-tight">Sender: HP-BANK-ALERT</p>
                          <p className="text-[9px] text-red-400 font-semibold">Unverified External Number</p>
                        </div>
                      </div>
                      <span className="bg-red-950/80 border border-red-800 px-2 py-0.5 text-[9px] font-bold text-red-300">
                        Suspicious Threat
                      </span>
                    </div>
                  )}

                  {/* MESSAGE BODY CONTAINER */}
                  <div className="my-4 bg-slate-900 border border-slate-800 p-4 shadow-inner">
                    <p className="text-xs font-medium text-slate-100 leading-relaxed font-mono">
                      {renderHighlightedMessage(selected.message)}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-[9px] text-slate-400 font-bold border-t border-slate-800/80 pt-2">
                      <span>Security Inspection Status: {showRedFlags ? "Threat Flags Highlighted 🔍" : "Standard Preview"}</span>
                      <span>Delivered • Just Now</span>
                    </div>
                  </div>
                </div>

                {/* DECISION QUESTION & OPTIONS CARDS */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      What is your immediate decision?
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Use A, B, C buttons to respond</span>
                  </div>

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
                          className={`flex items-start gap-3 w-full border p-3.5 text-left text-xs font-bold transition cursor-pointer ${
                            isCorrectOpt
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500"
                              : isWrongChosen
                              ? "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500"
                              : isChosen
                              ? "border-red-600 bg-red-50/90 text-red-950"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center font-black text-xs transition ${
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

                          {showFeedback && isCorrectOpt && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />}
                          {showFeedback && isWrongChosen && <XCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* SUBMIT BUTTON OR FEEDBACK ANALYSIS */}
                  {!result ? (
                    <div className="pt-2">
                      <button
                        onClick={submitAnswer}
                        disabled={chosen === null || submitting}
                        className="flex items-center justify-center gap-2 w-full bg-red-600 py-3 text-xs font-black text-white hover:bg-red-500 shadow-md transition cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? "Checking Security Logic..." : "Submit My Security Decision"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div
                        className={`flex items-center justify-between p-3.5 text-xs font-extrabold ${
                          result.correct
                            ? "bg-emerald-500 text-slate-950 shadow-xs"
                            : "bg-red-600 text-white shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {result.correct ? (
                            <>
                              <CheckCircle2 className="h-4.5 w-4.5 text-slate-950" />
                              <span>Correct Decision! Spot-on fraud defense.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4.5 w-4.5 text-white" />
                              <span>Scam Trap Warning! That decision falls into the fraud trap.</span>
                            </>
                          )}
                        </div>
                        {result.correct && (
                          <span className="bg-slate-950 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                            +{result.xpAwarded} XP
                          </span>
                        )}
                      </div>

                      <div className="border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                        <div>
                          <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                            <Sparkles className="h-4 w-4 text-emerald-600" /> FinTell Security Analysis
                          </h4>
                          <p className="text-slate-600 mt-1 leading-relaxed font-medium">
                            {result.explanation}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <h4 className="font-extrabold text-emerald-800 flex items-center gap-1.5 text-xs">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" /> FinTell Golden Security Rule
                          </h4>
                          <p className="text-slate-700 mt-1 font-semibold leading-relaxed">
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
                            className="flex items-center justify-center gap-2 w-full border border-slate-300 bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
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
