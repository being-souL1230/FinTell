"use client";

import { useMemo, useState } from "react";
import {
  Alert, Button, Card, CardLabel, Collapse, DataTable, Field, Input, Pill,
  SectionHeader, Slider, SplitBar, StatStrip,
} from "@/components/ui";
import {
  calculateEmi, calculateFd, calculateRd, calculateSavingsGoal, compareOptions,
  inr, inr2,
} from "@/lib/calculators";
import {
  PiggyBank, Landmark, Calculator, GitCompareArrows, Save, Lightbulb,
  TrendingUp, ShieldAlert, Info, CircleDollarSign, Clock,
} from "lucide-react";
import { InteractiveSavingsChart } from "@/components/dashboard/InteractiveSavingsChart";

type Tab = "compare" | "savings" | "deposit" | "emi";

const TABS: { id: Tab; label: string; Icon: typeof Calculator }[] = [
  { id: "compare", label: "Compare Options", Icon: GitCompareArrows },
  { id: "savings", label: "Savings Goal", Icon: PiggyBank },
  { id: "deposit", label: "FD / RD", Icon: Landmark },
  { id: "emi", label: "Loan / EMI", Icon: Calculator },
];

export default function SimulatorPage() {
  const [tab, setTab] = useState<Tab>("compare");

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Financial Decision Simulator"
        subtitle="Move the sliders. Every number updates instantly. Nothing here touches real money."
      />

      <div className="flex gap-1 overflow-x-auto rounded-none bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-none px-3 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
              tab === t.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <t.Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "compare" && <CompareTool />}
      {tab === "savings" && <SavingsTool />}
      {tab === "deposit" && <DepositTool />}
      {tab === "emi" && <EmiTool />}
    </div>
  );
}

/* ================================================================== */
/* Shared shell: inputs left, live results right                       */
/* ================================================================== */

function ToolShell({
  controls,
  children,
  onSave,
  saving,
}: {
  controls: React.ReactNode;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[300px_1fr] lg:items-start">
      <Card className="space-y-3.5">
        <CardLabel icon={<CircleDollarSign className="h-3 w-3" />}>Inputs</CardLabel>
        {controls}
        {onSave && (
          <Button className="w-full" size="sm" onClick={onSave} disabled={saving}>
            <Save className="h-3 w-3" />
            {saving ? "Saving..." : "Save run (+15 XP)"}
          </Button>
        )}
      </Card>
      <div className="min-w-0 space-y-3">{children}</div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="flex items-start gap-1.5 rounded-none bg-slate-50 px-2.5 py-1.5 text-[10px] leading-relaxed text-slate-400">
      <Info className="mt-px h-3 w-3 shrink-0" />
      Illustrative only, for education. Rates are assumptions you control. Actual returns, charges and tax vary by bank
      and product. This is not financial advice.
    </div>
  );
}

function Insight({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "good" | "warn" }) {
  const c = {
    default: "border-slate-100 bg-white",
    good: "border-emerald-100 bg-emerald-50/40",
    warn: "border-amber-100 bg-amber-50/40",
  }[tone];
  return (
    <div className={`flex gap-2 rounded-none border px-2.5 py-2 text-[11px] leading-relaxed text-slate-600 ${c}`}>
      <Lightbulb className="mt-px h-3 w-3 shrink-0 text-slate-400" />
      {children}
    </div>
  );
}

/* ================================================================== */
/* 1. COMPARE OPTIONS                                                  */
/* ================================================================== */

