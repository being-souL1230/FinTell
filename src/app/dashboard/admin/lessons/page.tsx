import { redirect } from "next/navigation";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { AdminLessonsManager } from "@/components/dashboard/AdminLessonsManager";
import { SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Manage Lessons" subtitle="Create, edit, or delete learning content and mini-quizzes." />
      <AdminLessonsManager initialLessons={allLessons} />
    </div>
  );
}
