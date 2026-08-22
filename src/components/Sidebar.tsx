"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  ShieldAlert,
  Languages,
  Bot,
  Trophy,
  WalletCards,
  Settings,
  BookMarked,
  UserSearch,
  FileText,
  LogOut,
  Menu,
  X,
  Languages as LanguagesIcon,
  FileSearch,
  Scale,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { LANGS, t, type LangCode } from "@/lib/i18n";
import { useClientLang } from "@/components/LanguageSwitcher";

function navLabel(lang: LangCode, key: string) {
  return t(lang, key);
}

export function Sidebar({ isAdmin, name, hasBusiness = false }: { isAdmin: boolean; name: string; hasBusiness?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useClientLang();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const NAV_ITEMS = [
    { href: "/dashboard", label: navLabel(lang, "nav.dashboard"), icon: LayoutDashboard, imgSrc: "/sidebar-icons/fintell-icon-dashboard.webp", exact: true },
    { href: "/dashboard/money", label: navLabel(lang, "nav.money"), icon: WalletCards, imgSrc: "/sidebar-icons/budget-and-money.webp" },
    { href: "/dashboard/learn", label: navLabel(lang, "nav.learn"), icon: BookOpen, imgSrc: "/sidebar-icons/learn-and-ai.webp" },
    { href: "/dashboard/verify", label: navLabel(lang, "nav.verify"), icon: FileSearch, imgSrc: "/sidebar-icons/verify-docs.webp" },
    { href: "/dashboard/reconcile", label: navLabel(lang, "nav.reconcile"), icon: Scale, imgSrc: "/sidebar-icons/reconcile-and-gst.webp" },
    { href: "/dashboard/invest", label: navLabel(lang, "nav.invest"), icon: ShieldCheck, imgSrc: "/sidebar-icons/invest-and-safety.webp" },
    { href: "/dashboard/reports", label: navLabel(lang, "nav.reports"), icon: BarChart3, imgSrc: "/sidebar-icons/reports.webp" },
    { href: "/dashboard/assistant", label: navLabel(lang, "nav.aiAssistant"), icon: Bot, imgSrc: "/sidebar-icons/ai-assistant.webp" },
    { href: "/dashboard/scams", label: navLabel(lang, "nav.scamSafety"), icon: ShieldAlert, imgSrc: "/sidebar-icons/fintell-color-icon-scam-safety.webp" },
    { href: "/dashboard/simulator", label: navLabel(lang, "nav.simulator"), icon: Calculator, imgSrc: "/sidebar-icons/fintell-color-icon-simulator.webp" },
    { href: "/dashboard/glossary", label: navLabel(lang, "nav.termTranslator"), icon: Languages, imgSrc: "/sidebar-icons/fintell-color-icon-term-translator.webp" },
    { href: "/dashboard/progress", label: navLabel(lang, "nav.myProgress"), icon: Trophy, imgSrc: "/sidebar-icons/fintell-color-icon-my-progress.webp" },
  ];

  const displayNavItems = hasBusiness
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => !["/dashboard/verify", "/dashboard/reconcile", "/dashboard/reports"].includes(item.href));

  const ADMIN_ITEMS = [
    { href: "/dashboard/admin", label: navLabel(lang, "nav.admin"), icon: Settings, imgSrc: "/sidebar-icons/fintell-color-icon-admin.webp", exact: true },
    { href: "/dashboard/admin/lessons", label: navLabel(lang, "nav.adminLessons"), icon: BookMarked, imgSrc: "/sidebar-icons/fintell-color-icon-manage-lessons.webp" },
    { href: "/dashboard/admin/scams", label: navLabel(lang, "nav.adminScams"), icon: ShieldAlert, imgSrc: "/sidebar-icons/fintell-color-icon-manage-scams.webp" },
    { href: "/dashboard/admin/glossary", label: navLabel(lang, "nav.adminGlossary"), icon: FileText, imgSrc: "/sidebar-icons/fintell-color-icon-manage-glossary.webp" },
    { href: "/dashboard/admin/users", label: navLabel(lang, "nav.adminUsers"), icon: UserSearch, imgSrc: "/sidebar-icons/fintell-color-icon-users-analytics.webp" },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (err) {
      alert("An error occurred while deleting your account.");
    } finally {
      setDeletingAccount(false);
    }
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-emerald-100/80 bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-transparent">
        <img
          src="/images/fintell-logo-mark-3d.png"
          alt="FinTell Logo"
          className="h-9 w-9 object-contain drop-shadow-sm"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">FinTell</span>
            <span className="rounded-none bg-emerald-100 px-1 py-0.5 text-[9px] font-black text-emerald-800 uppercase">AI</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">Financial Guardian</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-4">
        {displayNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-none px-3.5 py-2.5 text-sm font-bold transition-all duration-150 ${
                active
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-emerald-50/60 hover:text-slate-900"
              }`}
            >
              {item.imgSrc ? (
                <img
                  src={item.imgSrc}
                  alt={item.label}
                  className={`h-5 w-5 shrink-0 object-contain transition-transform ${active ? "brightness-125 scale-110" : "opacity-90 hover:scale-105"}`}
                />
              ) : (
                <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              )}
              {item.label}
            </Link>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3 border-t border-slate-100 mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Controls</span>
            </div>
            {ADMIN_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-none px-3.5 py-2.5 text-sm font-bold transition-all duration-150 ${
                    active
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.imgSrc ? (
                    <img
                      src={item.imgSrc}
                      alt={item.label}
                      className={`h-5 w-5 shrink-0 object-contain transition-transform ${active ? "brightness-125 scale-110" : "opacity-90 hover:scale-105"}`}
                    />
                  ) : (
                    <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-100 p-4 bg-emerald-50/20 space-y-2">
        <div className="flex items-center justify-between">
          <p className="truncate text-xs font-bold text-slate-800">{name}</p>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">Active</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-1.5 rounded-none border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 cursor-pointer transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-none border border-red-200 bg-red-50/50 py-2 text-xs font-bold text-red-700 hover:bg-red-100 hover:border-red-300 cursor-pointer transition"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/80 bg-white lg:block">
        {content}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/fintell-logo-mark-3d.png"
            alt="FinTell Logo"
            className="h-8 w-8 object-contain drop-shadow-sm"
          />
          <span className="text-base font-extrabold text-slate-900">FinTell</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-none border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-none p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-none border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Your Account?</h3>
                <p className="text-xs text-slate-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed rounded-none border border-red-100 bg-red-50/50 p-3">
              All your account data, financial progress, budget profiles, completed lessons, scam safety attempts, and earned badges will be <strong>permanently deleted</strong>.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
                className="flex-1 rounded-none border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex-1 rounded-none border border-red-600 bg-red-600 py-2.5 text-xs font-black text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer transition shadow-xs"
              >
                {deletingAccount ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
