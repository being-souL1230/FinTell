"use client";

import { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Copy, Sparkles, RefreshCw, ExternalLink, Info } from "lucide-react";

interface AnalysisResult {
  query: string;
  type: "UPI_ID" | "LINK" | "MESSAGE" | "UNKNOWN";
  riskScore: number; // 0 (Safe) to 100 (Severe Fraud)
  riskLevel: "CRITICAL_FRAUD" | "SUSPICIOUS" | "LIKELY_SAFE";
  redFlags: string[];
  safePoints: string[];
  recommendation: string;
}

const PRESET_EXAMPLES = [
  { label: "Fake Electricity Bill SMS", text: "Dear Consumer, your electricity line will be disconnected tonight by 9:30 PM due to unpaid bill. Immediately contact Electricity Officer on 9876543210." },
  { label: "Suspicious UPI VPA", text: "rewards-claim-win8891@upi" },
  { label: "Fake Telegram Job Link", text: "http://parttime-youtube-like-earn5000.top/register?ref=789" },
  { label: "Genuine Bank UPI", text: "merchant123@icici" },
];

export function FraudChecker() {
  const [inputQuery, setInputQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeText = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/scams/checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToAnalyze.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SEARCH CARD */}
      <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Suspicious Link, Message &amp; UPI VPA AI Scanner</span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </h2>
            <p className="text-xs text-slate-500">
              Paste any suspicious SMS, Telegram job link, or UPI ID to detect fraud before clicking or paying.
            </p>
          </div>
          <span className="rounded-none bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-black text-emerald-800 uppercase">
            AI Fraud Engine Active
          </span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Paste suspicious text here... (e.g. 'Dear user, your electricity line will be cut tonight', or 'reward-claim@upi')"
              className="w-full rounded-none border border-slate-300 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="font-bold text-slate-400 text-[11px]">Try Preset Examples:</span>
              {PRESET_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(ex.text);
                    analyzeText(ex.text);
                  }}
                  className="rounded-none border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => analyzeText(inputQuery)}
              disabled={analyzing || !inputQuery.trim()}
              className="inline-flex items-center gap-2 rounded-none bg-emerald-600 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-200" /> Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Run Instant AI Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULT CARD */}
      {result && (
        <div className="rounded-none border border-slate-200 bg-white p-6 shadow-md space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Analysis Output</span>
                <span className="rounded-none bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700">
                  Type: {result.type}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 break-all">
                &ldquo;{result.query}&rdquo;
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Fraud Risk Score</p>
                <p
                  className={`text-2xl font-black ${
                    result.riskScore > 60 ? "text-red-600" : result.riskScore > 30 ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {result.riskScore} / 100
                </p>
              </div>

              <span
                className={`rounded-none border px-3 py-1.5 text-xs font-black uppercase ${
                  result.riskLevel === "CRITICAL_FRAUD"
                    ? "bg-red-100 border-red-300 text-red-900"
                    : result.riskLevel === "SUSPICIOUS"
                    ? "bg-amber-100 border-amber-300 text-amber-900"
                    : "bg-emerald-100 border-emerald-300 text-emerald-900"
                }`}
              >
                {result.riskLevel.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RED FLAGS */}
            <div className="rounded-none border border-red-200 bg-red-50/50 p-4 space-y-2">
              <h4 className="text-xs font-extrabold text-red-950 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Red Flags &amp; Threats Detected
              </h4>
              {result.redFlags.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-red-900/90 list-disc list-inside">
                  {result.redFlags.map((rf, i) => (
                    <li key={i}>{rf}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No critical red flags detected.</p>
              )}
            </div>

            {/* SAFE POINTS / GUIDANCE */}
            <div className="rounded-none border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
              <h4 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verification &amp; Safety Checks
              </h4>
              {result.safePoints.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-emerald-900/90 list-disc list-inside">
                  {result.safePoints.map((sp, i) => (
                    <li key={i}>{sp}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">High caution advised.</p>
              )}
            </div>
          </div>

          {/* AI ACTION RECOMMENDATION BANNER */}
          <div className="rounded-none border border-slate-900 bg-slate-900 p-4 text-white space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">AI Recommended Action</span>
            <p className="text-xs font-medium text-slate-100">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
