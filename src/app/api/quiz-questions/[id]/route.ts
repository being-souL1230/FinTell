import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { quizQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  question: z.string().trim().min(3).optional(),
  optionA: z.string().trim().min(1).optional(),
  optionB: z.string().trim().min(1).optional(),
  optionC: z.string().trim().min(1).optional(),
  optionD: z.string().trim().min(1).optional(),
  correctOption: z.enum(["a", "b", "c", "d"]).optional(),
  explanation: z.string().trim().min(3).optional(),
  orderIndex: z.number().int().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const [question] = await db
    .update(quizQuestions)
    .set(parsed.data)
    .where(eq(quizQuestions.id, Number(id)))
    .returning();

  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ question });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(quizQuestions).where(eq(quizQuestions.id, Number(id)));
  return NextResponse.json({ ok: true });
}
