import type { Metadata } from "next";
import { portfolio } from "@/content/portfolio";
import { Entry, PageTitle, ProShell } from "@/components/pro/shell";

const { profile, achievements } = portfolio;

export const metadata: Metadata = {
  title: `Achievements · ${profile.name}`,
  description: `Awards, competitions and milestones of ${profile.name}.`,
};

export default function AchievementsPage() {
  return (
    <ProShell>
      <PageTitle title="Achievements" intro="Competitions, awards and milestones: when, where, and what happened." />
      <div className="mx-auto max-w-3xl px-4 py-14">
        {achievements.map((a, i) => (
          <Entry key={a.title} id={`a${i + 1}`} date={a.when} lead={a.title}
            sub={[a.where, a.detail].filter(Boolean).join("  ·  ")} text={a.description} />
        ))}
      </div>
    </ProShell>
  );
}
