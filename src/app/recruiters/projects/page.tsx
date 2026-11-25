import type { Metadata } from "next";
import { portfolio } from "@/content/portfolio";
import { PageTitle, ProjectEntry, ProShell, Section } from "@/components/pro/shell";

const { profile, projects, liveProjects } = portfolio;

export const metadata: Metadata = {
  title: `Projects · ${profile.name}`,
  description: `Everything ${profile.name} has built, in detail.`,
};

export default function ProjectsPage() {
  return (
    <ProShell>
      <PageTitle title="Projects" intro="Everything I've built: what it does, how it works, and where to find the code." />
      {liveProjects.length > 0 && (
        <Section id="live" title="Live projects">
          {liveProjects.map((p) => <ProjectEntry key={p.name} p={p} />)}
        </Section>
      )}
      {projects.length > 0 && (liveProjects.length > 0 ? (
        <Section id="more" title="More projects">
          {projects.map((p) => <ProjectEntry key={p.name} p={p} />)}
        </Section>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-14">
          {projects.map((p) => <ProjectEntry key={p.name} p={p} />)}
        </div>
      ))}
    </ProShell>
  );
}
