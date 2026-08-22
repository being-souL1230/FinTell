import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { glossaryTerms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  term: z.string().trim().min(1).max(120).optional(),
  simpleMeaning: z.string().trim().min(3).optional(),
  usedFor: z.string().trim().min(3).optional(),
  category: z.string().trim().max(80).optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const [term] = await db
    .update(glossaryTerms)
    .set(parsed.data)
    .where(eq(glossaryTerms.id, Number(id)))
    .returning();

  if (!term) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ term });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(glossaryTerms).where(eq(glossaryTerms.id, Number(id)));
  return NextResponse.json({ ok: true });
}
