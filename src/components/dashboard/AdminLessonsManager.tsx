"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Alert, Button, Card, DynamicIcon, EmptyState, Input, Label, Pill, Textarea } from "@/components/ui";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Target,
  Lightbulb,
  Eye,
  Info,
} from "lucide-react";

type Lesson = {
  id: number;
  slug: string;
  title: string;
  category: string;
  icon: string;
  difficulty: string;
  summary: string;
  whyItMatters: string;
  explanation: string;
  example: string;
  commonMistake: string;
  safetyTip: string;
  orderIndex: number;
};

type Question = {
  id: number;
  lessonId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "a" | "b" | "c" | "d";
  explanation: string;
  orderIndex: number;
};

const emptyForm = {
  slug: "",
  title: "",
  category: "Banking Basics",
  icon: "🏦",
  difficulty: "easy",
  summary: "",
  whyItMatters: "",
  explanation: "",
  example: "",
  commonMistake: "",
  safetyTip: "",
};

const emptyQ = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "a" as "a" | "b" | "c" | "d",
  explanation: "",
};

const ICON_PRESETS = [
  { label: "Bank (🏦)", value: "🏦" },
  { label: "IFSC/Receipt (🧾)", value: "🧾" },
  { label: "UPI/Phone (📱)", value: "📱" },
  { label: "Debit Card (💳)", value: "💳" },
  { label: "Savings (💰)", value: "💰" },
  { label: "FD/Invest (📈)", value: "📈" },
  { label: "Loans (🏠)", value: "🏠" },
  { label: "Insurance (🛡️)", value: "🛡️" },
  { label: "Security (🔒)", value: "🔒" },
];

