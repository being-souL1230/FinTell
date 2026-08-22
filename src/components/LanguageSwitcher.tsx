"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Languages } from "lucide-react";
import { getLangFromCookie, LANG_COOKIE, LANGS, getLangInfo, t, type LangCode } from "@/lib/i18n";

export function useClientLang(): LangCode {
  const [lang, setLang] = useState<LangCode>("en");
  useEffect(() => {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([a-z]{2})`));
    const targetLang = getLangFromCookie(m?.[1]);
    const timer = setTimeout(() => {
      setLang(targetLang);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  return lang;
}

export function LanguageGate() {
  const router = useRouter();
  const [selected, setSelected] = useState<LangCode>("en");
  const [saving, setSaving] = useState(false);

  async function continueToSite(lang: LangCode) {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setSaving(false);
      }
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-none border border-slate-200/60 bg-white shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 pb-5 pt-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-transparent" />
          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-emerald-600 shadow-lg shadow-emerald-600/20">
              <Languages className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">Choose your language</h2>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              Pick your preferred language for a better learning experience. You can change it anytime.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-none bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              <Languages className="h-3 w-3" /> 11 languages
            </span>
          </div>
        </div>

        {/* Language grid */}
        <div className="max-h-[46vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANGS.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelected(lang.code)}
                  className={`group relative flex cursor-pointer items-center gap-2.5 rounded-none border-2 px-3 py-2.5 text-left transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/60 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-gradient-to-br text-[13px] font-bold text-white shadow-sm ${lang.color}`}
                  >
                    {lang.monogram}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold text-slate-900">{lang.nativeName}</span>
                    <span className="block truncate text-[10px] text-slate-400">{lang.englishName}</span>
                  </span>
                  {lang.popular && (
                    <span className="absolute right-2 top-1.5 rounded-none bg-amber-50 border border-amber-100 px-1 py-px text-[8px] font-bold uppercase tracking-wide text-amber-600">
                      Popular
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 shadow">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-[11px] text-slate-400">Selected:</span>
            <span className="truncate text-[13px] font-bold text-slate-800">{getLangInfo(selected).nativeName}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => continueToSite("en")}
              className="cursor-pointer rounded-none px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              Skip
            </button>
            <button
              onClick={() => continueToSite(selected)}
              disabled={saving}
              className="flex cursor-pointer items-center gap-1.5 rounded-none bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LanguageSwitcher({ current, compact = false }: { current: LangCode; compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function change(lang: LangCode) {
    if (lang === current) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const info = getLangInfo(current);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-none border border-slate-200 bg-white transition hover:bg-slate-50 ${
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"
        } font-semibold text-slate-600`}
      >
        <span className={`flex h-5 w-5 items-center justify-center rounded-none bg-gradient-to-br text-[10px] font-bold text-white ${info.color}`}>
          {info.monogram}
        </span>
        {!compact && <span>{info.nativeName}</span>}
        <Languages className="h-3 w-3 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-none border border-slate-200 bg-white p-1 shadow-xl animate-slide-up">
            <p className="px-2.5 pb-1 pt-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-300">
              {t(current, "common.selectLanguage")}
            </p>
            <div className="max-h-72 overflow-y-auto">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => change(lang.code)}
                  disabled={saving}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-none px-2.5 py-1.5 text-left text-xs transition ${
                    lang.code === current ? "bg-emerald-50 font-bold text-emerald-800" : "font-medium text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-none bg-gradient-to-br text-[10px] font-bold text-white ${lang.color}`}>
                    {lang.monogram}
                  </span>
                  <span className="flex-1 truncate">{lang.nativeName}</span>
                  {lang.code === current && <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
