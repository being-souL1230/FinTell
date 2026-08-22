import { redirect } from "next/navigation";
import { db } from "@/db";
import { glossaryTerms } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { AdminGlossaryManager } from "@/components/dashboard/AdminGlossaryManager";
import { SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminGlossaryPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const terms = await db.select().from(glossaryTerms).orderBy(asc(glossaryTerms.term));

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Manage Glossary" subtitle="Manage terms for the Banking Terminology Translator." />
      <AdminGlossaryManager initialTerms={terms} />
    </div>
  );
}