function CompareTool() {
  const [amount, setAmount] = useState(20000);
  const [years, setYears] = useState(1);
  const [monthly, setMonthly] = useState(1000);
  const [savingsRate, setSavingsRate] = useState(3.5);
  const [fdRate, setFdRate] = useState(6.5);
  const [inflation, setInflation] = useState(6);
  const [saving, setSaving] = useState(false);

  const result = useMemo(
    () =>
      compareOptions({
        amount, years, monthlyContribution: monthly,
        savingsRatePercent: savingsRate, fdRatePercent: fdRate, rdRatePercent: fdRate,
        inflationPercent: inflation,
      }),
    [amount, years, monthly, savingsRate, fdRate, inflation],
  );

  const maxMaturity = Math.max(...result.options.map((o) => o.maturity)) || 1;
  const invested = result.options[0].invested;
  const best = result.bestInterest;

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/simulator/fd", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "fd", principal: amount, annualRatePercent: fdRate, years }),
      });
    } finally { setSaving(false); }
  }

  return (
    <ToolShell
      saving={saving}
      onSave={save}
      controls={
        <>
          <Slider label="Lump sum available" value={amount} onChange={setAmount} min={1000} max={500000} step={1000} format={inr} marks={["10k", "5L"]} />
          <Slider label="Monthly contribution" value={monthly} onChange={setMonthly} min={0} max={50000} step={500} format={inr} marks={["0", "50k"]} />
          <Slider label="Time horizon" value={years} onChange={setYears} min={0.5} max={10} step={0.5} format={(v) => `${v} yr`} marks={["6mo", "10yr"]} />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Field label="Savings"><Input type="number" step="0.1" value={savingsRate} onChange={(e) => setSavingsRate(Number(e.target.value))} /></Field>
            <Field label="FD / RD"><Input type="number" step="0.1" value={fdRate} onChange={(e) => setFdRate(Number(e.target.value))} /></Field>
            <Field label="Inflation"><Input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} /></Field>
          </div>
        </>
      }
    >
      <StatStrip
        items={[
          { label: "You put in", value: inr(invested) },
          { label: "Best outcome", value: best ? inr(best.maturity) : "N/A", tone: "good" },
          { label: "Extra earned", value: best ? inr(best.interest) : "0", tone: "good", hint: "vs putting in" },
          { label: "Inflation loss", value: `-${inr(result.lostToInflation)}`, tone: "bad", hint: "if kept as cash" },
        ]}
      />

      <Card pad={false}>
        <div className="px-4 pt-3.5 pb-1"><CardLabel icon={<GitCompareArrows className="h-3 w-3" />}>All four options, side by side</CardLabel></div>
        <div className="divide-y divide-slate-100">
          {result.options.map((o) => {
            const isBest = best?.key === o.key;
            return (
              <div key={o.key} className={`px-4 py-2.5 ${isBest ? "bg-emerald-50/40" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      {o.label}
                      {isBest && <Pill tone="success">Most growth</Pill>}
                      <Pill tone={o.liquidity === "High" ? "info" : o.liquidity === "Medium" ? "warning" : "danger"}>
                        {o.liquidity} liquidity
                      </Pill>
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{o.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-slate-900">{inr(o.maturity)}</p>
                    <p className="text-[10px] tabular-nums text-emerald-600">+{inr(o.interest)} interest</p>
                  </div>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isBest ? "bg-emerald-500" : "bg-slate-300"}`}
                    style={{ width: `${(o.maturity / maxMaturity) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardLabel icon={<Clock className="h-3 w-3" />}>Real value after inflation</CardLabel>
          <p className="mt-2 text-[11px] text-slate-400">
            At {result.inflationPercent}% inflation, {inr(invested)} today buys less in {years} year(s). These are
            inflation-adjusted equivalents.
          </p>
          <div className="mt-2.5 space-y-1.5">
            {result.inflationAdjusted.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{a.label}</span>
                <span className="font-semibold tabular-nums text-slate-800">{inr(a.realValue)}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-2">
          <Insight tone="good">
            <span>
              <strong>Money you may need soon</strong> belongs in a savings account. The lower interest is the price of
              instant access.
            </span>
          </Insight>
          <Insight tone="warn">
            <span>
              <strong>Money you will not touch</strong> earns more in an FD, but early withdrawal usually costs part of
              the interest plus a penalty.
            </span>
          </Insight>
          <Insight>
            <span>
              Cash under the mattress loses about <strong>{inr(result.lostToInflation)}</strong> of purchasing power over
              this period and has no record if lost.
            </span>
          </Insight>
        </div>
      </div>

      <Disclaimer />
    </ToolShell>
  );
}

/* ================================================================== */
/* 2. SAVINGS GOAL                                                     */
/* ================================================================== */

function SavingsTool() {
  const [income, setIncome] = useState(15000);
  const [expenses, setExpenses] = useState(11000);
  const [target, setTarget] = useState(20000);
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);

  const r = useMemo(
    () => calculateSavingsGoal({
      monthlyIncome: income, monthlyExpenses: expenses,
      targetAmount: target, currentSavings: current,
    }),
    [income, expenses, target, current],
  );

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/simulator/savings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: income, monthlyExpenses: expenses, targetAmount: target }),
      });
    } finally { setSaving(false); }
  }

  const firstRows = r.projection.slice(0, 24);

  return (
    <ToolShell
      saving={saving}
      onSave={save}
      controls={
        <>
          <Slider label="Monthly income" value={income} onChange={setIncome} min={1000} max={200000} step={500} format={inr} marks={["1k", "2L"]} />
          <Slider label="Monthly expenses" value={expenses} onChange={setExpenses} min={0} max={200000} step={500} format={inr} marks={["0", "2L"]} />
          <Slider label="Savings target" value={target} onChange={setTarget} min={1000} max={500000} step={1000} format={inr} marks={["1k", "5L"]} />
          <Slider label="Already saved" value={current} onChange={setCurrent} min={0} max={200000} step={500} format={inr} marks={["0", "2L"]} />
        </>
      }
    >
      <StatStrip
        items={[
          { label: "Monthly surplus", value: inr(r.monthlySurplus), tone: r.monthlySurplus > 0 ? "good" : "bad" },
          { label: "Savings rate", value: `${r.savingsRatePct}%`, tone: r.savingsRatePct >= 20 ? "good" : r.savingsRatePct > 0 ? "warn" : "bad" },
          { label: "Time to target", value: r.monthsToTarget ? `${r.monthsToTarget} mo` : "N/A", hint: r.targetDate ?? undefined },
          { label: "Per week", value: inr(r.weeklySaving), hint: "same target, smaller chunks" },
        ]}
      />

      {r.feasible ? (
        <InteractiveSavingsChart
          projection={r.projection}
          healthyRate={r.savingsRatePct >= 20}
          totalInterestEarned={r.totalInterestEarned}
        />
      ) : (
        <Alert tone="danger">{r.message}</Alert>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        <Insight tone="warn">
          <span>
            A savings rate below <strong>10%</strong> leaves little buffer for medical or repair emergencies. Even
            {" "}{inr(Math.max(0, r.monthlySurplus) * 0.5)} set aside monthly is a meaningful start.
          </span>
        </Insight>
        <Insight>
          <span>
            You only need <strong>{inr(r.dailySaving)}</strong> per day to hit this target. Small daily amounts are
            easier to sustain than one large transfer.
          </span>
        </Insight>
      </div>

      {firstRows.length > 0 && (
        <Collapse title="Month-by-month projection" badge={`${firstRows.length} months`}>
          <div className="p-3">
            <DataTable
              head={["Month", "Deposit", "Interest", "Balance"]}
              rows={firstRows.map((p) => [p.month, inr(p.deposit), inr2(p.interest), inr(p.balance)])}
              foot={["Total", inr(firstRows.reduce((s, p) => s + p.deposit, 0)), inr2(firstRows.reduce((s, p) => s + p.interest, 0)), inr(firstRows[firstRows.length - 1].balance)]}
            />
          </div>
        </Collapse>
      )}

      <Disclaimer />
    </ToolShell>
  );
}

/* ================================================================== */
/* 3. FD / RD                                                          */
/* ================================================================== */

function DepositTool() {
  const [mode, setMode] = useState<"fd" | "rd">("fd");
  const [principal, setPrincipal] = useState(20000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(12);
  const [saving, setSaving] = useState(false);

  const fd = useMemo(() => calculateFd({ principal, annualRatePercent: rate, years }), [principal, rate, years]);
  const rd = useMemo(() => calculateRd({ monthlyDeposit: monthly, annualRatePercent: rate, months }), [monthly, rate, months]);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/simulator/fd", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "fd"
            ? { mode, principal, annualRatePercent: rate, years }
            : { mode, monthlyDeposit: monthly, annualRatePercent: rate, months },
        ),
      });
    } finally { setSaving(false); }
  }

  const active = mode === "fd" ? fd.estimatedMaturity : rd.estimatedMaturity;
  const invested = mode === "fd" ? fd.principal : rd.totalDeposited;
  const interest = mode === "fd" ? fd.estimatedInterest : rd.estimatedInterest;

  return (
    <ToolShell
      saving={saving}
      onSave={save}
      controls={
        <>
          <div className="flex gap-1 rounded-none bg-slate-100 p-1">
            {(["fd", "rd"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 cursor-pointer rounded px-2 py-1 text-[11px] font-semibold transition ${
                  mode === m ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
                }`}
              >
                {m === "fd" ? "Fixed Deposit" : "Recurring Deposit"}
              </button>
            ))}
          </div>

          {mode === "fd" ? (
            <>
              <Slider label="Deposit amount" value={principal} onChange={setPrincipal} min={1000} max={1000000} step={1000} format={inr} marks={["1k", "10L"]} />
              <Slider label="Tenure" value={years} onChange={setYears} min={0.25} max={10} step={0.25} format={(v) => `${v} yr`} marks={["3mo", "10yr"]} />
            </>
          ) : (
            <>
              <Slider label="Monthly deposit" value={monthly} onChange={setMonthly} min={100} max={100000} step={100} format={inr} marks={["100", "1L"]} />
              <Slider label="Tenure" value={months} onChange={setMonths} min={3} max={120} step={3} format={(v) => `${v} mo`} marks={["3mo", "10yr"]} />
            </>
          )}
          <Slider label="Interest rate (annual)" value={rate} onChange={setRate} min={1} max={10} step={0.1} format={(v) => `${v.toFixed(1)}%`} marks={["1%", "10%"]} />
        </>
      }
    >
      <StatStrip
        items={[
          { label: mode === "fd" ? "You deposit" : "Total deposited", value: inr(invested) },
          { label: "Interest earned", value: inr2(interest), tone: "good" },
          { label: "Maturity value", value: inr2(active), tone: "good" },
          { label: "Growth", value: `+${invested ? ((interest / invested) * 100).toFixed(1) : 0}%`, hint: "over the full tenure" },
        ]}
      />

      <Card>
        <CardLabel icon={<TrendingUp className="h-3 w-3" />}>How the money grows</CardLabel>
        <div className="mt-3">
          <SplitBar
            parts={[
              { value: invested, label: "Your money", color: "bg-slate-400" },
              { value: interest, label: "Interest", color: "bg-emerald-500" },
            ]}
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          {mode === "fd"
            ? `Compounded quarterly at ${rate.toFixed(1)}%, ${inr(principal)} becomes ${inr2(fd.estimatedMaturity)} after ${years} year(s). The effective yield is ${fd.effectiveYieldPct}% per year.`
            : `Depositing ${inr(monthly)} every month for ${months} months puts in ${inr(rd.totalDeposited)}. Interest adds ${inr2(rd.estimatedInterest)}, giving ${inr2(rd.estimatedMaturity)} at maturity.`}
        </p>
      </Card>

      {mode === "fd" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardLabel icon={<ShieldAlert className="h-3 w-3" />}>If you break the FD early</CardLabel>
            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Interest if held to maturity</span><span className="font-semibold tabular-nums text-emerald-600">{inr2(fd.estimatedInterest)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Interest at reduced rate</span><span className="font-semibold tabular-nums text-slate-700">{inr2(fd.prematureInterest)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Early exit penalty</span><span className="font-semibold tabular-nums text-red-600">-{inr2(fd.prematurePenalty)}</span></div>
              <div className="mt-1.5 flex justify-between border-t border-slate-100 pt-1.5"><span className="font-semibold text-slate-700">You would receive</span><span className="font-bold tabular-nums text-slate-900">{inr2(fd.prematureValue)}</span></div>
            </div>
          </Card>
          <Card>
            <CardLabel icon={<Clock className="h-3 w-3" />}>Same amount, longer tenures</CardLabel>
            <div className="mt-2.5 space-y-1.5">
              {fd.tenureComparison.map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[11px] tabular-nums text-slate-500">{t.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${t.years === years ? "bg-emerald-500" : "bg-slate-300"}`}
                      style={{ width: `${(t.maturity / fd.tenureComparison[fd.tenureComparison.length - 1].maturity) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-[11px] font-semibold tabular-nums text-slate-800">{inr(t.maturity)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardLabel icon={<Clock className="h-3 w-3" />}>Quarter by quarter</CardLabel>
            <div className="mt-2">
              <DataTable
                head={["Qtr", "Deposited", "Interest", "Balance"]}
                rows={rd.quarterlyBreakdown.slice(0, 12).map((q) => [q.quarter, inr(q.deposit), inr2(q.interest), inr(q.balance)])}
              />
            </div>
          </Card>
          <Card>
            <CardLabel icon={<GitCompareArrows className="h-3 w-3" />}>FD vs RD with the same total</CardLabel>
            <div className="mt-2.5 space-y-2 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">RD of {inr(monthly)} x {months} mo</span><span className="font-semibold tabular-nums text-slate-800">{inr2(rd.estimatedMaturity)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">FD of {inr(rd.totalDeposited)}</span><span className="font-semibold tabular-nums text-slate-800">
                {inr2(calculateFd({ principal: rd.totalDeposited, annualRatePercent: rate, years: months / 12 }).estimatedMaturity)}
              </span></div>
              <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-slate-500">Difference</span><span className="font-bold tabular-nums text-amber-600">
                {inr2(calculateFd({ principal: rd.totalDeposited, annualRatePercent: rate, years: months / 12 }).estimatedMaturity - rd.estimatedMaturity)}
              </span></div>
            </div>
            <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
              An FD earns more on the same total because the whole amount earns interest from day one. An RD is easier
              when you cannot set aside a lump sum today.
            </p>
          </Card>
        </div>
      )}

      {mode === "fd" && fd.yearlyBreakdown.length > 1 && (
        <Collapse title="Year-by-year breakdown">
          <div className="p-3">
            <DataTable
              head={["Year", "Opening", "Interest", "Closing"]}
              rows={fd.yearlyBreakdown.map((y) => [y.year, inr(y.opening), inr2(y.interest), inr(y.closing)])}
            />
          </div>
        </Collapse>
      )}

      <Disclaimer />
    </ToolShell>
  );
}

/* ================================================================== */
/* 4. LOAN / EMI                                                       */
/* ================================================================== */

function EmiTool() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [extra, setExtra] = useState(0);
  const [income, setIncome] = useState(20000);
  const [saving, setSaving] = useState(false);

  const r = useMemo(
    () => calculateEmi({ loanAmount, annualRatePercent: rate, tenureMonths: tenure, extraMonthlyPayment: extra }),
    [loanAmount, rate, tenure, extra],
  );

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/simulator/emi", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanAmount, annualRatePercent: rate, tenureMonths: tenure }),
      });
    } finally { setSaving(false); }
  }

  const emiRatio = income > 0 ? (r.emi / income) * 100 : 0;
  const ratioTone = emiRatio <= 30 ? "good" : emiRatio <= 45 ? "warn" : "bad";
  const ratioLabel = emiRatio <= 30 ? "Comfortable" : emiRatio <= 45 ? "Stretch" : "Risky";

  return (
    <ToolShell
      saving={saving}
      onSave={save}
      controls={
        <>
          <Slider label="Loan amount" value={loanAmount} onChange={setLoanAmount} min={5000} max={2000000} step={5000} format={inr} marks={["5k", "20L"]} />
          <Slider label="Interest rate (annual)" value={rate} onChange={setRate} min={1} max={36} step={0.25} format={(v) => `${v.toFixed(2)}%`} marks={["1%", "36%"]} />
          <Slider label="Tenure" value={tenure} onChange={setTenure} min={3} max={240} step={3} format={(v) => `${v} mo`} marks={["3mo", "20yr"]} />
          <Slider label="Extra paid monthly" value={extra} onChange={setExtra} min={0} max={20000} step={100} format={inr} marks={["0", "20k"]} />
          <div className="border-t border-slate-100 pt-3">
            <Slider label="Your monthly income" value={income} onChange={setIncome} min={5000} max={500000} step={1000} format={inr} marks={["5k", "5L"]} />
          </div>
        </>
      }
    >
      <StatStrip
        items={[
          { label: "Monthly EMI", value: inr2(r.emi), tone: "default" },
          { label: "Total interest", value: inr2(r.totalInterest), tone: "warn" },
          { label: "Total repayment", value: inr2(r.totalRepayment) },
          { label: "EMI / income", value: `${emiRatio.toFixed(0)}%`, tone: ratioTone, hint: ratioLabel },
        ]}
      />

      <Card>
        <div className="flex items-center justify-between">
          <CardLabel icon={<Calculator className="h-3 w-3" />}>What you repay</CardLabel>
          <Pill tone={r.interestSharePct > 30 ? "danger" : r.interestSharePct > 15 ? "warning" : "success"}>
            {r.interestSharePct}% of repayments is interest
          </Pill>
        </div>
        <div className="mt-3">
          <SplitBar
            parts={[
              { value: r.principal, label: "Principal", color: "bg-emerald-500" },
              { value: r.totalInterest, label: "Interest", color: "bg-amber-400" },
            ]}
          />
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
          <div className="rounded-none bg-slate-50 px-2 py-1.5"><p className="text-[9px] uppercase text-slate-400">Principal</p><p className="font-bold tabular-nums text-slate-800">{inr(r.principal)}</p></div>
          <div className="rounded-none bg-slate-50 px-2 py-1.5"><p className="text-[9px] uppercase text-slate-400">Instalments</p><p className="font-bold tabular-nums text-slate-800">{r.monthsTaken}</p></div>
          <div className="rounded-none bg-emerald-50 px-2 py-1.5"><p className="text-[9px] uppercase text-emerald-600">Months saved</p><p className="font-bold tabular-nums text-emerald-700">{r.monthsSaved}</p></div>
          <div className="rounded-none bg-emerald-50 px-2 py-1.5"><p className="text-[9px] uppercase text-emerald-600">Interest saved</p><p className="font-bold tabular-nums text-emerald-700">{inr(r.interestSaved)}</p></div>
        </div>
      </Card>

      {emiRatio > 40 && (
        <Alert tone="danger">
          This EMI takes {emiRatio.toFixed(0)}% of your stated income. Lenders generally treat anything above 40 to 50%
          as a sign of over-borrowing, and it leaves little room for emergencies. Consider a longer tenure or a smaller
          loan.
        </Alert>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardLabel icon={<Clock className="h-3 w-3" />}>Same loan, different tenures</CardLabel>
          <div className="mt-2">
            <DataTable
              head={["Tenure", "EMI", "Interest", "Total"]}
              rows={r.tenureOptions
                .filter((t) => t.months <= Math.max(60, tenure * 2))
                .map((t) => [
                  `${t.months} mo`,
                  inr(t.emi),
                  inr(t.totalInterest),
                  inr(t.totalRepayment),
                ])}
            />
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
            A longer tenure lowers the monthly EMI but you pay noticeably more interest overall. This is the single
            most important trade-off in any loan.
          </p>
        </Card>

        <Card>
          <CardLabel icon={<TrendingUp className="h-3 w-3" />}>Yearly summary</CardLabel>
          <div className="mt-2">
            <DataTable
              head={["Year", "Principal", "Interest", "Balance"]}
              rows={r.yearlySummary.map((y) => [`Y${y.year}`, inr(y.principalPaid), inr(y.interestPaid), inr(y.closingBalance)])}
            />
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
            Notice how early years are mostly interest. That is why paying a little extra early on reduces the loan
            much faster than paying the same amount later.
          </p>
        </Card>
      </div>

      {extra > 0 && (
        <Insight tone="good">
          <span>
            Adding <strong>{inr(extra)}</strong> to every EMI clears this loan{" "}
            <strong>{r.monthsSaved} months earlier</strong> and saves{" "}
            <strong>{inr(r.interestSaved)}</strong> in interest. Prepaying early in the tenure has the biggest effect.
          </span>
        </Insight>
      )}

      <Collapse title="Full amortisation schedule" badge={`${r.schedule.length} instalments`}>
        <div className="max-h-80 overflow-y-auto p-3">
          <DataTable
            head={["#", "EMI", "Principal", "Interest", "Extra", "Balance"]}
            rows={r.schedule.map((s) => [
              s.month, inr(s.emi), inr2(s.principalPaid - s.extraPaid), inr2(s.interestPaid),
              s.extraPaid ? inr(s.extraPaid) : "-", inr(s.balance),
            ])}
          />
        </div>
      </Collapse>

      <Disclaimer />
    </ToolShell>
  );
}
