"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Input, Pill, Spinner, SectionHeader } from "@/components/ui";
import { Send, Bot, User, Lock } from "lucide-react";
import { FormattedMarkdown } from "@/components/FormattedMarkdown";

type Message = { role: "user" | "assistant"; text: string; source?: string };

const SUGGESTIONS = [
  "What is an EMI?",
  "What is a Fixed Deposit?",
  "When should I enter my UPI PIN?",
  "Why should I never share my OTP?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Welcome! I am FinTell's AI Learning Assistant. Ask me anything about banking and finance in simple language. I will never ask for your OTP, PIN, or password.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/ai/ask")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.logs) && data.logs.length) {
          const history: Message[] = data.logs.flatMap((l: { question: string; answer: string; source: string }) => [
            { role: "user" as const, text: l.question },
            { role: "assistant" as const, text: l.answer, source: l.source },
          ]);
          setMessages((prev) => [...prev, ...history]);
        }
      })
      .catch(() => {});
  }, []);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer ?? "Something went wrong. Please try again.", source: data.source },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-2xl flex-col gap-4 animate-fade-in">
      <SectionHeader title="AI Financial Learning Assistant" subtitle="Explains concepts, never gives personalized advice." />

      <Alert tone="info">
        <span className="flex items-center gap-1.5">
          <Lock className="h-3 w-3 shrink-0" />
          I never ask for or accept OTP, PIN, CVV, or passwords. I provide educational information only.
        </span>
      </Alert>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-none border border-slate-200/80 bg-white p-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {m.role === "assistant" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-emerald-50 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-none px-4 py-2.5 text-xs leading-relaxed ${
                m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800 border border-slate-200/80"
              }`}
            >
              {m.role === "assistant" ? <FormattedMarkdown content={m.text} /> : m.text}
              {m.source === "llm" && <Pill tone="info" className="mt-1 align-middle">AI</Pill>}
            </div>
            {m.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-slate-100 mt-0.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-none bg-emerald-50">
              <Bot className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 rounded-none bg-slate-50 px-4 py-2.5 text-xs text-slate-400">
              <Spinner className="h-3 w-3" /> Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="cursor-pointer rounded-none border border-slate-100 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your question..." />
        <Button type="submit" disabled={loading || !input.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
