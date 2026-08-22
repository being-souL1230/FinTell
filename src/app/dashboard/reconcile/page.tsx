"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Building2,
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  Check,
  X,
  FileText,
  AlertCircle,
  RotateCcw,
  PlusCircle,
} from "lucide-react";

interface ReconItem {
  id: string;
  bankDate: string;
  bankDesc: string;
  bankAmount: number;
  invoiceNo: string;
  vendor: string;
  gstin: string;
  invoiceAmount: number;
  difference: number;
  status: "MATCHED" | "DUPLICATE" | "GST_MISMATCH" | "MISSING";
  aiExplanation: string;
  actionRequired: string;
}

const SAMPLE_RECON: ReconItem[] = [
  {
    id: "rec-1",
    bankDate: "2026-08-14",
    bankDesc: "NEFT-APEX TECH SUPPLIES",
    bankAmount: 53100,
    invoiceNo: "INV-2026-0891",
    vendor: "Apex Tech Supplies",
    gstin: "27AAACA12341ZV",
    invoiceAmount: 53100,
    difference: 0,
    status: "MATCHED",
    aiExplanation: "Bank payout matches exact invoice total and 18% GST calculation.",
    actionRequired: "Auto-reconciled.",
  },
  {
    id: "rec-2",
    bankDate: "2026-08-18",
    bankDesc: "UPI-ELECTRICITY BOARD",
    bankAmount: 1250,
    invoiceNo: "BILL-EB-8891",
    vendor: "State Electricity Board",
    gstin: "27SEB123456789",
    invoiceAmount: 1250,
    difference: 0,
    status: "DUPLICATE",
    aiExplanation: "Possible duplicate entry! Electricity bill of ₹1,250 paid twice within 48 hours.",
    actionRequired: "Verify bank statement entry #8821.",
  },
  {
    id: "rec-3",
    bankDate: "2026-08-19",
    bankDesc: "CHEQUE-METRO HARDWARE",
    bankAmount: 6450,
    invoiceNo: "REC-9912",
    vendor: "Metro Hardware Traders",
    gstin: "NOT_FOUND",
    invoiceAmount: 6450,
    difference: 0,
    status: "GST_MISMATCH",
    aiExplanation: "GSTIN missing on invoice exceeding ₹5,000 threshold. Input Tax Credit cannot be claimed.",
    actionRequired: "Request GST Tax Invoice from vendor.",
  },
  {
    id: "rec-4",
    bankDate: "2026-08-20",
    bankDesc: "CASH WITHDRAWAL - RAW MATERIAL",
    bankAmount: 18500,
    invoiceNo: "MISSING",
    vendor: "Unregistered Vendor",
    gstin: "N/A",
    invoiceAmount: 0,
    difference: 18500,
    status: "MISSING",
    aiExplanation: "Bank payout of ₹18,500 has no matching purchase bill or GST invoice uploaded.",
    actionRequired: "Upload tax invoice or cash receipt voucher to avoid tax audit penalty.",
  },
];

