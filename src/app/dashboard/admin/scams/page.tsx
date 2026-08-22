import { redirect } from "next/navigation";
import { db } from "@/db";
import { scamScenarios } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { AdminScamsManager } from "@/components/dashboard/AdminScamsManager";
import { SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminScamsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const scenarios = await db.select().from(scamScenarios).orderBy(asc(scamScenarios.orderIndex));

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Manage Scam Scenarios" subtitle="Grow the fraud-training scenario library." />
      <AdminScamsManager initialScenarios={scenarios} />
    </div>
  );
}
