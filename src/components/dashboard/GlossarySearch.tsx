"use client";

import { useMemo, useState } from "react";
import { Card, CardLabel, EmptyState, Input, Pill } from "@/components/ui";
import { Search, Languages } from "lucide-react";

type Term = { id: number; term: string; simpleMeaning: string; usedFor: string; category: string };

export function GlossarySearch({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.simpleMeaning.toLowerCase().includes(q) ||
        t.usedFor.toLowerCase().includes(q),
    );
  }, [terms, query]);

  // Group terms by category into one compact panel each
  const grouped = useMemo(() => {
    const map = new Map<string, Term[]>();
    for (const t of filtered) {
      const list = map.get(t.category) ?? [];
      list.push(t);
      map.set(t.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search any banking term, e.g. IFSC, EMI, KYC"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Languages className="h-7 w-7" />} title="No matching term" description="Try a different word or ask the AI assistant." />
      ) : (
        <div className="space-y-3">
          {grouped.map(([cat, catTerms]) => (
            <Card key={cat} pad={false}>
              <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2">
                <CardLabel>{cat}</CardLabel>
                <span className="text-[10px] font-semibold tabular-nums text-slate-400">{catTerms.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {catTerms.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(active === t.term ? null : t.term)}
                    className="w-full cursor-pointer px-3.5 py-2 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900">{t.term}</p>
                      {active === t.term && <Pill tone="info">open</Pill>}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                      <span className="font-semibold text-emerald-700">Meaning: </span>
                      {t.simpleMeaning}
                    </p>
                    {active === t.term && (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                        <span className="font-semibold text-slate-500">Used for: </span>
                        {t.usedFor}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
