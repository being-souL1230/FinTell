import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { glossaryTerms, lessons, scamScenarios, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { BookMarked, ShieldAlert, FileText, UserSearch, Users, BookOpen, ChevronRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const LINKS = [
  {
    href: "/dashboard/admin/lessons",
    Icon: BookMarked,
    label: "Manage Lessons",
    desc: "Create, edit, or reorganize interactive lessons and quizzes.",
    badge: "Content CMS",
    color: "bg-lime-50 text-lime-800 border-lime-200",
  },
  {
    href: "/dashboard/admin/scams",
    Icon: ShieldAlert,
    label: "Manage Scam Scenarios",
    desc: "Update SMS, Call, WhatsApp and UPI scam drill scenarios.",
    badge: "Fraud Drills",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    href: "/dashboard/admin/glossary",
    Icon: FileText,
    label: "Manage Glossary",
    desc: "Financial terminology translator entries in 11 languages.",
    badge: "Translator",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    href: "/dashboard/admin/users",
    Icon: UserSearch,
    label: "Users & Analytics",
    desc: "Inspect user progress, safety score averages, and weak topics.",
    badge: "Analytics",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [[{ count: totalUsers }], [{ count: totalLessons }], [{ count: totalScams }], [{ count: totalTerms }]] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db.select({ count: sql<number>`count(*)::int` }).from(lessons),
      db.select({ count: sql<number>`count(*)::int` }).from(scamScenarios),
      db.select({ count: sql<number>`count(*)::int` }).from(glossaryTerms),
    ]);

  return (
    <div className="space-y-6">
      {/* Admin Hero Header with Integrated System Stats */}
      <div className="relative overflow-hidden rounded-none bg-gradient-to-br from-amber-50/60 via-lime-50/40 to-white p-6 sm:p-8 border border-lime-200/80 shadow-sm">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-none bg-lime-100 text-lime-800 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Admin &amp; Content Management</h1>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500">Central control portal for FinTell content &amp; user records.</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-lime-200/80 px-3.5 py-1 text-xs font-black text-slate-950 border border-lime-300">
              Admin Access Active
            </span>
          </div>

          {/* Integrated System Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-none bg-white p-4 border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Users</p>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">{totalUsers}</p>
            </div>
            <div className="rounded-none bg-white p-4 border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lessons Live</p>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-lime-700">{totalLessons}</p>
            </div>
            <div className="rounded-none bg-white p-4 border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scam Scenarios</p>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-red-600">{totalScams}</p>
            </div>
            <div className="rounded-none bg-white p-4 border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Glossary Terms</p>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-600">{totalTerms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Master Management List Card */}
      <div className="overflow-hidden rounded-none border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">CMS &amp; Admin Modules</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-4 p-6 transition hover:bg-slate-50/80"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white shadow-xs">
                  <l.Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">{l.label}</h3>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${l.color}`}>
                      {l.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{l.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block text-xs font-bold text-emerald-600 group-hover:underline">Open module</span>
                <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-emerald-600 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
