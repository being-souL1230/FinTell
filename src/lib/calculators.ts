// Deterministic, illustrative-only financial calculators.
// Pure functions with zero server dependencies so the same math runs on the
// client (instant interactive preview) and on the server (persisted runs).

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const inr2 = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

/* ------------------------------------------------------------------ */
/* SAVINGS GOAL                                                        */
/* ------------------------------------------------------------------ */

export type SavingsInput = {
  monthlyIncome: number;
  monthlyExpenses: number;
  targetAmount: number;
  currentSavings?: number;
  annualRatePercent?: number;
};

export type SavingsProjectionRow = {
  month: number;
  deposit: number;
  cumulativeDeposit: number;
  interest: number;
  balance: number;
};

export type SavingsResult = {
  monthlySurplus: number;
  savingsRatePct: number;
  monthsToTarget: number | null;
  feasible: boolean;
  targetDate: string | null;
  totalInterestEarned: number;
  weeklySaving: number;
  dailySaving: number;
  projection: SavingsProjectionRow[];
  message: string;
};

export function calculateSavingsGoal(input: SavingsInput): SavingsResult {
  const { monthlyIncome, monthlyExpenses, targetAmount } = input;
  const monthlySurplus = round2(monthlyIncome - monthlyExpenses);
  const savingsRatePct = monthlyIncome > 0 ? round2((monthlySurplus / monthlyIncome) * 100) : 0;
  const currentSavings = Math.max(0, input.currentSavings ?? 0);
  const monthlyRate = (input.annualRatePercent ?? 3.5) / 100 / 12;

  if (monthlySurplus <= 0) {
    return {
      monthlySurplus,
      savingsRatePct,
      monthsToTarget: null,
      feasible: false,
      targetDate: null,
      totalInterestEarned: 0,
      weeklySaving: 0,
      dailySaving: 0,
      projection: [],
      message:
        "Expenses are equal to or higher than income. Reduce non-essential spending or increase income before setting a savings target.",
    };
  }

  const projection: SavingsProjectionRow[] = [];
  let balance = currentSavings;
  let cumulativeDeposit = currentSavings;
  let totalInterestEarned = 0;
  let monthsToTarget: number | null = null;
  const MAX_MONTHS = 600;

  for (let month = 1; month <= MAX_MONTHS; month++) {
    const interest = round2(balance * monthlyRate);
    balance = round2(balance + monthlySurplus + interest);
    cumulativeDeposit = round2(cumulativeDeposit + monthlySurplus);
    totalInterestEarned = round2(totalInterestEarned + interest);
    projection.push({ month, deposit: monthlySurplus, cumulativeDeposit, interest, balance });
    if (balance >= targetAmount && monthsToTarget === null) {
      monthsToTarget = month;
      break;
    }
  }

  const targetDate =
    monthsToTarget !== null
      ? new Date(Date.now() + monthsToTarget * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        })
      : null;

  return {
    monthlySurplus,
    savingsRatePct,
    monthsToTarget,
    feasible: true,
    targetDate,
    totalInterestEarned,
    weeklySaving: round2((monthlySurplus * 12) / 52),
    dailySaving: round2((monthlySurplus * 12) / 365),
    projection,
    message:
      monthsToTarget !== null
        ? `Saving ${inr(monthlySurplus)} per month reaches ${inr(targetAmount)} in about ${monthsToTarget} months.`
        : `Target of ${inr(targetAmount)} is not reachable within 50 years at ${inr(monthlySurplus)} per month.`,
  };
}

/* ------------------------------------------------------------------ */
/* FIXED DEPOSIT                                                       */
/* ------------------------------------------------------------------ */

export type FdInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
};

export type FdYearRow = {
  year: number;
  opening: number;
  interest: number;
  closing: number;
};

export type FdResult = {
  principal: number;
  estimatedInterest: number;
  estimatedMaturity: number;
  annualRatePercent: number;
  years: number;
  effectiveYieldPct: number;
  prematureInterest: number;
  prematurePenalty: number;
  prematureValue: number;
  yearlyBreakdown: FdYearRow[];
  tenureComparison: { label: string; years: number; maturity: number; interest: number }[];
};

