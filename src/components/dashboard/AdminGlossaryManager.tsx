"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Input, Label, Textarea } from "@/components/ui";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";

type Term = { id: number; term: string; simpleMeaning: string; usedFor: string; category: string };

const emptyForm = { term: "", simpleMeaning: "", usedFor: "", category: "general" };

export function AdminGlossaryManager({ initialTerms }: { initialTerms: Term[] }) {
  const [terms, setTerms] = useState(initialTerms);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForm() { setForm(emptyForm); setEditingId(null); setShowForm(false); }
  function editTerm(t: Term) { setForm(t); setEditingId(t.id); setShowForm(true); }

  async function submit() {
    setError(null); setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/glossary/${editingId}` : "/api/glossary", {
        method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      if (editingId) setTerms((p) => p.map((t) => (t.id === editingId ? data.term : t)));
      else setTerms((p) => [...p, data.term].sort((a, b) => a.term.localeCompare(b.term)));
      resetForm();
    } finally { setSaving(false); }
  }

  async function deleteTerm(id: number) {
    if (!confirm("Are you sure you want to delete this term?")) return;
    const prev = terms; setTerms((p) => p.filter((t) => t.id !== id));
    const res = await fetch(`/api/glossary/${id}`, { method: "DELETE" });
    if (!res.ok) setTerms(prev);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{terms.length} terms</p>
        <Button size="sm" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? "Cancel" : <><Plus className="h-3 w-3" /> New Term</>}
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Term</Label><Input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="IFSC" /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          </div>
          <div><Label>Simple Meaning</Label><Textarea rows={2} value={form.simpleMeaning} onChange={(e) => setForm({ ...form, simpleMeaning: e.target.value })} /></div>
          <div><Label>Used For</Label><Textarea rows={2} value={form.usedFor} onChange={(e) => setForm({ ...form, usedFor: e.target.value })} /></div>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : editingId ? "Update Term" : "Create Term"}</Button>
        </Card>
      )}

      {terms.length === 0 ? (
        <EmptyState icon={<FileText className="h-8 w-8" />} title="No terms yet" />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">{terms.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">{t.term}</p>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => editTerm(t)}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteTerm(t.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">{t.simpleMeaning}</p>
          </Card>
        ))}</div>
      )}
    </div>
  );
}
