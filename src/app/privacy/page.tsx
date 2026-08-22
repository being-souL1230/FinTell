import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, UserX, Database, FileText } from "lucide-react";
import { BrowserTranslateButton } from "@/components/BrowserTranslateButton";

export const metadata: Metadata = {
  title: "Privacy Policy | FinTell AI Financial Guardian",
  description:
    "Comprehensive Privacy Policy of FinTell — detailing data protection standards, strict zero-credential storage policy, AI data handling, and self-serve account erasure.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-lime-400 selection:text-slate-950">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-slate-950 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-2.5">
            <img src="/images/fintell-logo-mark-3d.png" alt="FinTell Logo" className="h-7 w-7 object-contain" />
            <span className="text-base font-black tracking-tight text-slate-950">FinTell Legal</span>
          </div>

          <BrowserTranslateButton compact />
        </div>
      </header>

      {/* HERO TITLE CONTAINER */}
      <div className="bg-slate-950 text-white py-14 px-6 border-b border-slate-800">
        <div className="mx-auto max-w-4xl space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-lime-400 text-slate-950 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Protection &amp; Legal Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">FinTell Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-medium">
            Effective Date: August 22, 2026 • Compliant with Digital Personal Data Protection (DPDP) Act &amp; International Data Standards
          </p>
        </div>
      </div>

      {/* MAIN DOCUMENT BODY */}
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        
        {/* SUMMARY HIGHLIGHT BOX */}
        <div className="bg-white border-2 border-slate-900 p-6 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-lime-700">
            <Lock className="h-5 w-5 shrink-0" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">Privacy at a Glance</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
            FinTell is built on a zero-credential security principle. We <strong>NEVER</strong> request, store, or process sensitive banking passwords, OTPs, UPI PINs, or full card details. All data transmission is encrypted, and you retain complete self-serve control to erase your account and data permanently at any time.
          </p>
        </div>

        {/* SECTION 1 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            1. Introduction &amp; Scope
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            FinTell (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the FinTell AI Financial Guardian application and financial literacy platform. This Privacy Policy governs the collection, processing, storage, and erasure of information when you use our website, mobile interface, AI fraud risk checkers, scam call simulators, and business reconciliation modules.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            By accessing or using FinTell, you consent to the data practices described in this policy. If you do not agree with any terms, please discontinue using the platform.
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            2. Information We Collect
          </h2>
          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">A. Account Information</h3>
              <p className="mt-1 leading-relaxed">
                When you create an account, we collect your name, email address, password hash (encrypted using bcrypt), language preference, financial experience level, and business mode toggle.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">B. User-Entered Financial &amp; Business Data</h3>
              <p className="mt-1 leading-relaxed">
                To calculate financial metrics and perform business reconciliation, you may provide budget inputs, savings target amounts, loan/EMI balances, bank CSV passbook entries, or vendor invoice records.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">C. Security Drill &amp; Learning Progress</h3>
              <p className="mt-1 leading-relaxed">
                We store your completed security drill scores, earned XP points, quiz answers, unlocked safety badges, and generated safety certificates.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">D. Technical &amp; Device Logs</h3>
              <p className="mt-1 leading-relaxed">
                We automatically record standard technical data such as browser type, device category, IP address, session timestamps, and language cookie preferences to optimize system performance.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 - CRITICAL GUARDRAIL */}
        <section className="bg-red-50 border-2 border-red-600 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-red-700">
            <Lock className="h-5 w-5 shrink-0" />
            <h2 className="text-base font-black uppercase text-red-950 tracking-wider">
              3. Strict Zero-Credential Storage Policy
            </h2>
          </div>
          <p className="text-xs text-red-950 font-semibold leading-relaxed">
            FinTell strictly adheres to a Zero Sensitive Credential Policy. Under no circumstances will FinTell ask you to provide, nor do we store or process:
          </p>
          <ul className="space-y-1.5 text-xs text-red-900 font-bold list-disc pl-5">
            <li>One-Time Passwords (OTPs) or SMS verification codes</li>
            <li>UPI PINs or Net Banking Login Passwords</li>
            <li>Debit or Credit Card CVV numbers / Full 16-digit card numbers</li>
            <li>Direct Bank Account Credentials or Automated Bank Login Tokens</li>
          </ul>
          <p className="text-[11px] text-red-800 font-medium pt-1">
            If you ever receive a message or call claiming to be from FinTell requesting your OTP, PIN, or password, it is fraudulent. Disconnect immediately.
          </p>
        </section>

        {/* SECTION 4 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            4. How We Use Your Information
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
              <span>To calculate custom 50/30/20 budget allocations, debt avalanche/snowball payoff schedules, and goal timelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
              <span>To run AI fraud checks on suspicious URL links and UPI handles and display real-time risk scores.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
              <span>To execute bank feed and vendor GST invoice reconciliation for shopkeepers and small business owners.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
              <span>To generate verified &quot;Certified Scam-Protected Citizen&quot; certificates with QR verification.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0 mt-0.5" />
              <span>To process 24/7 AI conversational queries via Groq LLM and localized knowledge base search.</span>
            </li>
          </ul>
        </section>

        {/* SECTION 5 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            5. Data Protection &amp; Security Measures
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We implement robust administrative, technical, and physical security controls to safeguard your data against unauthorized access, loss, or disclosure:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 font-semibold list-disc pl-5">
            <li><strong>Transport Layer Security:</strong> All data in transit is encrypted using SSL/TLS protocols.</li>
            <li><strong>Password Hashing:</strong> User passwords are encrypted using bcrypt hashing before storage.</li>
            <li><strong>Secure Cookie Tokens:</strong> Authentication tokens are transmitted in HTTP-only, SameSite secure cookies.</li>
            <li><strong>Cloud Infrastructure:</strong> Database records are hosted on encrypted PostgreSQL instances on Neon.tech.</li>
          </ul>
        </section>

        {/* SECTION 6 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            6. Third-Party Integrations &amp; Non-Disclosure
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            FinTell does <strong>NOT</strong> sell, rent, trade, or monetize your personal or financial data to third-party advertisers, data brokers, or marketing agencies.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We integrate with trusted infrastructure providers solely for core functionality:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 font-semibold list-disc pl-5">
            <li><strong>Groq AI API:</strong> Queries sent to the AI assistant are processed statelessly without attaching personal user identities.</li>
            <li><strong>Neon Database:</strong> Encrypted cloud database hosting for user profiles and progress logs.</li>
          </ul>
        </section>

        {/* SECTION 7 - SELF SERVE DELETION */}
        <section className="bg-slate-900 text-white p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-lime-400">
            <UserX className="h-5 w-5 shrink-0" />
            <h2 className="text-base font-black uppercase tracking-wider">
              7. Your Rights &amp; Self-Serve Account Erasure
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            You maintain absolute control over your personal data. Under the Digital Personal Data Protection (DPDP) Act and global privacy laws, you possess:
          </p>
          <ul className="space-y-2 text-xs text-slate-200 font-semibold">
            <li className="flex items-start gap-2">
              <span className="text-lime-400 font-bold">✓</span>
              <span><strong>Right to Access &amp; Export:</strong> Review all financial profiles, budget metrics, and completed drill progress at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400 font-bold">✓</span>
              <span><strong>Instant Account Erasure (Right to Be Forgotten):</strong> You can permanently delete your account directly from your dashboard sidebar or profile settings. Deletion triggers a cascading database wipe of all user records, progress logs, and financial entries.</span>
            </li>
          </ul>
        </section>

        {/* SECTION 8 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            8. Cookies &amp; Tracking Notice
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            FinTell uses essential session cookies (`fintell_session`) and language preference cookies (`fintell_lang`) to keep you logged in and display content in your preferred regional language. We do not use intrusive third-party cross-site tracking cookies.
          </p>
        </section>

        {/* SECTION 9 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We may update this Privacy Policy periodically to reflect enhancements in security features or regulatory updates. Any material changes will be highlighted on our homepage or notified via email.
          </p>
        </section>

        {/* SECTION 10 */}
        <section className="bg-white border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-2">
            10. Privacy Support &amp; Feedback
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            If you have any questions, feedback, or data privacy enquiries regarding FinTell, please reach out to our team via the built-in AI Financial Assistant or contact our support desk:
          </p>
          <div className="bg-slate-50 p-4 border border-slate-200 text-xs font-sans text-slate-800 space-y-1.5 font-medium">
            <p className="font-bold text-slate-950">FinTell Support &amp; Privacy Desk</p>
            <p className="text-slate-600">For security assistance, privacy questions, or data management queries, visit the AI Financial Assistant within your dashboard or email us directly.</p>
            <p className="text-lime-700 font-mono text-[11px] pt-1">Support Email: support@fintell.app</p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8 bg-white text-slate-500 text-xs text-center">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/fintell-logo-mark-3d.png" alt="FinTell 3D Logo" className="h-6 w-6 object-contain" />
            <span className="font-black text-slate-900">FinTell AI Legal Office</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            © 2026 FinTell. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
