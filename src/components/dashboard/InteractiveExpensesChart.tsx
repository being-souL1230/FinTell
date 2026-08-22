"use client";

import { useState } from "react";
import { inr } from "@/lib/calculators";
import { TrendingUp, TrendingDown, Sparkles, Filter } from "lucide-react";

interface DataPoint {
  label: string;
  amount: number;
  category: string;
  trendPct: number; // vs average
  x: number; // SVG X position (0 to 300)
  y: number; // SVG Y position (10 to 85)
}

const MONTHLY_DATA: DataPoint[] = [
  { label: "Apr", amount: 32400, category: "Rent & Utilities", trendPct: -15, x: 10, y: 68 },
  { label: "May", amount: 28900, category: "Groceries & Food", trendPct: -24, x: 68, y: 78 },
  { label: "Jun", amount: 39500, category: "Shopping & Tech", trendPct: +3, x: 126, y: 50 },
  { label: "Jul", amount: 42100, category: "Travel & Dining", trendPct: +9, x: 184, y: 42 },
  { label: "Aug", amount: 36800, category: "Medical & Health", trendPct: -4, x: 242, y: 56 },
  { label: "Sep", amount: 50700, category: "Festival Outlay", trendPct: +32, x: 290, y: 18 },
];

const QUARTERLY_DATA: DataPoint[] = [
  { label: "Q1 '25", amount: 98200, category: "Quarterly Fixed", trendPct: -8, x: 20, y: 70 },
  { label: "Q2 '25", amount: 110500, category: "Quarterly Variable", trendPct: +4, x: 105, y: 55 },
  { label: "Q3 '25", amount: 129600, category: "Festive Outlay", trendPct: +22, x: 195, y: 32 },
  { label: "Q4 '25 (Est)", amount: 105000, category: "Year-End Plan", trendPct: -2, x: 280, y: 60 },
];

const YEARLY_DATA: DataPoint[] = [
  { label: "2023", amount: 384000, category: "Annual Baseline", trendPct: -12, x: 30, y: 75 },
  { label: "2024", amount: 426000, category: "Annual Growth", trendPct: +5, x: 150, y: 50 },
  { label: "2025 (YTD)", amount: 460800, category: "Current Run Rate", trendPct: +14, x: 270, y: 25 },
];

export function InteractiveExpensesChart() {
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(5); // default last item

  const currentDataset =
    period === "monthly" ? MONTHLY_DATA : period === "quarterly" ? QUARTERLY_DATA : YEARLY_DATA;

  const activePoint = hoveredIdx !== null && currentDataset[hoveredIdx] ? currentDataset[hoveredIdx] : currentDataset[currentDataset.length - 1];

  const avgAmount = Math.round(
    currentDataset.reduce((sum, d) => sum + d.amount, 0) / currentDataset.length
  );

  // Dynamic SVG smooth path generator
  const pathD = currentDataset.reduce((acc, point, idx) => {
    return idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  // Dynamic SVG Area fill path generator
  const areaD = `${pathD} L ${currentDataset[currentDataset.length - 1].x} 95 L ${currentDataset[0].x} 95 Z`;

  return (
    <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      {/* Header & Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>Expenses Trend</span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 inline" />
          </h2>
          <p className="text-xs text-slate-500">Interactive spending analytics</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center rounded-none bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-extrabold">
          <button
            onClick={() => {
              setPeriod("monthly");
              setHoveredIdx(5);
            }}
            className={`px-2.5 py-1 transition cursor-pointer ${
              period === "monthly"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => {
              setPeriod("quarterly");
              setHoveredIdx(2);
            }}
            className={`px-2.5 py-1 transition cursor-pointer ${
              period === "quarterly"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => {
              setPeriod("yearly");
              setHoveredIdx(2);
            }}
            className={`px-2.5 py-1 transition cursor-pointer ${
              period === "yearly"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Interactive Tooltip Card Header */}
      <div className="rounded-none border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between text-xs transition-all duration-300">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-emerald-950">{activePoint.label} Outlay:</span>
            <span className="font-black text-emerald-900 text-sm">{inr(activePoint.amount)}</span>
          </div>
          <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
            Top Category: <strong>{activePoint.category}</strong>
          </p>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-0.5 rounded-none px-2 py-0.5 text-[10px] font-black ${
              activePoint.trendPct > 0
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
            }`}
          >
            {activePoint.trendPct > 0 ? (
              <>
                <TrendingUp className="h-3 w-3 inline" /> +{activePoint.trendPct}% vs avg
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 inline" /> {activePoint.trendPct}% vs avg
              </>
            )}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hover points to inspect</p>
        </div>
      </div>

      {/* Interactive SVG Chart Container with Full-Area Smooth Mouse Tracking */}
      <div
        className="relative h-44 w-full pt-2 cursor-crosshair select-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const pct = mouseX / rect.width;

          let closestIdx = 0;
          let minDiff = 1;

          currentDataset.forEach((point, idx) => {
            const pointPct = point.x / 300;
            const diff = Math.abs(pointPct - pct);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          setHoveredIdx(closestIdx);
        }}
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
        </div>

        {/* SVG Curve & Points */}
        <svg className="h-full w-full overflow-visible pointer-events-none" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="expensesChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#expensesChartGrad)" className="transition-all duration-300 ease-out" />

          {/* Line Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-out"
          />

          {/* Hover Snapping Guide Line */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1="5"
              x2={activePoint.x}
              y2="95"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="transition-all duration-200 ease-out opacity-70"
            />
          )}

          {/* Data Points */}
          {currentDataset.map((point, idx) => {
            const isSelected = hoveredIdx === idx;
            return (
              <g key={point.label}>
                {/* Subtle Subtle Soft Glow on Active Point */}
                {isSelected && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill="#10b981"
                    fillOpacity="0.2"
                    className="transition-all duration-300 ease-out"
                  />
                )}
                {/* Active Inner Point Circle */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? "5.5" : "4"}
                  fill={isSelected ? "#047857" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "2" : "1.5"}
                  className="transition-all duration-300 ease-out"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100">
          {currentDataset.map((point, idx) => (
            <span
              key={point.label}
              className={`transition-colors duration-200 ${
                hoveredIdx === idx ? "text-emerald-700 font-extrabold" : "text-slate-400"
              }`}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>

      {/* Average Summary Footer */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-none border border-slate-100">
        <span>Average Outlay</span>
        <span className="text-slate-900 font-extrabold">{inr(avgAmount)} / period</span>
      </div>
    </div>
  );
}