const FD_PENALTY_PCT = 0.5; // typical premature withdrawal penalty
const FD_PREMATURE_DROP_PCT = 1; // typical rate reduction on early withdrawal

export function calculateFd(input: FdInput): FdResult {
  const { principal, annualRatePercent, years } = input;
  const n = 4; // quarterly compounding
  const r = annualRatePercent / 100;

  const maturity = principal * Math.pow(1 + r / n, n * years);
  const interest = maturity - principal;

  const yearlyBreakdown: FdYearRow[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const opening = principal * Math.pow(1 + r / n, n * (y - 1));
    const closing = principal * Math.pow(1 + r / n, n * Math.min(y, years));
    yearlyBreakdown.push({
      year: y,
      opening: round2(opening),
      interest: round2(closing - opening),
      closing: round2(closing),
    });
  }

  const tenureComparison = [0.5, 1, 2, 3, 5, 10]
    .filter((y) => y >= years || true)
    .map((y) => {
      const m = principal * Math.pow(1 + r / n, n * y);
      return { label: y < 1 ? "6 mo" : `${y} yr`, years: y, maturity: round2(m), interest: round2(m - principal) };
    });

  const prematureRate = Math.max(0, annualRatePercent - FD_PREMATURE_DROP_PCT);
  const prematureGross = principal * Math.pow(1 + prematureRate / n, n * (years / 2)); // assume exit at half tenure
  const prematurePenalty = round2((prematureGross * FD_PENALTY_PCT) / 100);

  return {
    principal: round2(principal),
    estimatedInterest: round2(interest),
    estimatedMaturity: round2(maturity),
    annualRatePercent,
    years,
    effectiveYieldPct: round2((interest / principal / years) * 100),
    prematureInterest: round2(prematureGross - principal),
    prematurePenalty,
    prematureValue: round2(prematureGross - prematurePenalty),
    yearlyBreakdown,
    tenureComparison,
  };
}

/* ------------------------------------------------------------------ */
/* RECURRING DEPOSIT                                                   */
/* ------------------------------------------------------------------ */

export type RdInput = {
  monthlyDeposit: number;
  annualRatePercent: number;
  months: number;
};

export type RdResult = {
  monthlyDeposit: number;
  months: number;
  totalDeposited: number;
  estimatedInterest: number;
  estimatedMaturity: number;
  quarterlyBreakdown: { quarter: number; deposit: number; interest: number; balance: number }[];
};

export function calculateRd(input: RdInput): RdResult {
  const { monthlyDeposit, annualRatePercent, months } = input;
  const quarterlyRate = annualRatePercent / 100 / 4;

  // Each instalment compounds for its remaining tenure (in quarters).
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    const remainingMonths = months - i + 1;
    maturity += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingMonths / 3);
  }

  const totalDeposited = monthlyDeposit * months;

  const quarterlyBreakdown: RdResult["quarterlyBreakdown"] = [];
  let runningBalance = 0;
  const totalQuarters = Math.ceil(months / 3);
  for (let q = 1; q <= totalQuarters; q++) {
    const deposit = round2(monthlyDeposit * Math.min(3, months - (q - 1) * 3));
    const interest = round2(runningBalance * quarterlyRate);
    runningBalance = round2(runningBalance + deposit + interest);
    quarterlyBreakdown.push({ quarter: q, deposit, interest, balance: runningBalance });
  }

  return {
    monthlyDeposit,
    months,
    totalDeposited: round2(totalDeposited),
    estimatedInterest: round2(maturity - totalDeposited),
    estimatedMaturity: round2(maturity),
    quarterlyBreakdown,
  };
}

/* ------------------------------------------------------------------ */
/* LOAN / EMI (with optional prepayment)                               */
/* ------------------------------------------------------------------ */

export type EmiInput = {
  loanAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
  extraMonthlyPayment?: number;
};

export type AmortRow = {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  extraPaid: number;
  totalPaid: number;
  balance: number;
};

