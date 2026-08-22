import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLangFromCookie, LANG_COOKIE, t, type LangCode } from "@/lib/i18n";
import { BrowserTranslateButton } from "@/components/BrowserTranslateButton";
import {
  BookOpen,
  Calculator,
  ShieldAlert,
  Bot,
  Trophy,
  Sparkles,
  ArrowRight,
  Check,
  Lock,
  Users,
  WalletCards,
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

function GuestAccessButton({ light = false }: { light?: boolean }) {
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
        className={`cursor-pointer rounded-none px-5 py-2.5 text-sm font-black transition shadow-sm ${
          light ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
        }`}
      >
        Continue as Guest
      </button>
    </form>
  );
}

function LandingContent({ lang }: { lang: LangCode }) {
  const tr = (key: string) => t(lang, key);

  const FEATURES = [
    { icon: BookOpen, title: tr("feat1.title"), desc: tr("feat1.desc") },
    { icon: Calculator, title: tr("feat2.title"), desc: tr("feat2.desc") },
    { icon: ShieldAlert, title: tr("feat3.title"), desc: tr("feat3.desc") },
    { icon: Bot, title: tr("feat4.title"), desc: tr("feat4.desc") },
    { icon: Lock, title: tr("feat5.title"), desc: tr("feat5.desc") },
    { icon: Trophy, title: tr("feat6.title"), desc: tr("feat6.desc") },
  ];

  const STEPS = [
    { step: "01", title: tr("step1.title"), desc: tr("step1.desc") },
    { step: "02", title: tr("step2.title"), desc: tr("step2.desc") },
    { step: "03", title: tr("step3.title"), desc: tr("step3.desc") },
  ];

  return (
    <main className="min-h-screen bg-[#fcfdf6]">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <img src="/fintell-logo.png" alt="FinTell Logo" className="h-9 w-9 object-contain drop-shadow-xs" />
          <span className="text-xl font-black tracking-tight text-slate-900">FinTell</span>
        </div>
        <nav className="flex items-center gap-3">
          <BrowserTranslateButton compact />
          <Link href="/login" className="rounded-md px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
            {tr("common.signIn")}
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-xs"
          >
            {tr("common.getStarted")}
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-100/80 px-3.5 py-1 text-xs font-bold text-lime-900 border border-lime-300">
            <Sparkles className="h-3.5 w-3.5 text-lime-800" />
            {tr("hero.badge")}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
            {tr("hero.title1")}
            <br />
            <span className="text-lime-600">{tr("hero.title2")}</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">{tr("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GuestAccessButton />
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-none border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              {tr("hero.ctaAccount")}
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-lime-600" /> {tr("hero.free")}</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-lime-600" /> {tr("hero.noBank")}</div>
            <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-lime-600" /> {tr("hero.guestAccess")}</div>
          </div>
        </div>

        {/* Preview card */}
        <div className="rounded-none border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tr("hero.quickAccess")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[
              { icon: BookOpen, label: "Bank Account" },
              { icon: ShieldAlert, label: "UPI Safety" },
              { icon: WalletCards, label: "My Money" },
              { icon: Lock, label: "Scam Safety" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-none bg-amber-50/30 border border-slate-100 px-3.5 py-3 text-sm font-bold text-slate-800">
                <Icon className="h-4 w-4 text-lime-700" strokeWidth={2} />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-none bg-lime-100/70 border border-lime-300/80 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-lime-900">{tr("hero.safetyScore")}</span>
              <span className="font-black text-lime-950">82 / 100</span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-lime-200">
              <div className="h-2 w-[82%] rounded-full bg-lime-500" />
            </div>
          </div>
          <div className="mt-4 rounded-none border border-dashed border-slate-200 p-4 text-xs text-slate-500">
            {tr("hero.continueLearning")}:
            <span className="ml-1 font-bold text-slate-800">How does UPI work?</span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="rounded-none border border-slate-200/80 bg-white p-6 text-center shadow-xs">
              <span className="text-xs font-black text-lime-700">{s.step}</span>
              <p className="mt-2 text-lg font-bold text-slate-900">{s.title}</p>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl font-extrabold text-slate-900">{tr("features.title")}</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm font-medium text-slate-500">{tr("features.subtitle")}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-none border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-lime-100/70 text-lime-800">
                <f.icon className="h-5 w-5 text-lime-700" strokeWidth={2} />
              </div>
              <p className="mt-4 text-sm font-extrabold text-slate-900">{f.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-none bg-slate-950 px-8 py-14 text-white shadow-xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{tr("cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">{tr("cta.subtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GuestAccessButton light />
            <Link
              href="/register"
              className="rounded-none border border-lime-500/40 bg-lime-500/10 px-6 py-2.5 text-sm font-extrabold text-lime-400 hover:bg-lime-500/20 transition"
            >
              {tr("cta.create")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        {tr("footer.note")}
      </footer>
    </main>
  );
}
