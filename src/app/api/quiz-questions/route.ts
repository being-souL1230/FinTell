import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { quizQuestions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  lessonId: z.number().int(),
  question: z.string().trim().min(3),
  optionA: z.string().trim().min(1),
  optionB: z.string().trim().min(1),
  optionC: z.string().trim().min(1),
  optionD: z.string().trim().min(1),
  correctOption: z.enum(["a", "b", "c", "d"]),
  explanation: z.string().trim().min(3),
  orderIndex: z.number().int().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const [question] = await db.insert(quizQuestions).values(parsed.data).returning();
  return NextResponse.json({ question }, { status: 201 });
}