export type EmiResult = {
  emi: number;
  baseEmi: number;
  totalRepayment: number;
  totalInterest: number;
  principal: number;
  interestSharePct: number;
  monthsTaken: number;
  monthsSaved: number;
  interestSaved: number;
  annualRatePercent: number;
  tenureMonths: number;
  schedule: AmortRow[];
  yearlySummary: { year: number; principalPaid: number; interestPaid: number; closingBalance: number }[];
  tenureOptions: { months: number; emi: number; totalInterest: number; totalRepayment: number }[];
};

export function computeEmiAmount(loanAmount: number, annualRatePercent: number, tenureMonths: number) {
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return loanAmount / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

export function calculateEmi(input: EmiInput): EmiResult {
  const { loanAmount, annualRatePercent, tenureMonths } = input;
  const monthlyRate = annualRatePercent / 12 / 100;
  const extra = Math.max(0, input.extraMonthlyPayment ?? 0);

  const baseEmi = computeEmiAmount(loanAmount, annualRatePercent, tenureMonths);
  const emi = round2(baseEmi + extra);

  // Baseline totals (no prepayment)
  let baselineInterest = 0;
  {
    let bal = loanAmount;
    for (let m = 1; m <= tenureMonths; m++) {
      const int = bal * monthlyRate;
      const prin = baseEmi - int;
      bal -= prin;
      baselineInterest += int;
    }
    baselineInterest = round2(baselineInterest);
  }

  const schedule: AmortRow[] = [];
  let balance = loanAmount;
  let month = 0;
  const MAX = tenureMonths + 1;

  while (balance > 0.5 && month < MAX) {
    month++;
    const interestPaid = round2(balance * monthlyRate);
    let principalPaid = round2(emi - interestPaid);
    let extraPaid = 0;

    if (month === tenureMonths) {
      // final instalment settles whatever remains
      principalPaid = round2(balance);
    }
    if (principalPaid > balance) {
      principalPaid = round2(balance);
    }

    balance = round2(balance - principalPaid);
    schedule.push({
      month,
      emi: round2(baseEmi),
      principalPaid,
      interestPaid,
      extraPaid: extraPaid,
      totalPaid: round2(principalPaid + interestPaid),
      balance: Math.max(balance, 0),
    });
    if (extra > 0 && balance <= 0) break;
    void extraPaid;
  }

  const totalRepayment = round2(schedule.reduce((s, r) => s + r.totalPaid, 0));
  const totalInterest = round2(totalRepayment - loanAmount);

  const yearlySummary: EmiResult["yearlySummary"] = [];
  for (let y = 1; y <= Math.ceil(month / 12); y++) {
    const rows = schedule.filter((r) => r.month > (y - 1) * 12 && r.month <= y * 12);
    if (rows.length === 0) continue;
    yearlySummary.push({
      year: y,
      principalPaid: round2(rows.reduce((s, r) => s + r.principalPaid, 0)),
      interestPaid: round2(rows.reduce((s, r) => s + r.interestPaid, 0)),
      closingBalance: rows[rows.length - 1].balance,
    });
  }

  const tenureOptions = [6, 12, 24, 36, 48, 60, 84, 120].map((m) => {
    const e = computeEmiAmount(loanAmount, annualRatePercent, m);
    return {
      months: m,
      emi: round2(e),
      totalInterest: round2(e * m - loanAmount),
      totalRepayment: round2(e * m),
    };
  });

  return {
    emi,
    baseEmi: round2(baseEmi),
    totalRepayment,
    totalInterest,
    principal: round2(loanAmount),
    interestSharePct: round2((totalInterest / totalRepayment) * 100),
    monthsTaken: month,
    monthsSaved: Math.max(0, tenureMonths - month),
    interestSaved: round2(Math.max(0, baselineInterest - totalInterest)),
    annualRatePercent,
    tenureMonths,
    schedule,
    yearlySummary,
    tenureOptions,
  };
}

/* ------------------------------------------------------------------ */
/* OPTION COMPARISON (the "decision" engine)                           */
/* ------------------------------------------------------------------ */

export type CompareInput = {
  amount: number;
  years: number;
  monthlyContribution?: number;
  savingsRatePercent?: number;
  fdRatePercent?: number;
  rdRatePercent?: number;
  inflationPercent?: number;
};

export type CompareOption = {
  key: "savings" | "fd" | "rd" | "cash";
  label: string;
  description: string;
  maturity: number;
  invested: number;
  interest: number;
  liquidity: "High" | "Medium" | "Low";
  riskNote: string;
};

export type CompareResult = {
  options: CompareOption[];
  bestInterest: CompareOption | null;
  inflationAdjusted: { label: string; realValue: number }[];
  lostToInflation: number;
  inflationPercent: number;
};

export function compareOptions(input: CompareInput): CompareResult {
  const { amount, years } = input;
  const monthly = Math.max(0, input.monthlyContribution ?? 0);
  const savingsRate = input.savingsRatePercent ?? 3.5;
  const fdRate = input.fdRatePercent ?? 6.5;
  const rdRate = input.rdRatePercent ?? 6.5;
  const inflation = input.inflationPercent ?? 6;
  const months = Math.round(years * 12);

  // Savings account (monthly compounding, contributions allowed)
  const sRate = savingsRate / 100 / 12;
  let savingsBalance = amount;
  for (let m = 1; m <= months; m++) {
    savingsBalance = savingsBalance * (1 + sRate) + monthly;
  }

  // FD on the lump sum, RD on the monthly contributions
  const fdMaturity = amount * Math.pow(1 + fdRate / 100 / 4, 4 * years);
  let rdMaturity = 0;
  const rdQ = rdRate / 100 / 4;
  for (let i = 1; i <= months; i++) {
    rdMaturity += monthly * Math.pow(1 + rdQ, (months - i + 1) / 3);
  }

  // Cash: literally kept aside, no interest
  const cashTotal = amount + monthly * months;
  const invested = round2(amount + monthly * months);
  const combined = round2(fdMaturity + rdMaturity);

  const options: CompareOption[] = [
    {
      key: "cash",
      label: "Keep as cash",
      description: "Money kept outside the bank. No interest, physical risk, no record.",
      maturity: round2(cashTotal),
      invested,
      interest: 0,
      liquidity: "High",
      riskNote: "Loses value to inflation and carries theft or loss risk.",
    },
    {
      key: "savings",
      label: "Savings account",
      description: "Fully flexible. Withdraw any time, small interest, ideal for emergencies.",
      maturity: round2(savingsBalance),
      invested,
      interest: round2(savingsBalance - invested),
      liquidity: "High",
      riskNote: "Low return, but the safest place for money you may need soon.",
    },
    {
      key: "fd",
      label: "Fixed deposit (lump sum) + RD (monthly)",
      description: `FD on the lump sum at ${fdRate}% plus an RD of ${inr(monthly)} per month at ${rdRate}%.`,
      maturity: combined,
      invested,
      interest: round2(combined - invested),
      liquidity: "Low",
      riskNote: "Higher return, but funds are locked. Early exit usually costs a penalty.",
    },
    {
      key: "rd",
      label: "Recurring deposit only",
      description: `Only the monthly ${inr(monthly)} grows. The lump sum stays idle in savings.`,
      maturity: round2(rdMaturity + amount * Math.pow(1 + sRate, months)),
      invested,
      interest: round2(rdMaturity + amount * Math.pow(1 + sRate, months) - invested),
      liquidity: "Medium",
      riskNote: "Good habit builder, but leaves the lump sum under-utilised.",
    },
  ];

  const withInterest = options.filter((o) => o.interest > 0);
  const bestInterest = withInterest.length
    ? withInterest.reduce((a, b) => (b.interest > a.interest ? b : a))
    : null;

  const factor = Math.pow(1 + inflation / 100, years);
  const inflationAdjusted = options.map((o) => ({
    label: o.label,
    realValue: round2(o.maturity / factor),
  }));
  const lostToInflation = round2(cashTotal - cashTotal / factor);

  return { options, bestInterest, inflationAdjusted, lostToInflation, inflationPercent: inflation };
}
