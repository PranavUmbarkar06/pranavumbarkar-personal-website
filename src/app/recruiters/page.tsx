import type { Metadata } from "next";
import Link from "next/link";
import { portfolio, PREVIEW, range } from "@/content/portfolio";
import { Ornament, ProHero } from "@/components/pro/art";
import { Entry, external, ProjectCard, ProShell, Section, SeeAll, socials } from "@/components/pro/shell";

const { profile, contact, stats, internships, projects, liveProjects, skills, positions, achievements, education } = portfolio;

export const metadata: Metadata = {
  title: `${profile.name} · Portfolio`,
  description: profile.headline,
};

export default function RecruitersPage() {
  const allProjects = [...liveProjects, ...projects];
  return (
    <ProShell>
      {/* ---------- hero art ---------- */}
      <header className="px-3 pt-5 sm:px-6">
        <div className="pro-frame mx-auto h-[clamp(200px,38vw,440px)] max-w-6xl overflow-hidden">
          <ProHero />
        </div>
      </header>

      {/* ---------- name block ---------- */}
      <section id="about" className="scroll-mt-20 px-4 pt-14 pb-6 text-center">
        {profile.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photo} alt={profile.name} className="pro-frame mx-auto mb-8 size-32 object-cover" />
        )}
        <h1 className="pro-display text-[clamp(40px,8vw,88px)] leading-none font-normal tracking-[0.08em] uppercase">
          {profile.name}
        </h1>
        <Ornament className="my-5" />
        <p className="pro-caps text-[13px]!">{profile.headline}</p>
        <p className="mt-2 italic text-[var(--pro-muted)]">
          {[profile.location, profile.status].filter(Boolean).join("  ·  ")}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {contact.resume && <a href={contact.resume} className="pro-btn pro-btn-solid" download>Download CV</a>}
          {contact.email && <a href={`mailto:${contact.email}`} className="pro-btn">Email me</a>}
          {socials.map(([label, url]) => <a key={label} href={url} {...external} className="pro-btn">{label} ↗</a>)}
        </div>

        {stats.length > 0 && (
          <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 border-y border-[var(--pro-line)] sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-3 py-6 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""} border-[var(--pro-line)]`}>
                <dt className="pro-display text-4xl text-[var(--pro-rust)]">{s.value}</dt>
                <dd className="pro-caps mt-2 text-[11px]! text-[var(--pro-muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {profile.summary && (
          <p className="pro-dropcap mx-auto mt-12 max-w-2xl text-left text-[18px] leading-relaxed">{profile.summary}</p>
        )}
      </section>

      {internships.length > 0 && (
        <Section id="experience" title="Experience">
          {internships.map((x) => (
            <Entry key={x.role + x.org} date={range(x)} lead={`${x.role} · ${x.org}`} sub={x.where} tech={x.tech} points={x.points}
              actions={x.link ? <a href={x.link} {...external} className="pro-btn">More ↗</a> : undefined} />
          ))}
        </Section>
      )}

      {allProjects.length > 0 && (
        <Section id="projects" title="Projects" wide>
          <div className="flex flex-wrap justify-center gap-5">
            {allProjects.slice(0, PREVIEW.projects).map((p) => <ProjectCard key={p.name} p={p} />)}
          </div>
          <SeeAll href="/recruiters/projects"
            label={allProjects.length > PREVIEW.projects ? `See all ${allProjects.length} projects` : "Projects in detail"} />
        </Section>
      )}

      {skills.length > 0 && (
        <Section id="skills" title="Skills">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.group} className="text-center">
                <h3 className="pro-dateline text-[var(--pro-rust)]!">{g.group}</h3>
                <p className="mt-2 leading-relaxed">{g.items.join("  ·  ")}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {positions.length > 0 && (
        <Section id="positions" title="Positions of responsibility">
          {positions.map((p) => <Entry key={p.title + p.org} date={range(p)} lead={`${p.title} · ${p.org}`} points={p.points} />)}
        </Section>
      )}

      {achievements.length > 0 && (
        <Section id="achievements" title="Achievements">
          <ul className="flex flex-col divide-y divide-[var(--pro-line)]/25">
            {achievements.slice(0, PREVIEW.achievements).map((a, i) => (
              <li key={a.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <Link href={`/recruiters/achievements#a${i + 1}`} className="hover:text-[var(--pro-rust)]">
                  <span className="pro-display">{a.title}</span>
                  {a.detail && <span className="italic text-[var(--pro-muted)]">, {a.detail}</span>}
                </Link>
                {a.when && <span className="pro-dateline">{a.when}</span>}
              </li>
            ))}
          </ul>
          <SeeAll href="/recruiters/achievements"
            label={achievements.length > PREVIEW.achievements ? `See all ${achievements.length} achievements` : "Achievements in detail"} />
        </Section>
      )}

      {education.length > 0 && (
        <Section id="education" title="Education">
          {education.map((e) => (
            <Entry key={e.school} date={range(e)} lead={e.school} sub={[e.degree, e.score].filter(Boolean).join("  ·  ")} />
          ))}
        </Section>
      )}
    </ProShell>
  );
}
