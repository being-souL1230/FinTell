"use client";

import { useRef } from "react";
import { ShieldCheck, Award, Printer, Download, Sparkles, CheckCircle2, QrCode } from "lucide-react";

interface SafetyCertificateProps {
  userName: string;
  safetyScore: number;
  totalSolved: number;
  accuracyPct: number;
}

export function SafetyCertificate({
  userName,
  safetyScore,
  totalSolved,
  accuracyPct,
}: SafetyCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="rounded-none border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Official FinTell Fraud Defense Certificate</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </h2>
          <p className="text-xs text-slate-500">
            Earned upon completing financial literacy &amp; scam safety drills with verified accuracy.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-none bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
        >
          <Printer className="h-4 w-4" /> Download / Print Certificate
        </button>
      </div>

      {/* CERTIFICATE CANVAS */}
      <div
        ref={certRef}
        className="mx-auto max-w-3xl rounded-none border-8 border-slate-900 bg-white p-8 sm:p-12 shadow-2xl text-slate-900 space-y-8 relative overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-emerald-600" />
        <div className="absolute top-0 right-0 h-16 w-16 border-t-4 border-r-4 border-emerald-600" />
        <div className="absolute bottom-0 left-0 h-16 w-16 border-b-4 border-l-4 border-emerald-600" />
        <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-emerald-600" />

        {/* Header Branding */}
        <div className="text-center space-y-2 border-b-2 border-slate-100 pb-6">
          <div className="flex items-center justify-center gap-2">
            <img src="/fintell-logo.png" alt="FinTell" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-black tracking-tight text-slate-900">FinTell AI</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            National Financial Literacy &amp; Fraud Defense Guard
          </p>
        </div>

        {/* Main Certificate Title */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">CERTIFICATE OF RECOGNITION</p>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Certified Scam-Protected Citizen
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This official certificate is proudly awarded to
          </p>
        </div>

        {/* User Name */}
        <div className="text-center border-b-2 border-slate-900 pb-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
            {userName}
          </h2>
        </div>

        {/* Citation text */}
        <p className="text-center text-xs text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          For demonstrating high vigilance in identifying digital financial scams, OTP fraud traps, fake KYC phishing, and bank impersonation schemes with a verified Fraud Defense Accuracy of <strong>{accuracyPct}%</strong>.
        </p>

        {/* Metrics Badge Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border border-slate-200 bg-slate-50 p-4 rounded-none">
          <div>
            <p className="text-[9px] font-extrabold uppercase text-slate-400">Safety Index</p>
            <p className="text-base font-black text-emerald-700">{safetyScore} / 100</p>
          </div>
          <div className="border-x border-slate-200">
            <p className="text-[9px] font-extrabold uppercase text-slate-400">Drills Solved</p>
            <p className="text-base font-black text-slate-900">{totalSolved}</p>
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase text-slate-400">Status</p>
            <p className="text-base font-black text-emerald-700">VERIFIED</p>
          </div>
        </div>

        {/* Footer Seal & Signature */}
        <div className="flex items-end justify-between pt-6 border-t border-slate-100">
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Issued On</p>
            <p className="text-xs font-bold text-slate-800">{currentDate}</p>
            <p className="text-[9px] font-mono text-slate-400">ID: FIN-CERT-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-emerald-700" />
            </div>
            <span className="text-[9px] font-black text-slate-900 mt-1 uppercase">Official FinTell Seal</span>
          </div>

          <div className="space-y-1 text-right">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Verification QR</p>
            <div className="flex justify-end">
              <QrCode className="h-9 w-9 text-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
