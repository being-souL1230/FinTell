"use client";

import { useState } from "react";
import { Search, Bell, User, Building2, ChevronDown, Check } from "lucide-react";
import { useUserMode } from "@/components/ModeContext";
import { BrowserTranslateButton } from "@/components/BrowserTranslateButton";

export function Header({ userName, hasBusiness = false }: { userName: string; hasBusiness?: boolean }) {
  const { mode, setMode } = useUserMode();
  const [showNotifications, setShowNotifications] = useState(false);
  const [modeDropdown, setModeDropdown] = useState(false);

  const notifications = [
    { id: 1, title: "Duplicate payment detected", time: "10m ago", desc: "Electricity Bill - ₹1,250" },
    { id: 2, title: "GSTIN mismatch found", time: "2h ago", desc: "Invoice #INV-2387 mismatch" },
    { id: 3, title: "Large expense this week", time: "1d ago", desc: "Dining - ₹6,450" },
  ];

  return (
    <header className="sticky top-0 z-20 hidden lg:block border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar matching Slide 4 & 5 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, invoices, GSTIN, scams..."
            className="w-full rounded-none border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Right Section: Mode Switcher, Notifications, User Badge */}
        <div className="flex items-center gap-3">
          <BrowserTranslateButton compact />
          {/* Dual Persona Switcher (Personal / Business Mode) matching PDF Slide 4 & 5 */}
          {hasBusiness ? (
            <div className="relative">
              <button
                onClick={() => setModeDropdown(!modeDropdown)}
                className="flex items-center gap-2 rounded-none border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-100/80 cursor-pointer"
              >
                {mode === "personal" ? (
                  <>
                    <User className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Personal Mode</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Business Mode</span>
                  </>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-emerald-700" />
              </button>

              {modeDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-none border border-slate-200 bg-white p-1.5 shadow-xl">
                  <button
                    onClick={() => {
                      setMode("personal");
                      setModeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between rounded-none px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Personal User</p>
                        <p className="text-[10px] text-slate-400">Budget, savings &amp; literacy</p>
                      </div>
                    </div>
                    {mode === "personal" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setMode("business");
                      setModeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between rounded-none px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Business / GST Mode</p>
                        <p className="text-[10px] text-slate-400">Reconciliation &amp; Invoices</p>
                      </div>
                    </div>
                    {mode === "business" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-none border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-950">
              <User className="h-3.5 w-3.5 text-emerald-700" />
              <span>Personal Mode</span>
            </div>
          )}

          {/* Notifications Bell matching PDF Slide 4 */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-none border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-none border border-slate-200 bg-white p-3 shadow-xl z-30">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-900">Recent Alerts</h4>
                  <span className="rounded-none bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    3 New
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="rounded-none border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-slate-100/70 transition">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-extrabold text-emerald-800 text-xs shadow-xs">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{userName}</p>
              <p className="text-[10px] font-semibold text-emerald-700">Verified User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
