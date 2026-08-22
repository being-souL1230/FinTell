"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { BrowserTranslateButton } from "@/components/BrowserTranslateButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    setGuestLoading(true);
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#fcfdf6] px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-200/30">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <img src="/fintell-logo.png" alt="FinTell Logo" className="h-8 w-8 object-contain drop-shadow-xs" />
            <span className="text-lg font-black tracking-tight text-slate-900">FinTell</span>
          </div>
          <BrowserTranslateButton compact />
        </div>
        <h1 className="mt-6 text-lg font-bold text-slate-900">Create your account</h1>
        <p className="mt-0.5 text-sm text-slate-500">Start your financial literacy journey for free.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Kumar" required minLength={2} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] font-medium text-slate-400">or</span></div>
        </div>

        <button
          onClick={handleGuest}
          disabled={guestLoading}
          className="flex w-full items-center justify-center gap-2 rounded-none border border-slate-200 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer transition"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          {guestLoading ? "Loading..." : "Skip registration, explore as guest"}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-lime-700 hover:text-lime-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
