import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardLabel, Pill, SectionHeader, StatStrip } from "@/components/ui";
import { BarChart3, TrendingDown } from "lucide-react";

export const dynamic = "force-dynamic";

type TopicRow = { title: string; category: string; completed_count: number };
type WeakRow = { title: string; avg_pct: number; attempts: number };
type ScamStat = { total: number; correct: number };

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  const popularResult = await db.execute(sql`
    select l.title, l.category, count(lp.id) filter (where lp.completed) as completed_count
    from lessons l
    left join lesson_progress lp on lp.lesson_id = l.id
    group by l.id
    order by completed_count desc
    limit 5
  `);
  const popularTopics = popularResult.rows as unknown as TopicRow[];

  const weakResult = await db.execute(sql`
    select l.title,
      round(avg(case when lp.quiz_total > 0 then (lp.quiz_score::float / lp.quiz_total) * 100 else null end)) as avg_pct,
      count(lp.id) filter (where lp.quiz_total > 0) as attempts
    from lessons l
    left join lesson_progress lp on lp.lesson_id = l.id
    group by l.id
    having count(lp.id) filter (where lp.quiz_total > 0) > 0
    order by avg_pct asc
    limit 5
  `);
  const weakTopics = weakResult.rows as unknown as WeakRow[];

  const scamStatsResult = await db.execute(sql`
    select count(*)::int as total, count(*) filter (where correct)::int as correct from scam_attempts
  `);
  const scamStats = (scamStatsResult.rows[0] as unknown as ScamStat) ?? { total: 0, correct: 0 };
  const scamAccuracy = scamStats.total > 0 ? Math.round((scamStats.correct / scamStats.total) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Users & Analytics" subtitle="Registered users and learning insights." />

      <StatStrip
        items={[
          { label: "Total users", value: allUsers.length },
          { label: "Scam accuracy", value: `${scamAccuracy}%`, tone: scamAccuracy >= 70 ? "good" : "warn" },
          { label: "Scam attempts", value: scamStats.total },
          { label: "Lessons completed", value: popularTopics.reduce((s, t) => s + Number(t.completed_count), 0) },
        ]}
      />

      {/* Both analytics lists merged into one two-column panel */}
      <Card pad={false}>
        <div className="grid divide-x divide-slate-100 md:grid-cols-2">
          <div className="p-3.5">
            <CardLabel icon={<BarChart3 className="h-3 w-3" />}>Most popular topics</CardLabel>
            <div className="mt-2.5 space-y-1.5">
              {popularTopics.length === 0 && <p className="text-[11px] text-slate-400">No data yet.</p>}
              {popularTopics.map((t) => (
                <div key={t.title} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="truncate text-slate-600">{t.title}</span>
                  <Pill tone="success">{t.completed_count} done</Pill>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3.5">
            <CardLabel icon={<TrendingDown className="h-3 w-3" />}>Needs attention</CardLabel>
            <div className="mt-2.5 space-y-1.5">
              {weakTopics.length === 0 && <p className="text-[11px] text-slate-400">No data yet.</p>}
              {weakTopics.map((t) => (
                <div key={t.title} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="truncate text-slate-600">{t.title}</span>
                  <Pill tone="warning">{t.avg_pct ?? 0}% avg</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">All Users ({allUsers.length})</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Language</th>
                <th className="py-2 pr-4">Level</th>
                <th className="py-2 pr-4">XP</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50">
                  <td className="py-2 pr-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="py-2 pr-4 text-slate-500">{u.email}</td>
                  <td className="py-2 pr-4">
                    <Pill tone={u.role === "admin" ? "warning" : "neutral"}>{u.role}</Pill>
                  </td>
                  <td className="py-2 pr-4 text-slate-500">{u.language}</td>
                  <td className="py-2 pr-4 text-slate-500">{u.experienceLevel ?? "N/A"}</td>
                  <td className="py-2 pr-4 font-semibold text-amber-600">{u.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
