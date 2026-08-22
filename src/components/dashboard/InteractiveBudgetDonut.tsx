"use client";

import { useState } from "react";
import Link from "next/link";
import { inr } from "@/lib/calculators";
import { PieChart as PieIcon, Sparkles, CheckCircle2, Info } from "lucide-react";

interface BudgetSegment {
  key: "needs" | "wants" | "savings";
  label: string;
  amount: number;
  pct: number;
  color: string;
  bgColor: string;
  borderColor: string;
  dashArray: string;
  dashOffset: string;
  description: string;
}

const ACTUAL_SEGMENTS: BudgetSegment[] = [
  {
    key: "needs",
    label: "Needs",
    amount: 28500,
    pct: 54,
    color: "#10b981",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dashArray: "238",
    dashOffset: "0",
    description: "Rent, bills, food & essentials",
  },
  {
    key: "wants",
    label: "Wants",
    amount: 15800,
    pct: 30,
    color: "#3b82f6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dashArray: "238",
    dashOffset: "110",
    description: "Dining out, hobbies & shopping",
  },
  {
    key: "savings",
    label: "Savings",
    amount: 8500,
    pct: 16,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dashArray: "238",
    dashOffset: "182",
    description: "FD, Mutual funds & emergency pool",
  },
];

const IDEAL_SEGMENTS: BudgetSegment[] = [
  {
    key: "needs",
    label: "Needs (50%)",
    amount: 37500,
    pct: 50,
    color: "#10b981",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dashArray: "238",
    dashOffset: "0",
    description: "50% ideal target for essentials",
  },
  {
    key: "wants",
    label: "Wants (30%)",
    amount: 22500,
    pct: 30,
    color: "#3b82f6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dashArray: "238",
    dashOffset: "119",
    description: "30% ideal target for lifestyle",
  },
  {
    key: "savings",
    label: "Savings (20%)",
    amount: 15000,
    pct: 20,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dashArray: "238",
    dashOffset: "190",
    description: "20% ideal target for future wealth",
  },
];

export function InteractiveBudgetDonut() {
  const [budgetMode, setBudgetMode] = useState<"actual" | "ideal">("actual");
  const [activeSegmentKey, setActiveSegmentKey] = useState<"needs" | "wants" | "savings" | null>(null);

  const segments = budgetMode === "actual" ? ACTUAL_SEGMENTS : IDEAL_SEGMENTS;
  const activeSegment = segments.find((s) => s.key === activeSegmentKey) ?? segments[0];

  const totalIncome = 75000;
  const totalOutlay = segments.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>Budget Overview</span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 inline" />
          </h2>
          <p className="text-xs text-slate-500">Needs vs Wants vs Savings</p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center rounded-none bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-extrabold">
          <button
            onClick={() => {
              setBudgetMode("actual");
              setActiveSegmentKey("needs");
            }}
            className={`px-2.5 py-1 transition cursor-pointer ${
              budgetMode === "actual"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Actual
          </button>
          <button
            onClick={() => {
              setBudgetMode("ideal");
              setActiveSegmentKey("needs");
            }}
            className={`px-2.5 py-1 transition cursor-pointer ${
              budgetMode === "ideal"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            50/30/20 Rule
          </button>
        </div>
      </div>

      {/* Outlay Total Badge */}
      <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
        <span className="font-extrabold text-slate-700">Total Outlay vs Income</span>
        <span className="font-black text-emerald-700">
          {inr(totalOutlay)} <span className="text-slate-400 font-normal">/ {inr(totalIncome)}</span>
        </span>
      </div>

      {/* Donut Visual & Legend Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Interactive SVG Donut */}
        <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
            {segments.map((seg) => {
              const isSelected = activeSegment.key === seg.key;
              return (
                <circle
                  key={seg.key}
                  cx="50"
                  cy="50"
                  r="38"
                  stroke={seg.color}
                  strokeWidth={isSelected ? "14" : "11"}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  fill="none"
                  className="cursor-pointer transition-all duration-300 ease-out hover:opacity-90"
                  onMouseEnter={() => setActiveSegmentKey(seg.key)}
                />
              );
            })}
          </svg>

          {/* Dynamic Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-1">
            <span className="text-xs font-black text-slate-900 leading-none">{activeSegment.pct}%</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 truncate max-w-[60px]">
              {activeSegment.label.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Interactive Legend Items */}
        <div className="space-y-2 min-w-0 flex-1 w-full text-xs">
          {segments.map((seg) => {
            const isSelected = activeSegment.key === seg.key;
            return (
              <div
                key={seg.key}
                onMouseEnter={() => setActiveSegmentKey(seg.key)}
                className={`flex items-center justify-between p-2 rounded-none border transition-all cursor-pointer ${
                  isSelected
                    ? `${seg.bgColor} ${seg.borderColor} shadow-2xs`
                    : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div>
                    <p className="font-extrabold text-slate-900 leading-none">{seg.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{seg.description}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900 shrink-0 ml-2">{inr(seg.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Footer Navigation */}
      <div className="border-t border-slate-100 pt-3">
        <Link
          href="/dashboard/money"
          className="flex items-center justify-center gap-1.5 w-full rounded-none border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900 transition"
        >
          View Budget Plan &rarr;
        </Link>
      </div>
    </div>
  );
}
