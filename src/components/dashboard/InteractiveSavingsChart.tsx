"use client";

import { useState } from "react";
import { inr } from "@/lib/calculators";
import { PiggyBank } from "lucide-react";

interface ProjectionPoint {
  month: number;
  deposit: number;
  interest: number;
  balance: number;
  cumulativeDeposit: number;
}

export function InteractiveSavingsChart({
  projection,
  healthyRate,
  totalInterestEarned,
}: {
  projection: ProjectionPoint[];
  healthyRate: boolean;
  totalInterestEarned: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(projection.length - 1);

  if (!projection || projection.length === 0) return null;

  const activePoint =
    hoveredIdx !== null && projection[hoveredIdx]
      ? projection[hoveredIdx]
      : projection[projection.length - 1];

  const maxBalance = Math.max(...projection.map((p) => p.balance), 1);

  // Scaled SVG coordinates
  const points = projection.map((p, idx) => {
    const x = 10 + (idx / Math.max(1, projection.length - 1)) * 280;
    const y = 80 - (p.balance / maxBalance) * 65;
    return { ...p, x, y };
  });

  const activeCoords = points[hoveredIdx ?? points.length - 1] ?? points[points.length - 1];

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} 88 L ${points[0].x} 88 Z`;

  const lastPoint = projection[projection.length - 1];

  return (
    <div className="rounded-none border border-slate-200 bg-white p-5 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <PiggyBank className="h-4 w-4 text-emerald-600" />
          <span>Balance Build-up</span>
        </div>
        <span
          className={`rounded-none px-2.5 py-0.5 text-[11px] font-black ${
            healthyRate
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          {healthyRate ? "Healthy Savings Rate" : "Try to Reach 20%"}
        </span>
      </div>

      {/* Interactive Tooltip Card Header */}
      <div className="rounded-none border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between text-xs transition-all duration-200">
        <div>
          <span className="font-extrabold text-emerald-950">Month {activePoint.month} Balance: </span>
          <span className="font-black text-emerald-900 text-sm">{inr(activePoint.balance)}</span>
        </div>
        <div className="text-right text-[10px] text-slate-600 font-semibold">
          <span>Deposited: <strong>{inr(activePoint.cumulativeDeposit)}</strong></span>
          <span className="ml-2.5 text-emerald-700">Interest: <strong>+{inr(activePoint.interest)}</strong></span>
        </div>
      </div>

      {/* Smooth Interactive SVG Chart Area */}
      <div
        className="relative h-32 w-full pt-1 cursor-crosshair select-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const pct = mouseX / rect.width;
          const closestIdx = Math.min(
            points.length - 1,
            Math.max(0, Math.round(pct * (points.length - 1)))
          );
          setHoveredIdx(closestIdx);
        }}
      >
        {/* Background Dashed Lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
        </div>

        <svg className="h-full w-full overflow-visible pointer-events-none" viewBox="0 0 300 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="savingsChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#savingsChartGrad)" className="transition-all duration-300 ease-out" />

          {/* Line Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-out"
          />

          {/* Hover Snapping Guide Line */}
          {activeCoords && (
            <line
              x1={activeCoords.x}
              y1="5"
              x2={activeCoords.x}
              y2="88"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="transition-all duration-200 ease-out opacity-70"
            />
          )}

          {/* Point Dots */}
          {points.map((pt, idx) => {
            const isSelected = hoveredIdx === idx;
            return (
              <g key={pt.month}>
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="7"
                    fill="#10b981"
                    fillOpacity="0.2"
                    className="transition-all duration-300 ease-out"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? "5" : "3"}
                  fill={isSelected ? "#047857" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-all duration-300 ease-out"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Range */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100">
          <span>Month 1</span>
          <span>Month {Math.max(1, Math.round(projection.length / 2))}</span>
          <span>Month {projection.length}</span>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="rounded-none bg-slate-50 border border-slate-100 p-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Deposited</p>
          <p className="text-xs font-black text-slate-900">{inr(lastPoint?.cumulativeDeposit ?? 0)}</p>
        </div>
        <div className="rounded-none bg-emerald-50/50 border border-emerald-100 p-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Interest Earned</p>
          <p className="text-xs font-black text-emerald-800">+{inr(totalInterestEarned)}</p>
        </div>
        <div className="rounded-none bg-slate-900 text-white p-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Final Balance</p>
          <p className="text-xs font-black text-white">{inr(lastPoint?.balance ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}
