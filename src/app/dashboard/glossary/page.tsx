import { db } from "@/db";
import { glossaryTerms } from "@/db/schema";
import { asc } from "drizzle-orm";
import { GlossarySearch } from "@/components/dashboard/GlossarySearch";
import { SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function GlossaryPage() {
  const terms = await db.select().from(glossaryTerms).orderBy(asc(glossaryTerms.term));

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Banking Terminology Translator" subtitle="Enter any difficult banking term and get a simple answer." />
      <GlossarySearch terms={terms} />
    </div>
  );
}
