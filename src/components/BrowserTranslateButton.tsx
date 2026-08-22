"use client";

import { useEffect, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGS, type LangCode } from "@/lib/i18n";

export function BrowserTranslateButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LangCode>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject CSS to hide Google Translate banner, top bar offset, and tooltips
    if (!document.getElementById("google-translate-custom-style")) {
      const style = document.createElement("style");
      style.id = "google-translate-custom-style";
      style.innerHTML = `
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; position: static !important; }
        .skiptranslate:not(#google_translate_element) { display: none !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `;
      document.head.appendChild(style);
    }

    // Create hidden div for Google Translate
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      document.body.appendChild(div);
    }

    // Init script
    if (!document.getElementById("google-translate-script")) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Detect if Google Translate cookie is set
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/);
    if (match?.[1]) {
      const matched = LANGS.find((l) => l.code === match[1]);
      if (matched) setCurrentLang(matched.code);
    }
  }, []);

  function handleSelectLanguage(code: LangCode) {
    setCurrentLang(code);
    setOpen(false);

    // Update google translate combo
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = code;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      // Set cookie directly as fallback
      document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${code}; path=/`;
      window.location.reload();
    }
  }

  const selectedInfo = LANGS.find((l) => l.code === currentLang) || LANGS[1];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        title="Translate page with Google Translate"
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-900 transition ${
          compact ? "text-xs" : "text-xs font-medium"
        } text-slate-700`}
      >
        <Globe className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-800">{selectedInfo.nativeName}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl animate-fade-in">
            <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="h-3 w-3 text-emerald-600" /> Translate Page
              </span>
              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">
                11 Languages
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-0.5">
              {LANGS.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      isSelected
                        ? "bg-emerald-50 font-bold text-emerald-900"
                        : "font-medium text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-br text-[10px] font-black text-white shadow-2xs ${lang.color}`}
                    >
                      {lang.monogram}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900">{lang.nativeName}</p>
                      <p className="truncate text-[10px] text-slate-400">{lang.englishName}</p>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
