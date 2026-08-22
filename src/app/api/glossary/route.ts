import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { glossaryTerms } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const terms = await db.select().from(glossaryTerms).orderBy(asc(glossaryTerms.term));
  return NextResponse.json({ terms });
}

const schema = z.object({
  term: z.string().trim().min(1).max(120),
  simpleMeaning: z.string().trim().min(3),
  usedFor: z.string().trim().min(3),
  category: z.string().trim().max(80).default("general"),
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

  const [term] = await db.insert(glossaryTerms).values(parsed.data).returning();
  return NextResponse.json({ term }, { status: 201 });
}
