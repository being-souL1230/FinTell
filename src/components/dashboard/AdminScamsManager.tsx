"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Input, Label, Pill, Textarea } from "@/components/ui";
import { ShieldAlert, Plus, Pencil, Trash2, Sparkles, MessageSquare, AlertTriangle } from "lucide-react";

type Scenario = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  channel: string;
  message: string;
  context: string | null;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  safetyLesson: string;
};

const emptyForm = {
  title: "",
  category: "UPI Fraud",
  difficulty: "easy",
  channel: "SMS",
  message: "",
  context: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  explanation: "",
  safetyLesson: "",
};

export function AdminScamsManager({ initialScenarios }: { initialScenarios: Scenario[] }) {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function editScenario(s: Scenario) {
    setForm({ ...s, context: s.context ?? "" });
    setEditingId(s.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateOption(idx: number, value: string) {
    const o = [...form.options];
    o[idx] = value;
    setForm({ ...form, options: o });
  }

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const payload = { ...form, options: form.options.filter((o) => o.trim().length > 0) };
      const res = await fetch(editingId ? `/api/scams/${editingId}` : "/api/scams", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (editingId) setScenarios((p) => p.map((s) => (s.id === editingId ? data.scenario : s)));
      else setScenarios((p) => [...p, data.scenario]);
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function deleteScenario(id: number) {
    if (!confirm("Are you sure you want to delete this scenario?")) return;
    const prev = scenarios;
    setScenarios((p) => p.filter((s) => s.id !== id));
    const res = await fetch(`/api/scams/${id}`, { method: "DELETE" });
    if (!res.ok) setScenarios(prev);
  }

  return (
    <div className="space-y-5">
      {/* 🌟 EXECUTIVE MASTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-none bg-gradient-to-br from-amber-50/60 via-lime-50/40 to-white p-5 border border-lime-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-none bg-red-100 text-red-600 shadow-xs">
            <ShieldAlert className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Scam Scenario Drills Manager</h2>
            <p className="text-xs text-slate-500">{scenarios.length} active fraud detection drills published</p>
          </div>
        </div>

        <Button size="sm" onClick={() => (showForm ? resetForm() : setShowForm(true))} className="shadow-xs">
          {showForm ? "Cancel Form" : <><Plus className="h-3.5 w-3.5" /> Create New Drill</>}
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-4 border-lime-200 bg-amber-50/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-lime-700" />
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingId ? "Edit Scam Scenario" : "Create Fraud Detection Drill"}
              </h3>
            </div>
            <Pill tone="info">{editingId ? `Editing ID #${editingId}` : "Draft Mode"}</Pill>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Scam Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Fake Electricity Bill Disconnection"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Utility Bill Scam"
              />
            </div>
            <div>
              <Label>Channel</Label>
              <select
                className="w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800"
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
              >
                <option value="SMS">SMS / Text Message</option>
                <option value="WhatsApp">WhatsApp Message</option>
                <option value="Call">Phone Call</option>
                <option value="UPI">UPI Request</option>
              </select>
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <select
                className="w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Scam Message Text</Label>
            <Textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="e.g. Dear consumer electricity will be disconnected tonight by 9:30 PM..."
            />
          </div>

          <div>
            <Label>Options (Radio Select Correct Safe Response)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-none border border-slate-200 bg-white p-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={form.correctOptionIndex === idx}
                    onChange={() => setForm({ ...form, correctOptionIndex: idx })}
                    className="accent-lime-600 h-4 w-4"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="border-none shadow-none focus:ring-0 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Explanation</Label>
              <Textarea
                rows={2}
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                placeholder="Why the correct option is safe..."
              />
            </div>
            <div>
              <Label>Safety Lesson</Label>
              <Textarea
                rows={2}
                value={form.safetyLesson}
                onChange={(e) => setForm({ ...form, safetyLesson: e.target.value })}
                placeholder="Key rule to remember (e.g., Electricity boards never send personal UPI handles)..."
              />
            </div>
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button variant="outline" size="sm" onClick={resetForm}>
              Cancel
            </Button>
            <Button size="sm" onClick={submit} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Scenario" : "Publish Scenario"}
            </Button>
          </div>
        </Card>
      )}

      {scenarios.length === 0 ? (
        <EmptyState icon={<ShieldAlert className="h-8 w-8" />} title="No scenarios yet" description="Create your first scam scenario drill above." />
      ) : (
        <div className="space-y-3">
          {scenarios.map((s) => (
            <Card key={s.id} pad={false} className="overflow-hidden">
              <div className="flex items-center justify-between p-4 sm:px-5 hover:bg-slate-50/40 transition">
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-red-100 text-red-600 shadow-xs">
                    <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-extrabold text-slate-900">{s.title}</h3>
                      <Pill tone="danger">{s.channel}</Pill>
                    </div>
                    <p className="truncate text-[11px] text-slate-500 mt-0.5">
                      Category: <span className="font-semibold text-slate-700">{s.category}</span> &bull; Difficulty: <span className="font-semibold text-slate-700">{s.difficulty}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => editScenario(s)}
                    className="inline-flex items-center justify-center rounded-none border border-slate-200 bg-white p-2 text-slate-600 hover:bg-lime-50 hover:text-slate-900 transition cursor-pointer"
                    title="Edit Drill"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => deleteScenario(s.id)}
                    className="inline-flex items-center justify-center rounded-none border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition cursor-pointer"
                    title="Delete Drill"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