export function AdminLessonsManager({ initialLessons }: { initialLessons: Lesson[] }) {
  const [lessons, setLessons] = useState(initialLessons);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [infoOpenId, setInfoOpenId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [qForm, setQForm] = useState(emptyQ);
  const [addingQFor, setAddingQFor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Lock background scrolling when modal is active
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setStep(1);
    setError(null);
  }

  function openCreateModal() {
    setForm(emptyForm);
    setEditingId(null);
    setStep(1);
    setError(null);
    setShowForm(true);
  }

  function openEditModal(l: Lesson) {
    setForm({ ...l });
    setEditingId(l.id);
    setStep(1);
    setError(null);
    setShowForm(true);
  }

  function handleTitleChange(val: string) {
    if (!editingId) {
      const slugified = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((f) => ({ ...f, title: val, slug: slugified }));
    } else {
      setForm((f) => ({ ...f, title: val }));
    }
  }

  async function submitLesson() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/lessons/${editingId}` : "/api/lessons", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (editingId) setLessons((p) => p.map((l) => (l.id === editingId ? data.lesson : l)));
      else setLessons((p) => [...p, data.lesson]);
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson(id: number) {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const prev = lessons;
    setLessons((p) => p.filter((l) => l.id !== id));
    const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    if (!res.ok) setLessons(prev);
  }

  async function toggleExpand(lesson: Lesson) {
    if (expandedId === lesson.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(lesson.id);
    if (!questions[lesson.id]) {
      const res = await fetch(`/api/lessons/${lesson.id}`);
      const data = await res.json();
      setQuestions((prev) => ({ ...prev, [lesson.id]: data.questions ?? [] }));
    }
  }

  function toggleInfo(id: number) {
    setInfoOpenId((prev) => (prev === id ? null : id));
  }

  async function addQuestion(lessonId: number) {
    if (!qForm.question.trim()) return;
    const res = await fetch("/api/quiz-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...qForm, lessonId }),
    });
    const data = await res.json();
    if (res.ok) {
      setQuestions((p) => ({ ...p, [lessonId]: [...(p[lessonId] ?? []), data.question] }));
      setQForm(emptyQ);
      setAddingQFor(null);
    }
  }

  async function deleteQuestion(lessonId: number, questionId: number) {
    const prev = questions[lessonId] ?? [];
    setQuestions((p) => ({ ...p, [lessonId]: prev.filter((q) => q.id !== questionId) }));
    const res = await fetch(`/api/quiz-questions/${questionId}`, { method: "DELETE" });
    if (!res.ok) setQuestions((p) => ({ ...p, [lessonId]: prev }));
  }

  return (
    <div className="space-y-5">
      {/* 🌟 EXECUTIVE MASTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-none bg-gradient-to-br from-amber-50/60 via-lime-50/40 to-white p-5 border border-lime-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-none bg-lime-100 text-lime-800 shadow-xs">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Interactive Lessons Manager</h2>
            <p className="text-xs text-slate-500">{lessons.length} live curriculum lessons published</p>
          </div>
        </div>

        <Button size="sm" onClick={openCreateModal} className="shadow-xs">
          <Plus className="h-3.5 w-3.5" /> Create New Lesson
        </Button>
      </div>

      {/* 🏙️ PERFECTLY CENTERED MULTI-STEP DIALOG MODAL */}
      {showForm &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) resetForm();
            }}
          >
            <div className="relative w-full max-w-xl rounded-none border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-none bg-lime-500 text-slate-950 font-black shadow-xs">
                    <DynamicIcon name={form.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {editingId ? `Edit Lesson #${editingId}` : "Create New Interactive Lesson"}
                    </h3>
                    <p className="text-[11px] font-bold text-lime-700">
                      Step {step} of 3 &bull; {step === 1 ? "Basic Details" : step === 2 ? "Lesson Content" : "Safety Rules & Finish"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="rounded-none p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                  title="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-xs font-black ${
                      step === 1 ? "bg-lime-500 text-slate-950" : step > 1 ? "bg-lime-100 text-lime-900" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-xs font-bold ${step === 1 ? "text-slate-900" : "text-slate-500"}`}>Basic Details</span>
                </div>
                <div className="h-0.5 w-8 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-xs font-black ${
                      step === 2 ? "bg-lime-500 text-slate-950" : step > 2 ? "bg-lime-100 text-lime-900" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-xs font-bold ${step === 2 ? "text-slate-900" : "text-slate-500"}`}>Content</span>
                </div>
                <div className="h-0.5 w-8 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-xs font-black ${
                      step === 3 ? "bg-lime-500 text-slate-950" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    3
                  </span>
                  <span className={`text-xs font-bold ${step === 3 ? "text-slate-900" : "text-slate-500"}`}>Safety &amp; Save</span>
                </div>
              </div>

              {/* Modal Internal Content Area (Scrolls cleanly) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* STEP 1: Basic Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Lesson Title</Label>
                        <Input
                          value={form.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. How Banking Works"
                        />
                      </div>
                      <div>
                        <Label>URL Slug</Label>
                        <Input
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          placeholder="how-banking-works"
                          disabled={!!editingId}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          placeholder="Banking Basics"
                        />
                      </div>
                      <div>
                        <Label>Vector Icon Symbol</Label>
                        <select
                          className="w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 focus:border-lime-500"
                          value={form.icon}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        >
                          {ICON_PRESETS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Difficulty Level</Label>
                      <div className="flex gap-2">
                        {["easy", "medium", "advanced"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setForm({ ...form, difficulty: d })}
                            className={`flex-1 rounded-none border py-2 text-xs font-bold capitalize transition cursor-pointer ${
                              form.difficulty === d
                                ? "border-lime-500 bg-lime-100/80 text-lime-900"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Short Summary</Label>
                      <Textarea
                        rows={3}
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        placeholder="Clear 1-2 sentence overview for learners..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Content Breakdown */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label hint="Why should learners care about this topic?">Why Does This Matter?</Label>
                      <Textarea
                        rows={3}
                        value={form.whyItMatters}
                        onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })}
                        placeholder="Explain the real-world benefit..."
                      />
                    </div>

                    <div>
                      <Label hint="Break down concepts into simple words">Simple Explanation</Label>
                      <Textarea
                        rows={4}
                        value={form.explanation}
                        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                        placeholder="Use straightforward Hindi/English vocabulary..."
                      />
                    </div>

                    <div>
                      <Label hint="Provide a practical relatable situation">Real-Life Example</Label>
                      <Textarea
                        rows={3}
                        value={form.example}
                        onChange={(e) => setForm({ ...form, example: e.target.value })}
                        placeholder="e.g. Priya receives a salary SMS and checks her bank balance..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Safety Tips & Review */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label hint="What error do beginners make?">Common Mistake</Label>
                      <Textarea
                        rows={3}
                        value={form.commonMistake}
                        onChange={(e) => setForm({ ...form, commonMistake: e.target.value })}
                        placeholder="Sharing PINs or clicking unverified links..."
                      />
                    </div>
                    <div>
                      <Label hint="Golden safety rule to remember">Safety Tip</Label>
                      <Textarea
                        rows={3}
                        value={form.safetyTip}
                        onChange={(e) => setForm({ ...form, safetyTip: e.target.value })}
                        placeholder="Banks never ask for OTPs or passwords over phone..."
                      />
                    </div>

                    {/* Summary Card */}
                    <div className="rounded-none border border-lime-200 bg-lime-50/50 p-4 space-y-2">
                      <p className="text-xs font-extrabold text-slate-900">Summary Review</p>
                      <div className="text-xs text-slate-700 space-y-1">
                        <p><span className="font-bold text-slate-900">Title:</span> {form.title || "Untitled"}</p>
                        <p><span className="font-bold text-slate-900">Slug:</span> /{form.slug || "no-slug"}</p>
                        <p><span className="font-bold text-slate-900">Category:</span> {form.category}</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && <Alert tone="danger">{error}</Alert>}
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Cancel
                </Button>

                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <Button variant="outline" size="sm" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!form.title.trim()) {
                          setError("Please enter a lesson title to proceed.");
                          return;
                        }
                        setError(null);
                        setStep((s) => (s + 1) as 1 | 2 | 3);
                      }}
                    >
                      Next Step <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={submitLesson} disabled={saving}>
                      <CheckCircle2 className="h-4 w-4" /> {saving ? "Saving Lesson..." : editingId ? "Finish & Update" : "Finish & Publish"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 🏛️ CONSOLIDATED SINGLE MASTER CONTAINER LIST FOR ALL LESSONS */}
      {lessons.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} title="No lessons found" description="Create your first lesson above." />
      ) : (
        <Card pad={false} className="overflow-hidden border-slate-200/90 shadow-xs">
          {/* Master Table Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-amber-50/30 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            <span>Curriculum Lessons ({lessons.length})</span>
            <span>Quick Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {lessons.map((lesson, idx) => {
              const isExpanded = expandedId === lesson.id;
              const isInfoOpen = infoOpenId === lesson.id;
              const qList = questions[lesson.id] ?? [];

              return (
                <div key={lesson.id} className="transition-colors hover:bg-lime-50/20">
                  {/* Row main content */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 sm:px-5 gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-slate-100 font-extrabold text-[11px] text-slate-600">
                        {idx + 1}
                      </span>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-lime-100 text-lime-800 shadow-xs">
                        <DynamicIcon name={lesson.icon} className="h-4.5 w-4.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-xs sm:text-sm font-extrabold text-slate-900">{lesson.title}</h3>
                          <Pill tone="neutral">{lesson.category}</Pill>
                        </div>
                        <p className="truncate text-[11px] text-slate-400 mt-0.5">
                          /{lesson.slug} &bull; Difficulty: <span className="font-semibold text-slate-600">{lesson.difficulty}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Toolbar (Small Compact Buttons) */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => toggleInfo(lesson.id)}
                        className={`inline-flex items-center gap-1 rounded-none border px-2.5 py-1 text-[11px] font-extrabold transition cursor-pointer ${
                          isInfoOpen
                            ? "border-amber-300 bg-amber-100 text-amber-900"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        title="Quick Info Preview"
                      >
                        <Eye className="h-3 w-3" /> Info
                      </button>

                      <button
                        onClick={() => toggleExpand(lesson)}
                        className={`inline-flex items-center gap-1 rounded-none border px-2.5 py-1 text-[11px] font-extrabold transition cursor-pointer ${
                          isExpanded
                            ? "border-lime-300 bg-lime-100 text-lime-900"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-lime-50/60"
                        }`}
                      >
                        <HelpCircle className="h-3 w-3 text-lime-700" /> Quiz ({qList.length})
                      </button>

                      <button
                        onClick={() => openEditModal(lesson)}
                        className="rounded-none border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-lime-50 hover:text-slate-900 transition cursor-pointer"
                        title="Edit Lesson"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        className="rounded-none border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition cursor-pointer"
                        title="Delete Lesson"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Drawer */}
                  {isInfoOpen && (
                    <div className="bg-amber-50/30 border-t border-b border-slate-200/60 px-5 py-3 text-xs space-y-1.5 animate-fade-in">
                      <p><span className="font-extrabold text-slate-900">Summary:</span> <span className="text-slate-600">{lesson.summary}</span></p>
                      <p><span className="font-extrabold text-slate-900">Why It Matters:</span> <span className="text-slate-600">{lesson.whyItMatters}</span></p>
                      <p><span className="font-extrabold text-slate-900">Safety Tip:</span> <span className="text-slate-600">{lesson.safetyTip}</span></p>
                    </div>
                  )}

                  {/* CONSOLIDATED QUIZ MODULE */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-amber-50/20 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-lime-700" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                            Lesson Quiz Questions ({qList.length})
                          </h4>
                        </div>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setAddingQFor(addingQFor === lesson.id ? null : lesson.id)}
                        >
                          <Plus className="h-3 w-3" /> {addingQFor === lesson.id ? "Cancel" : "Add Question"}
                        </Button>
                      </div>

                      {/* Compact Questions List */}
                      {qList.length === 0 ? (
                        <div className="rounded-none border border-dashed border-slate-200 bg-white p-4 text-center text-xs text-slate-400">
                          No quiz questions created for this lesson yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 rounded-none border border-slate-200/80 bg-white shadow-xs">
                          {qList.map((q, qIdx) => (
                            <div key={q.id} className="flex items-center justify-between p-3 sm:px-4 text-xs">
                              <div className="flex items-center gap-3 min-w-0 pr-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-lime-100 font-extrabold text-lime-900 text-[10px]">
                                  Q{qIdx + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate font-bold text-slate-800">{q.question}</p>
                                  <p className="text-[10px] text-slate-400">
                                    Correct Option: <span className="font-bold text-lime-700">{q.correctOption.toUpperCase()}</span> &bull; {q.explanation}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteQuestion(lesson.id, q.id)}
                                className="shrink-0 p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title="Delete Question"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Inline Add Question Form */}
                      {addingQFor === lesson.id && (
                        <div className="rounded-none border border-lime-200 bg-white p-4 space-y-3 shadow-xs">
                          <p className="text-xs font-extrabold text-slate-900">Add New Quiz Question</p>
                          <Input
                            placeholder="Question Title..."
                            value={qForm.question}
                            onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Option A" value={qForm.optionA} onChange={(e) => setQForm({ ...qForm, optionA: e.target.value })} />
                            <Input placeholder="Option B" value={qForm.optionB} onChange={(e) => setQForm({ ...qForm, optionB: e.target.value })} />
                            <Input placeholder="Option C" value={qForm.optionC} onChange={(e) => setQForm({ ...qForm, optionC: e.target.value })} />
                            <Input placeholder="Option D" value={qForm.optionD} onChange={(e) => setQForm({ ...qForm, optionD: e.target.value })} />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-600">Correct Answer:</span>
                            <select
                              className="rounded-none border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
                              value={qForm.correctOption}
                              onChange={(e) => setQForm({ ...qForm, correctOption: e.target.value as "a" | "b" | "c" | "d" })}
                            >
                              <option value="a">Option A</option>
                              <option value="b">Option B</option>
                              <option value="c">Option C</option>
                              <option value="d">Option D</option>
                            </select>
                          </div>
                          <Textarea
                            placeholder="Explanation for the correct answer..."
                            rows={2}
                            value={qForm.explanation}
                            onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })}
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <Button size="xs" variant="outline" onClick={() => setAddingQFor(null)}>
                              Cancel
                            </Button>
                            <Button size="xs" onClick={() => addQuestion(lesson.id)}>
                              <Plus className="h-3 w-3" /> Save Question
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
