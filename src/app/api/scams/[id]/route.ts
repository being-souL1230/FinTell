import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { scamScenarios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  difficulty: z.enum(["easy", "medium", "advanced"]).optional(),
  channel: z.string().trim().max(40).optional(),
  message: z.string().trim().min(3).optional(),
  context: z.string().trim().optional(),
  options: z.array(z.string().trim().min(1)).min(2).max(6).optional(),
  correctOptionIndex: z.number().int().min(0).optional(),
  explanation: z.string().trim().min(3).optional(),
  safetyLesson: z.string().trim().min(3).optional(),
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

  const [scenario] = await db
    .update(scamScenarios)
    .set(parsed.data)
    .where(eq(scamScenarios.id, Number(id)))
    .returning();

  if (!scenario) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ scenario });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(scamScenarios).where(eq(scamScenarios.id, Number(id)));
  return NextResponse.json({ ok: true });
}
