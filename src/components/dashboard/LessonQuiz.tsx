"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Pill } from "@/components/ui";
import { CheckCircle2, XCircle, Award } from "lucide-react";

type Question = {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation: string;
};

type Badge = { id: number; name: string; icon: string };

export function LessonQuiz({
  lessonId,
  questions,
  alreadyCompleted,
}: {
  lessonId: number;
  questions: Question[];
  alreadyCompleted: boolean;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, "a" | "b" | "c" | "d">>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    quizScore: number | null;
    quizTotal: number | null;
    results: { questionId: number; correct: boolean; correctOption: string; explanation: string }[];
    xpAwarded: number;
    newBadges: Badge[];
  } | null>(null);

  const allAnswered = questions.length === 0 || questions.every((q) => answers[q.id]);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, chosenOption]) => ({
            questionId: Number(questionId),
            chosenOption,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-none border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-400">No quiz available for this lesson yet.</p>
        {!alreadyCompleted && (
          <Button className="mt-4" onClick={submit} disabled={submitting}>
            {submitting ? "Saving..." : "Mark as Complete"}
          </Button>
        )}
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-3 rounded-none border border-emerald-200 bg-emerald-50/50 p-6">
        <div className="flex items-center gap-3">
          <Award className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-900">
            Score: {result.quizScore}/{result.quizTotal} | +{result.xpAwarded} XP
          </p>
        </div>
        {result.newBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.newBadges.map((b) => (
              <Pill key={b.id} tone="warning">
                {b.icon} New Badge: {b.name}
              </Pill>
            ))}
          </div>
        )}
        <div className="space-y-2.5">
          {result.results.map((r) => {
            const q = questions.find((x) => x.id === r.questionId);
            return (
              <div key={r.questionId} className={`rounded-none border p-4 ${r.correct ? "border-emerald-200 bg-white" : "border-red-200 bg-white"}`}>
                <p className="text-sm font-semibold text-slate-800">{q?.question}</p>
                <div className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${r.correct ? "text-emerald-600" : "text-red-600"}`}>
                  {r.correct ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {r.correct ? "Correct" : "Incorrect"}
                </div>
                <p className="mt-1.5 text-xs text-slate-500">{r.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-none border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold text-slate-700">Mini Quiz</p>
      {questions.map((q, idx) => (
        <div key={q.id}>
          <p className="text-sm font-semibold text-slate-800">
            {idx + 1}. {q.question}
          </p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {(["a", "b", "c", "d"] as const).map((opt) => {
              const label = { a: q.optionA, b: q.optionB, c: q.optionC, d: q.optionD }[opt];
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  className={`cursor-pointer rounded-none border px-3 py-2 text-left text-xs font-medium transition ${
                    selected ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-slate-150 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="mr-1 font-bold uppercase text-slate-400">{opt}.</span> {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!allAnswered && <Alert tone="warning">Answer all questions to submit.</Alert>}
      <Button onClick={submit} disabled={!allAnswered || submitting} size="lg">
        {submitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  );
}