export default function ReconcilePage() {
  const [items, setItems] = useState<ReconItem[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<ReconItem | null>(null);
  const [reconciledCount, setReconciledCount] = useState<number>(0);

  // Load persistent reconciliation items on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fintell_reconcile_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setSelectedItem(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Error loading reconciliation data from storage:", e);
    }
  }, []);

  const saveReconItems = (newItems: ReconItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("fintell_reconcile_items", JSON.stringify(newItems));
    } catch (e) {
      console.error("Error saving reconciliation data to storage:", e);
    }
  };

  const loadDemoData = () => {
    saveReconItems(SAMPLE_RECON);
    setSelectedItem(SAMPLE_RECON[1]);
    setReconciledCount(1);
  };

  const clearData = () => {
    saveReconItems([]);
    setSelectedItem(null);
    setReconciledCount(0);
  };

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  const handleResolve = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, status: "MATCHED" as const, difference: 0, actionRequired: "Manually resolved & matched." } : i
    );
    saveReconItems(updated);
    setReconciledCount((c) => c + 1);
  };


  const totalDiscrepancy = items.reduce((acc, curr) => acc + Math.abs(curr.difference), 0);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-none bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-bold text-teal-300">
                FinTell Pillar 3: Reconcile
              </span>
              <span className="text-xs text-teal-100">Automated Account &amp; GST Matching</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>GST &amp; Account Reconciliation Engine</span>
              <Scale className="h-7 w-7 text-teal-300 inline stroke-[2.5]" />
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-teal-100/80">
              Matches bank statements against purchase invoices, catches tax mistakes, duplicate payments &amp; missing entries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {items.length === 0 ? (
              <button
                onClick={loadDemoData}
                className="inline-flex items-center justify-center gap-2 rounded-none bg-teal-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-teal-300 shadow-md cursor-pointer transition"
              >
                <Sparkles className="h-4 w-4" /> Load Demo Data
              </button>
            ) : (
              <button
                onClick={clearData}
                className="inline-flex items-center justify-center gap-2 rounded-none bg-white/10 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear Demo Data
              </button>
            )}

            <button
              onClick={() => alert("Reconciliation summary report exported successfully!")}
              className="inline-flex items-center justify-center gap-2 rounded-none bg-white px-4 py-2.5 text-xs font-black text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer transition"
            >
              <Download className="h-4 w-4" /> Export Report
            </button>
          </div>
        </div>

        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Total Matched</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{reconciledCount} / {items.length}</p>
          </div>
          <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Net Discrepancy</p>
            <p className="text-xl font-black text-amber-400 mt-1">₹{totalDiscrepancy.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Duplicate Flags</p>
            <p className="text-xl font-black text-red-400 mt-1">{items.filter(i => i.status === "DUPLICATE").length} Detected</p>
          </div>
          <div className="rounded-none bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">GSTIN Errors</p>
            <p className="text-xl font-black text-purple-400 mt-1">{items.filter(i => i.status === "GST_MISMATCH").length} Mismatches</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        /* EMPTY STATE FOR NEW USERS */
        <div className="rounded-none border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-teal-50 text-teal-700">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">No Reconciliation Records Uploaded Yet</h3>
            <p className="text-xs text-slate-500">
              Upload your bank feed CSV or purchase invoices to start automated GST and duplicate payment reconciliation audits.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={loadDemoData}
              className="inline-flex items-center gap-2 rounded-none bg-teal-600 px-5 py-3 text-xs font-black text-white hover:bg-teal-700 transition cursor-pointer shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-teal-200" /> Load Demo Data (Try Feature)
            </button>
            <Link
              href="/dashboard/verify"
              className="inline-flex items-center gap-2 rounded-none border border-slate-300 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <PlusCircle className="h-4 w-4" /> Upload Invoices &amp; Bank CSV &rarr;
            </Link>
          </div>
        </div>
      ) : (
        /* FILTER TABS & DATA TABLE */
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-none border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Filter className="h-4 w-4 text-slate-400 ml-2" />
              {["ALL", "MATCHED", "DUPLICATE", "GST_MISMATCH", "MISSING"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-none px-3.5 py-1.5 text-xs font-extrabold cursor-pointer transition ${
                    filter === f
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.replace("_", " ")}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 pr-2">Showing {filteredItems.length} records</span>
          </div>

          {/* 2-COLUMN GRID: RECONCILIATION TABLE & STEP-BY-STEP RESOLUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT 2 COLS: RECONCILIATION TABLE */}
            <div className="lg:col-span-2 rounded-none border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900">Bank Feed vs Purchase Invoices Matching Table</h2>

              <div className="divide-y divide-slate-100 overflow-hidden rounded-none border border-slate-200">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 transition cursor-pointer space-y-3 ${
                      selectedItem?.id === item.id ? "bg-teal-50/70 border-l-4 border-teal-600" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                            item.status === "MATCHED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : item.status === "DUPLICATE"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : item.status === "GST_MISMATCH"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{item.bankDate}</span>
                      </div>

                      <span className="text-xs font-black text-slate-900">
                        Bank Payout: ₹{item.bankAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-none border border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bank Feed Record</p>
                        <p className="font-extrabold text-slate-900">{item.bankDesc}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Matched Invoice / Vendor</p>
                        <p className="font-extrabold text-slate-900">{item.vendor} ({item.invoiceNo})</p>
                      </div>
                    </div>

                    {item.difference !== 0 && (
                      <div className="flex items-center justify-between text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-none border border-amber-200">
                        <span>Discrepancy Amount:</span>
                        <span>₹{Math.abs(item.difference).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COL: STEP-BY-STEP RESOLUTION LOOP */}
            {selectedItem ? (
              <div className="rounded-none border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Resolution Inspector</h3>
                  <span className="text-xs font-bold text-teal-700">Audit Loop</span>
                </div>

                <div className="space-y-4">
                  {/* STEP 1: DETECTED */}
                  <div className="rounded-none border border-slate-200 p-3.5 space-y-1 bg-slate-50">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Step 1: Detection</span>
                    <p className="text-xs font-extrabold text-slate-900">{selectedItem.status.replace("_", " ")}</p>
                    <p className="text-[11px] text-slate-600">Affected Record: {selectedItem.vendor}</p>
                  </div>

                  {/* STEP 2: EXPLANATION */}
                  <div className="rounded-none border border-teal-200 p-3.5 space-y-1.5 bg-teal-50/70">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-teal-700" />
                      <span className="text-[10px] font-extrabold uppercase text-teal-900 tracking-wider">Step 2: AI Explanation</span>
                    </div>
                    <p className="text-xs font-semibold text-teal-950 leading-relaxed">
                      {selectedItem.aiExplanation}
                    </p>
                  </div>

                  {/* STEP 3: ACTION */}
                  <div className="rounded-none border border-slate-900 p-3.5 space-y-2 bg-slate-900 text-white">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Step 3: Recommended Action</span>
                    <p className="text-xs text-slate-200 font-medium">
                      {selectedItem.actionRequired}
                    </p>

                    {selectedItem.status !== "MATCHED" && (
                      <button
                        onClick={() => handleResolve(selectedItem.id)}
                        className="flex items-center justify-center gap-1.5 w-full mt-2 rounded-none bg-emerald-500 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Mark as Resolved &amp; Reconciled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </>
      )}
    </div>
  );
}
