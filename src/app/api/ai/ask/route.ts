import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { aiChatLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { getAiAnswer } from "@/lib/ai-service";

const schema = z.object({ question: z.string().trim().min(1).max(500) });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your question" }, { status: 400 });
  }

  const { answer, source } = await getAiAnswer(parsed.data.question);

  await db.insert(aiChatLogs).values({
    userId: user.id,
    question: parsed.data.question,
    answer,
    source,
  });

  return NextResponse.json({ answer, source });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const logs = await db
    .select()
    .from(aiChatLogs)
    .where(eq(aiChatLogs.userId, user.id))
    .orderBy(desc(aiChatLogs.createdAt))
    .limit(20);

  return NextResponse.json({ logs: logs.reverse() });
}
