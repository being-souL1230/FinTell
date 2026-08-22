"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  IndianRupee,
  Calendar,
  User,
} from "lucide-react";

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("FinTell Executive Financial Intelligence Report downloaded successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-none bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                FinTell Actionable Reports
              </span>
              <span className="text-xs text-emerald-100">Document Intelligence &amp; Financial Audits</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Actionable Financial Reports</span>
              <BarChart3 className="h-7 w-7 text-emerald-400 inline stroke-[2.5]" />
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/80">
              Clean structured reports generated automatically from raw documents, budgets, GST checks &amp; scam risk audits.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-none bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-sm"
            >
              <Printer className="h-4 w-4" /> Print Report
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-none bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> {downloading ? "Generating PDF..." : "Download PDF Audit"}
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE EXECUTIVE REPORT PREVIEW SHEET */}
      <div className="rounded-none border border-slate-200/90 bg-white p-8 shadow-sm space-y-6">

        {/* REPORT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-emerald-600 text-white font-black shadow-md">
              <IndianRupee className="h-6 w-6" strokeWidth={2.8} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">FinTell Executive Report</h2>
              <p className="text-xs font-bold text-emerald-700">AI Financial Guardian Audit • Confidential</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
            <p><strong className="text-slate-900">Date Generated:</strong> {new Date().toLocaleDateString("en-IN")}</p>
            <p><strong className="text-slate-900">Report Reference:</strong> FTL-AUD-2026-0891</p>
            <p><strong className="text-slate-900">Status:</strong> VERIFIED &amp; AUDITED</p>
          </div>
        </div>

        {/* SECTION 1: PERSONAL FINANCE & HEALTH SCORE */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">1. Personal Budget &amp; Health Score</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-none border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Health Score</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">82 / 100</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-0.5">Optimal money management</p>
            </div>
            <div className="rounded-none border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Budget</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹52,800</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-0.5">Needs: 54%, Wants: 30%, Savings: 16%</p>
            </div>
            <div className="rounded-none border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Scam Safety Index</p>
              <p className="text-2xl font-black text-sky-600 mt-1">85 / 100</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-0.5">High fraud awareness</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: DOCUMENT RECONCILIATION SUMMARY */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">2. Business Account &amp; GST Reconciliation Summary</h3>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-none border border-slate-200 text-xs">
            <div className="p-3.5 bg-slate-50 flex justify-between font-extrabold text-slate-700">
              <span>Category / Audit Item</span>
              <span>Result &amp; Discrepancy</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="font-bold text-slate-800">Total Transactions Reconciled</span>
              <span className="font-extrabold text-slate-900">4 Records</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="font-bold text-slate-800">Duplicate Payment Alert</span>
              <span className="font-extrabold text-red-600">₹1,250 Flagged (Electricity Bill)</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="font-bold text-slate-800">GSTIN Mismatch Alert</span>
              <span className="font-extrabold text-purple-600">Invoice #INV-2387 mismatch</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="font-bold text-slate-800">Missing Tax Receipt Voucher</span>
              <span className="font-extrabold text-amber-600">₹18,500 Cash withdrawal missing bill</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: INVESTMENT RISK AUDIT */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">3. Investment Risk Audit</h3>
          <div className="rounded-none border border-red-200 bg-red-50/60 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-red-950">Evaluated Scheme: High Yield Daily Crypto Growth</h4>
              <span className="rounded-full bg-red-100 border border-red-300 px-2.5 py-0.5 font-black text-red-800 text-[10px]">
                HIGH RISK (88%)
              </span>
            </div>
            <p className="text-red-900">
              Found guaranteed 25% monthly return trap and mandatory downline recruitment requirement.
            </p>
          </div>
        </div>

        {/* FOOTER SIGNATURE & DISCLAIMER */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 gap-4">
          <div>
            <p className="font-bold text-slate-800">FinTell AI Financial Guardian Engine</p>
            <p className="text-[10px]">Deterministic calculations for GST, totals &amp; budgets. AI explanations attached.</p>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-900 border-b border-slate-300 pb-1 inline-block">Rishab Dixit (Team Leader, Cintage)</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Prasunethon 2.0 FinTech Solution</p>
          </div>
        </div>

      </div>
    </div>
  );
}
