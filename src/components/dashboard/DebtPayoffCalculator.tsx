"use client";

import { useState } from "react";
import { CreditCard, Sparkles, Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown, Info } from "lucide-react";

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number; // Annual %
  minimumPayment: number; // Monthly ₹
}

const INITIAL_DEBTS: Debt[] = [
  { id: "d-1", name: "Credit Card Debt", balance: 35000, interestRate: 36, minimumPayment: 3000 },
  { id: "d-2", name: "Personal Loan", balance: 85000, interestRate: 14, minimumPayment: 4500 },
  { id: "d-3", name: "Bike EMI", balance: 25000, interestRate: 11, minimumPayment: 2200 },
];

export function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [strategy, setStrategy] = useState<"SNOWBALL" | "AVALANCHE">("SNOWBALL");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(2000);

  // Form states for adding new debt
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState(20000);
  const [newRate, setNewRate] = useState(12);
  const [newMinPay, setNewMinPay] = useState(1500);

  const addDebt = () => {
    if (!newName.trim()) return;
    setDebts((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: newName.trim(),
        balance: Number(newBalance),
        interestRate: Number(newRate),
        minimumPayment: Number(newMinPay),
      },
    ]);
    setNewName("");
  };

  const removeDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  // Sort debts based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === "SNOWBALL") {
      return a.balance - b.balance; // Smallest balance first
    } else {
      return b.interestRate - a.interestRate; // Highest interest first
    }
  });

  const totalDebtBalance = debts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalMinPayment = debts.reduce((acc, curr) => acc + curr.minimumPayment, 0);

  // Quick estimation logic
  const estMonths = totalDebtBalance > 0 ? Math.ceil(totalDebtBalance / (totalMinPayment + extraMonthlyPayment)) : 0;
  const estSavedInterest = strategy === "AVALANCHE" ? Math.round(totalDebtBalance * 0.12) : Math.round(totalDebtBalance * 0.08);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Debt Payoff &amp; Loan Acceleration Engine</span>
            <TrendingDown className="h-4 w-4 text-emerald-600" />
          </h2>
          <p className="text-xs text-slate-500">
            Compare Debt Snowball vs Debt Avalanche strategies to clear your EMIs and loans faster.
          </p>
        </div>

        {/* STRATEGY SWITCHER TOGGLE */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-none border border-slate-200">
          <button
            onClick={() => setStrategy("SNOWBALL")}
            className={`rounded-none px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              strategy === "SNOWBALL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Debt Snowball (Fast Wins)
          </button>
          <button
            onClick={() => setStrategy("AVALANCHE")}
            className={`rounded-none px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              strategy === "AVALANCHE" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Debt Avalanche (Save Interest)
          </button>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Outstanding Debt</p>
          <p className="text-xl font-black text-red-600 mt-1">₹{totalDebtBalance.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Minimum EMI</p>
          <p className="text-xl font-black text-slate-900 mt-1">₹{totalMinPayment.toLocaleString("en-IN")}/mo</p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Estimated Debt-Free ETA</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{estMonths} Months</p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Est. Interest Saved</p>
          <p className="text-xl font-black text-purple-600 mt-1">₹{estSavedInterest.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* STRATEGY EXPLANATION BOX */}
      <div className="rounded-none border border-emerald-200 bg-emerald-50/70 p-4 text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-950 font-extrabold">
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <span>
            {strategy === "SNOWBALL" ? "Debt Snowball Strategy (Smallest Balance First)" : "Debt Avalanche Strategy (Highest Interest First)"}
          </span>
        </div>
        <p className="text-emerald-900/80 leading-relaxed font-medium">
          {strategy === "SNOWBALL"
            ? "Pay minimum EMIs on all loans, then put all extra money toward your smallest debt (Bike EMI). Eliminating a balance quickly gives psychological momentum!"
            : "Pay minimum EMIs on all loans, then put all extra money toward your highest interest loan (Credit Card - 36% Interest). This saves the maximum interest money!"}
        </p>
      </div>

      {/* GRID: DEBT LIST & TARGET ACCELERATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: SORTED DEBTS LIST */}
        <div className="lg:col-span-7 rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Payoff Priority Order ({strategy})</span>
            <span className="text-xs text-slate-400 font-normal">{sortedDebts.length} Debts Added</span>
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-none overflow-hidden">
            {sortedDebts.map((d, idx) => (
              <div key={d.id} className="p-4 space-y-2 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-extrabold text-slate-900">{d.name}</p>
                    {idx === 0 && (
                      <span className="rounded-none bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase">
                        Target First
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeDebt(d.id)}
                    className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-none border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p>
                    <p className="font-extrabold text-slate-900">₹{d.balance.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Interest Rate</p>
                    <p className="font-extrabold text-red-600">{d.interestRate}% / yr</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Min Payment</p>
                    <p className="font-extrabold text-slate-900">₹{d.minimumPayment.toLocaleString("en-IN")}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT 5 COLS: ADD DEBT & ACCELERATOR FORM */}
        <div className="lg:col-span-5 rounded-none border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Add New Loan / EMI Entry</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Loan / Card Name</label>
              <input
                type="text"
                placeholder="e.g. Credit Card Bill, Bike EMI"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-none border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Balance (₹)</label>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  className="w-full rounded-none border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full rounded-none border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum Monthly EMI (₹)</label>
              <input
                type="number"
                value={newMinPay}
                onChange={(e) => setNewMinPay(Number(e.target.value))}
                className="w-full rounded-none border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
              />
            </div>

            <button
              onClick={addDebt}
              className="flex items-center justify-center gap-1.5 w-full rounded-none bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" /> Add Debt to Payoff Plan
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <label className="block font-bold text-slate-900">Extra Monthly Acceleration (₹)</label>
            <input
              type="number"
              value={extraMonthlyPayment}
              onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
              className="w-full rounded-none border border-emerald-300 bg-emerald-50 p-2 text-xs font-black text-emerald-950 outline-none"
            />
            <p className="text-[10px] text-slate-500">
              Putting extra ₹{extraMonthlyPayment.toLocaleString("en-IN")}/month reduces your payoff time by approx <strong>6 months</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
