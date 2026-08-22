"use client";

import { useState } from "react";
import { Target, Plus, Trash2, Sparkles, CheckCircle2, Trophy, Bike, Home, GraduationCap, Plane, ShieldCheck } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  category: "VEHICLE" | "EMERGENCY" | "HOME" | "EDUCATION" | "TRAVEL";
  targetAmount: number;
  currentSavings: number;
  monthlyDeposit: number;
}

const INITIAL_GOALS: Goal[] = [
  { id: "g-1", name: "Emergency Safety Cushion", category: "EMERGENCY", targetAmount: 50000, currentSavings: 28000, monthlyDeposit: 3500 },
  { id: "g-2", name: "New Electric Scooter", category: "VEHICLE", targetAmount: 90000, currentSavings: 35000, monthlyDeposit: 5000 },
  { id: "g-3", name: "Home Furniture Upgrade", category: "HOME", targetAmount: 30000, currentSavings: 12000, monthlyDeposit: 2000 },
];

export function CustomGoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("EMERGENCY");
  const [targetAmount, setTargetAmount] = useState(40000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(3000);

  const addGoal = () => {
    if (!name.trim()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        name: name.trim(),
        category,
        targetAmount: Number(targetAmount),
        currentSavings: Number(currentSavings),
        monthlyDeposit: Number(monthlyDeposit),
      },
    ]);
    setName("");
    setShowAddForm(false);
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const getCategoryIcon = (cat: Goal["category"]) => {
    switch (cat) {
      case "VEHICLE": return <Bike className="h-5 w-5 text-purple-600" />;
      case "EMERGENCY": return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
      case "HOME": return <Home className="h-5 w-5 text-blue-600" />;
      case "EDUCATION": return <GraduationCap className="h-5 w-5 text-amber-600" />;
      case "TRAVEL": return <Plane className="h-5 w-5 text-teal-600" />;
      default: return <Target className="h-5 w-5 text-slate-600" />;
    }
  };

  const totalTargetSum = goals.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const totalSavingsSum = goals.reduce((acc, curr) => acc + curr.currentSavings, 0);
  const overallProgressPct = totalTargetSum > 0 ? Math.round((totalSavingsSum / totalTargetSum) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Custom Savings Goal Tracker</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500">
            Set custom financial targets for bike, emergency fund, education or home upgrades with visual progress tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-2 rounded-none bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> {showAddForm ? "Close Goal Form" : "Create New Goal"}
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Goal Value</p>
          <p className="text-xl font-black text-slate-900 mt-1">₹{totalTargetSum.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Saved Balance</p>
          <p className="text-xl font-black text-emerald-600 mt-1">₹{totalSavingsSum.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Overall Progress</p>
          <p className="text-xl font-black text-purple-600 mt-1">{overallProgressPct}% Completed</p>
        </div>
      </div>

      {/* ADD GOAL FORM */}
      {showAddForm && (
        <div className="rounded-none border border-slate-900 bg-slate-900 p-6 text-white shadow-xl space-y-4 animate-fade-in">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Create New Savings Target</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Buy Electric Scooter, Kids Education"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-none border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Goal["category"])}
                className="w-full rounded-none border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
              >
                <option value="EMERGENCY">Emergency Fund</option>
                <option value="VEHICLE">Vehicle / Bike</option>
                <option value="HOME">Home &amp; Furniture</option>
                <option value="EDUCATION">Education</option>
                <option value="TRAVEL">Travel / Vacation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full rounded-none border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Current Saved (₹)</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full rounded-none border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 text-xs">Planned Monthly Deposit (₹)</label>
            <input
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full sm:w-1/2 rounded-none border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <button
            onClick={addGoal}
            className="inline-flex items-center justify-center gap-1.5 rounded-none bg-emerald-500 px-6 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer transition shadow-xs"
          >
            <Plus className="h-4 w-4" /> Save New Target Goal
          </button>
        </div>
      )}

      {/* GOALS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentSavings / g.targetAmount) * 100));
          const remaining = Math.max(0, g.targetAmount - g.currentSavings);
          const monthsLeft = g.monthlyDeposit > 0 ? Math.ceil(remaining / g.monthlyDeposit) : 0;

          return (
            <div key={g.id} className="rounded-none border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-slate-100">
                    {getCategoryIcon(g.category)}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">{g.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{g.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeGoal(g.id)}
                  className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-emerald-700">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-none bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-none border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Saved</p>
                  <p className="font-black text-emerald-700">₹{g.currentSavings.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Target</p>
                  <p className="font-black text-slate-900">₹{g.targetAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Monthly: <strong>₹{g.monthlyDeposit.toLocaleString("en-IN")}</strong></span>
                <span>ETA: <strong>{monthsLeft} Months</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
