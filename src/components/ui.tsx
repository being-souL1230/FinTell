"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import {
  Loader2, ChevronDown, Landmark, Receipt, Smartphone, CreditCard,
  PiggyBank, TrendingUp, Home, ShieldCheck, Trophy, Award, Star, Crown,
  Zap, Flame, Sparkles, Lightbulb, BookOpen, Lock, Calculator, User,
  Coins, FileText, ShieldAlert
} from "lucide-react";

/** Maps any emoji or icon key string to a premium vector Lucide icon. */
export function DynamicIcon({
  name,
  className = "h-5 w-5",
}: {
  name?: string | null;
  className?: string;
}) {
  if (!name) return <BookOpen className={className} />;

  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    "🏦": Landmark,
    "🧾": Receipt,
    "📱": Smartphone,
    "💳": CreditCard,
    "💰": PiggyBank,
    "📈": TrendingUp,
    "🏠": Home,
    "🛡️": ShieldCheck,
    "🏅": Trophy,
    "📘": BookOpen,
    "⭐": Star,
    "👑": Crown,
    "⚡": Zap,
    "🔥": Flame,
    "👋": Sparkles,
    "💡": Lightbulb,
    "🔒": Lock,
    "🧮": Calculator,
    "🙋‍♂️": User,
    "💸": Coins,
    "📜": FileText,
  };

  const IconComp = map[name] ?? BookOpen;
  return <IconComp className={className} />;
}

/* ---------------- Buttons ---------------- */

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap";
  const variants: Record<string, string> = {
    primary: "bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-sm shadow-lime-500/20 rounded-none font-extrabold",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-none",
    ghost: "text-slate-600 hover:bg-lime-50/80 hover:text-slate-900 rounded-none",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-none",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-lime-50/50 shadow-xs rounded-none",
  };
  const sizes: Record<string, string> = {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3.5 py-2 text-xs",
    md: "px-4.5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

/* ---------------- Surfaces ---------------- */

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-none border border-slate-200/80 bg-white shadow-xs transition-all duration-200 ${pad ? "p-5 sm:p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
      {icon}
      {children}
    </div>
  );
}

/** Single merged stat strip with clear vertical dividers and proper spacing. */
export function StatStrip({
  items,
  className = "",
}: {
  items: { label: string; value: ReactNode; hint?: string; tone?: "default" | "good" | "warn" | "bad" }[];
  className?: string;
}) {
  const tones = {
    default: "text-slate-900",
    good: "text-lime-700",
    warn: "text-amber-600",
    bad: "text-red-600",
  };
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 rounded-none bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs ${className}`}>
      {items.map((it, idx) => (
        <div key={it.label} className={`px-4 py-2 sm:py-0 ${idx === 0 ? "sm:pl-0" : ""} ${idx === items.length - 1 ? "sm:pr-0" : ""}`}>
          <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">{it.label}</p>
          <p className={`mt-1 truncate text-xl sm:text-2xl font-extrabold tabular-nums leading-tight ${tones[it.tone ?? "default"]}`}>{it.value}</p>
          {it.hint && <p className="truncate text-[11px] font-medium text-slate-500">{it.hint}</p>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Inputs ---------------- */

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-none border border-slate-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-lime-500 focus:outline-none focus:ring-4 focus:ring-lime-500/20 shadow-xs transition ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-none border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-lime-500 focus:outline-none focus:ring-4 focus:ring-lime-500/20 shadow-xs transition ${props.className ?? ""}`}
    />
  );
}

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</label>
      {hint && <span className="text-xs tabular-nums text-slate-400">{hint}</span>}
    </div>
  );
}

/** Labeled slider with live value and range. */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  marks,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  marks?: string[];
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
        <span className="text-sm font-bold tabular-nums text-slate-900">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-lime-500 [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-lime-500"
        style={{ background: `linear-gradient(to right, #84cc16 ${pct}%, #f1f5f9 ${pct}%)` }}
      />
      {marks && (
        <div className="mt-1 flex justify-between text-xs font-medium text-slate-400">
          {marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

/* ---------------- Data display ---------------- */

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-600 border border-slate-200/60",
    success: "bg-lime-100 text-lime-900 border border-lime-300/80 font-extrabold",
    warning: "bg-amber-100 text-amber-900 border border-amber-300/80 font-extrabold",
    danger: "bg-red-50 text-red-700 border border-red-200/60",
    info: "bg-sky-50 text-sky-700 border border-sky-200/60",
  };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className = "", tone = "emerald" }: { value: number; className?: string; tone?: "emerald" | "amber" | "slate" }) {
  const clamped = Math.min(100, Math.max(0, value));
  const tones = { emerald: "bg-lime-500", amber: "bg-amber-500", slate: "bg-slate-300" };
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className={`h-full rounded-full ${tones[tone]} transition-all duration-500`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** Stacked bar for principal vs interest style splits. */
export function SplitBar({ parts }: { parts: { value: number; label: string; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {parts.map((p) => (
          <div key={p.label} className={p.color} style={{ width: `${(p.value / total) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {parts.map((p) => (
          <span key={p.label} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className={`h-2 w-2 rounded-full ${p.color}`} />
            {p.label} <span className="font-bold tabular-nums text-slate-800">{Math.round((p.value / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-none border border-dashed border-slate-200 bg-amber-50/20 px-6 py-12 text-center">
      {icon && <div className="text-slate-400">{icon}</div>}
      <p className="text-sm font-bold text-slate-700">{title}</p>
      {description && <p className="max-w-xs text-xs text-slate-500">{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`h-4 w-4 animate-spin text-lime-600 ${className}`} />;
}

export function Alert({ tone = "info", children }: { tone?: "info" | "success" | "danger" | "warning"; children: ReactNode }) {
  const tones: Record<string, string> = {
    info: "bg-sky-50 border-sky-200/80 text-sky-900",
    success: "bg-lime-50 border-lime-200/80 text-lime-900 font-medium",
    danger: "bg-red-50 border-red-200/80 text-red-900",
    warning: "bg-amber-50 border-amber-200/80 text-amber-900",
  };
  return <div className={`rounded-none border px-4 py-3 text-xs sm:text-sm leading-relaxed ${tones[tone]}`}>{children}</div>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Collapsible panel for dense tables. */
export function Collapse({ title, children, defaultOpen = false, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: string }) {
  return (
    <details open={defaultOpen} className="group rounded-none border border-slate-200/80 bg-white overflow-hidden shadow-xs">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-lime-50/40">
        <span className="flex items-center gap-2.5">
          {title}
          {badge && <Pill tone="neutral">{badge}</Pill>}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 p-4 sm:p-5">{children}</div>
    </details>
  );
}

/** Data table. */
export function DataTable<T>({
  head,
  rows,
  foot,
}: {
  head: string[];
  rows: T[];
  foot?: string[];
}) {
  return (
    <div className="overflow-x-auto rounded-none border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-amber-50/30 border-b border-slate-200/80">
          <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {head.map((h, i) => (
              <th key={h} className={`py-3 px-4 ${i === head.length - 1 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="text-slate-700 hover:bg-lime-50/40 transition-colors">
              {(r as (string | number)[]).map((c, j) => (
                <td key={j} className={`py-3 px-4 tabular-nums ${j === (r as unknown[]).length - 1 ? "text-right font-bold text-slate-900" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot className="bg-amber-50/30 border-t border-slate-200/80">
            <tr className="font-bold text-slate-900">
              {foot.map((f, i) => (
                <td key={i} className={`py-3 px-4 tabular-nums ${i === foot.length - 1 ? "text-right" : ""}`}>
                  {f}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
