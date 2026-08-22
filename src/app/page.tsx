import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLangFromCookie, LANG_COOKIE, t, type LangCode } from "@/lib/i18n";
import { BrowserTranslateButton } from "@/components/BrowserTranslateButton";
import {
  ShieldAlert,
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Wallet,
  Building2,
  PhoneCall,
  FileCheck,
  Award,
  Zap,
  ChevronRight,
  Activity,
  Search,
  Check,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.onboarded ? "/dashboard" : "/onboarding");
  }

  const cookieStore = await cookies();
  const lang = getLangFromCookie(cookieStore.get(LANG_COOKIE)?.value);

  return <LandingContent lang={lang} />;
}

function GuestAccessButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={async () => {
        "use server";
        const { getOrCreateGuestUser, createSessionCookie } = await import("@/lib/auth");
        const { getLangFromCookie: gl, LANG_COOKIE: LC } = await import("@/lib/i18n");
        const cookieStore = await cookies();
        const lang = gl(cookieStore.get(LC)?.value);
        const guest = await getOrCreateGuestUser(lang);
        await createSessionCookie(guest.id);
        const { redirect: r } = await import("next/navigation");
        r("/dashboard");
      }}
    >
      <button
        type="submit"
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-none bg-lime-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-lime-500/20 hover:bg-lime-400 transition cursor-pointer"
        }
      >
        {children || (
          <>
            <span>Explore as Guest</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function LandingContent({ lang }: { lang: LangCode }) {
  const tr = (key: string) => t(lang, key);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-slate-950 text-white py-2 px-4 text-center text-xs font-medium border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="bg-lime-400 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
          NEW
        </span>
        <span>
          Emergency Scam Call Simulator &amp; GST Reconciliation Suite now live!
        </span>
        <span className="hidden sm:inline text-lime-400 font-bold">• 100% Free &amp; Encrypted</span>
      </div>

      {/* 2. STICKY NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/fintell-logo-mark-3d.png"
              alt="FinTell 3D Logo"
              className="h-10 w-10 object-contain drop-shadow-md transition group-hover:scale-105"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                FinTell <span className="text-lime-600 font-extrabold text-sm">AI</span>
              </span>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                Financial Guardian
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <BrowserTranslateButton compact />
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-none px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              {tr("common.signIn")}
            </Link>
            <GuestAccessButton />
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-lime-300/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-none bg-lime-100/90 border border-lime-300 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-lime-950 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-lime-700 animate-pulse" />
              <span>India&apos;s AI Financial Guardian &amp; Fraud Defense</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl leading-[1.1]">
              Protect Your Money. <br />
              <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Master Your Wealth.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              Train against realistic panic scam calls, verify suspicious links and UPI IDs with AI, master 50/30/20 budgeting, and reconcile business GST feeds. Everything in one encrypted app.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <GuestAccessButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-lime-500 px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-lime-500/25 hover:bg-lime-400 transition cursor-pointer">
                <span>Start Free Security Drill</span>
                <ArrowRight className="h-4 w-4" />
              </GuestAccessButton>

              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none border-2 border-slate-900 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white transition cursor-pointer shadow-xs"
              >
                <span>Create Free Account</span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-500 border-t border-slate-100 max-w-xl mx-auto">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-lime-600" />
                <span>No Bank Account Linking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-lime-600" />
                <span>100% Private &amp; Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-lime-600" />
                <span>Supports 11 Languages</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5 PRASUNET HACKATHON SHOWCASE CARD CONTAINER */}
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="rounded-none border-2 border-slate-900 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          {/* Subtle lime glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 blur-[80px] pointer-events-none" />

          {/* Left Content */}
          <div className="space-y-3 text-center md:text-left max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-lime-400 text-slate-950 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" />
              <span>Official Prasunet Hackathon Project</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Designed &amp; Engineered for <span className="text-lime-400">Prasunet Hackathon</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              FinTell was built to tackle India&apos;s growing cyber fraud epidemic, financial illiteracy, and business accounting friction. Engineered as a unified AI Financial Guardian to protect citizens and empower MSME shopkeepers.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] font-bold text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-lime-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Hackathon Submission
              </span>
              <span className="flex items-center gap-1 text-lime-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> AI Fraud &amp; Security
              </span>
            </div>
          </div>

          {/* Right Logo Display */}
          <div className="shrink-0 flex items-center justify-center z-10 group">
            <img
              src="/images/prasunet-hackathon-logo-transparent-3d.png"
              alt="Prasunet Hackathon Official Logo"
              className="h-20 sm:h-24 md:h-28 object-contain drop-shadow-[0_8px_18px_rgba(132,204,22,0.3)] transition transform group-hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* 4. COMPACT UNIFIED APP DASHBOARD PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-none border-2 border-slate-900 bg-slate-950 p-2 shadow-2xl">
          
          {/* MOCKUP HEADER BAR */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono font-bold text-slate-400">
                fintell.app/dashboard/security-center
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-lime-400 font-bold bg-lime-950/80 border border-lime-800 px-2.5 py-0.5">
              <Lock className="h-3 w-3" /> Live Encrypted Guardian Active
            </span>
          </div>

          {/* MOCKUP CONTENT GRID */}
          <div className="bg-slate-900 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-white">
            
            {/* LEFT MOCKUP: SCAM SIMULATOR PREVIEW (6 COLS) */}
            <div className="lg:col-span-6 border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-red-400 animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Emergency Call Simulator
                  </span>
                </div>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-extrabold px-2 py-0.5">
                  CRITICAL DRILL
                </span>
              </div>

              <div className="bg-slate-900 p-4 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Caller: CBI Cyber Crime Branch</span>
                  <span className="text-emerald-400 font-bold">00:24 LIVE</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 italic leading-relaxed">
                  &ldquo;A digital arrest warrant is issued against your Aadhaar! Transfer clearance fees right now to avoid immediate detention...&rdquo;
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/80 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Red Flags Detected (3/3)
                </p>
                <p className="text-xs text-amber-200 font-medium">
                  • Mentions non-existent &apos;Digital Arrest&apos; over video call <br />
                  • Demands immediate money transfer to avoid jail
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-slate-400">Threat Score: 98/100</span>
                <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 uppercase">
                  SAFE CHOICE: HANG UP &amp; DIAL 1930
                </span>
              </div>
            </div>

            {/* RIGHT MOCKUP: MONEY & BUSINESS MODULES (6 COLS) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* TOP MINI CARD: LINK CHECKER */}
              <div className="border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-2 text-lime-400">
                    <Search className="h-4 w-4" /> AI Link &amp; UPI Fraud Checker
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Instant Verification</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2.5 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 truncate">http://t.me/parttime-job-earn-5000-daily</span>
                  <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 shrink-0 ml-2">
                    HIGH RISK FRAUD
                  </span>
                </div>
              </div>

              {/* BOTTOM MINI CARD: 50/30/20 & RECONCILIATION */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5 text-lime-400" /> 50/30/20 Budget
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Needs (50%)</span>
                      <span className="font-bold">₹25,000</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Savings (20%)</span>
                      <span className="font-bold text-lime-400">₹10,000</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-teal-400" /> GST Reconciliation
                  </p>
                  <p className="text-xs text-slate-300 font-semibold">
                    12 Vendor Invoices Matched <br />
                    <span className="text-emerald-400 font-bold">1 GST Mismatch Flagged</span>
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. CORE PILLARS SECTION: CITIZEN vs MSME SHOPKEEPER */}
      <section className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Tailored for Citizens &amp; Business Owners
            </h2>
            <p className="text-sm font-medium text-slate-600">
              Select your mode during onboarding to get personalized safety tools, budgeting calculators, or business reconciliation suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* PILLAR 1: EVERYDAY CITIZENS */}
            <div className="bg-white border-2 border-slate-900 p-8 space-y-6 shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center bg-lime-100 text-lime-900 border border-lime-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950">For Everyday Citizens &amp; Families</h3>
                    <p className="text-xs text-slate-500 font-medium">Personal Financial Guardian &amp; Fraud Defense</p>
                  </div>
                </div>
                <span className="bg-lime-500 text-slate-950 text-[10px] font-black px-2.5 py-1 uppercase">
                  CITIZEN MODE
                </span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
                  <span><strong>Scam Call &amp; SMS Simulator:</strong> Practice responding to fake hospital emergencies, digital arrest calls, and OTP traps in a safe environment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
                  <span><strong>Smart 50/30/20 Budgeting:</strong> Auto-calculate fixed needs, variable wants, recommended savings, and emergency buffers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
                  <span><strong>Debt Payoff Snowball vs. Avalanche:</strong> Compare loan repayment strategies to eliminate credit cards and personal loans faster.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
                  <span><strong>Financial Jargon Translator:</strong> Translate complex terms like SIP, CIBIL, CAGR, and Inflation into simple everyday language.</span>
                </li>
              </ul>

              <div className="pt-2">
                <GuestAccessButton className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer">
                  <span>Explore Citizen Tools</span>
                  <ChevronRight className="h-4 w-4" />
                </GuestAccessButton>
              </div>
            </div>

            {/* PILLAR 2: MSME & SHOPKEEPERS */}
            <div className="bg-white border-2 border-slate-900 p-8 space-y-6 shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center bg-teal-100 text-teal-900 border border-teal-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950">For Shopkeepers &amp; MSMEs</h3>
                    <p className="text-xs text-slate-500 font-medium">Business Accounting &amp; Tax Intelligence</p>
                  </div>
                </div>
                <span className="bg-teal-600 text-white text-[10px] font-black px-2.5 py-1 uppercase">
                  BUSINESS MODE
                </span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>GST &amp; Bank Feed Reconciliation:</strong> Match bank transaction feeds against vendor purchase invoices to detect GST rate discrepancies.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Vendor Receipt &amp; Invoice Verification:</strong> Verify GSTIN numbers, tax invoices, and payment receipts to avoid double billing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Tax Outlay &amp; P&amp;L Reports:</strong> Audit-ready financial summaries, profit/loss tracking, and tax liability calculations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Shopkeeper Fraud Alerts:</strong> Stay protected against fake UPI payment screenshot scams and duplicate QR payment receipts.</span>
                </li>
              </ul>

              <div className="pt-2">
                <GuestAccessButton className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer">
                  <span>Explore Business Suite</span>
                  <ChevronRight className="h-4 w-4" />
                </GuestAccessButton>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. HOW IT WORKS: CONNECTED 3-STEP FLOW */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-2 max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            How FinTell Protects You in 3 Simple Steps
          </h2>
          <p className="text-sm font-medium text-slate-500">
            No complex setup required. Get instant insights in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* STEP 1 */}
          <div className="border border-slate-200 bg-white p-6 space-y-4 hover:border-slate-900 transition">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">01</span>
              <div className="h-10 w-10 flex items-center justify-center bg-lime-100 text-lime-900 font-bold">
                <PhoneCall className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-base font-black text-slate-950">Simulate &amp; Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Paste suspicious SMS messages, job links, or UPI IDs into the AI Fraud Checker, or run an incoming call drill to test your reaction under panic.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="border border-slate-200 bg-white p-6 space-y-4 hover:border-slate-900 transition">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">02</span>
              <div className="h-10 w-10 flex items-center justify-center bg-lime-100 text-lime-900 font-bold">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-base font-black text-slate-950">Budget &amp; Optimize</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Analyze bank statement CSV passbooks, auto-identify recurring subscription charges, and model loan repayment using Snowball vs. Avalanche.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="border border-slate-200 bg-white p-6 space-y-4 hover:border-slate-900 transition">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">03</span>
              <div className="h-10 w-10 flex items-center justify-center bg-lime-100 text-lime-900 font-bold">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-base font-black text-slate-950">Certify &amp; Reconcile</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Earn XP and download your verified &quot;Certified Scam-Protected Citizen&quot; certificate, or run automated GST invoice reconciliation.
            </p>
          </div>

        </div>
      </section>

      {/* 7. HIGH IMPACT CTA BANNER (SLATE-950 + LIME ACCENT) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="bg-slate-950 p-10 sm:p-14 text-white text-center space-y-6 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 text-lime-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 text-lime-400" />
            <span>Zero Cost • 100% Private &amp; Encrypted</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Protect Your Hard-Earned Money?
          </h2>

          <p className="text-sm text-slate-400 max-w-lg mx-auto font-medium">
            Join citizens and MSME shopkeepers across India training against cyber financial fraud and building long-term financial security.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <GuestAccessButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-lime-500 px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-lime-500/20 hover:bg-lime-400 transition cursor-pointer">
              <span>Start Instant Drill</span>
              <ArrowRight className="h-4 w-4" />
            </GuestAccessButton>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none border border-slate-700 bg-slate-900 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <span>Create Account</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-200 py-10 bg-white text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/fintell-logo-mark-3d.png" alt="FinTell 3D Logo" className="h-7 w-7 object-contain" />
            <span className="font-black text-slate-900">FinTell AI Financial Guardian</span>
          </div>

          <p className="text-center text-slate-500">
            FinTell provides objective financial education and cyber fraud safety training. Never share sensitive OTPs or PINs.
          </p>

          <div className="flex items-center gap-4 text-slate-600 font-bold">
            <Link href="/login" className="hover:text-slate-950">Sign In</Link>
            <Link href="/register" className="hover:text-slate-950">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
