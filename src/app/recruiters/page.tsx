import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond, Playfair_Display } from "next/font/google";
import { portfolio, range, type Project } from "@/content/portfolio";
import { Ornament, ProHero } from "@/components/pro/art";

const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const body = EB_Garamond({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });

const { profile, contact, links, stats, internships, projects, liveProjects, skills, positions, achievements, education } = portfolio;

export const metadata: Metadata = {
  title: `${profile.name} · Portfolio`,
  description: profile.headline,
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 px-4 py-14 sm:py-16">
      <h2 className="pro-title">{title}</h2>
      <Ornament className="mt-3 mb-10" />
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

function Entry({ date, lead, sub, tech, points, actions }: {
  date: string; lead: string; sub?: string; tech?: string[]; points: string[]; actions?: React.ReactNode;
}) {
  return (
    <article className="pro-entry">
      {date && <p className="pro-dateline">— {date} —</p>}
      <h3 className="pro-lead mt-3">{lead}</h3>
      {sub && <p className="mt-1 text-center italic text-[var(--pro-muted)]">{sub}</p>}
      {tech && tech.length > 0 && <p className="pro-tag mt-1 text-center">{tech.join(" · ")}</p>}
      {points.length > 0 && <ul className="pro-cols mt-5">{points.map((p) => <li key={p}>{p}</li>)}</ul>}
      {actions && <div className="mt-4 flex flex-wrap justify-center gap-2">{actions}</div>}
    </article>
  );
}

function ProjectEntry({ p }: { p: Project }) {
  const actions = (p.github || p.live) ? (
    <>
      {p.live && <a href={p.live} {...external} className="pro-btn pro-btn-solid">Visit live ↗</a>}
      {p.github && <a href={p.github} {...external} className="pro-btn">Code on GitHub ↗</a>}
    </>
  ) : undefined;
  return <Entry date={p.when} lead={p.name} sub={p.tagline} tech={p.tech} points={p.points} actions={actions} />;
}

export default function RecruitersPage() {
  const nav = [
    ["about", "About", true],
    ["experience", "Experience", internships.length > 0],
    ["projects", "Projects", projects.length + liveProjects.length > 0],
    ["skills", "Skills", skills.length > 0],
    ["education", "Education", education.length > 0],
    ["contact", "Contact", true],
  ] as const;
  const socials = [
    ["GitHub", links.github], ["LinkedIn", links.linkedin], ["LeetCode", links.leetcode],
    ...links.other.map((o) => [o.label, o.url] as const),
  ].filter(([, url]) => url);

  return (
    <div className={`pro ${display.variable} ${body.variable} min-h-dvh`}>
      {/* ---------- top bar ---------- */}
      <nav className="pro-nav sticky top-0 z-20 border-b border-[var(--pro-line)] bg-[var(--pro-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link href="/" className="pro-display shrink-0 text-lg tracking-[0.12em] uppercase" title="Back to the game">
            <span className="sm:hidden">{profile.name.split(" ")[0]}</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>
          <div className="pro-caps ml-auto flex gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            {nav.filter(([, , show]) => show).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            <Link href="/" className="text-[var(--pro-rust)]">← Game</Link>
          </div>
        </div>
      </nav>

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

      {liveProjects.length > 0 && (
        <Section id={projects.length ? "live" : "projects"} title="Live projects">
          {liveProjects.map((p) => <ProjectEntry key={p.name} p={p} />)}
        </Section>
      )}

      {projects.length > 0 && (
        <Section id="projects" title="Projects">
          {projects.map((p) => <ProjectEntry key={p.name} p={p} />)}
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
            {achievements.map((a) => (
              <li key={a.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <span>
                  <span className="pro-display">{a.title}</span>
                  {a.detail && <span className="italic text-[var(--pro-muted)]">, {a.detail}</span>}
                </span>
                {a.when && <span className="pro-dateline">{a.when}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {education.length > 0 && (
        <Section id="education" title="Education">
          {education.map((e) => (
            <Entry key={e.school} date={range(e)} lead={e.school} sub={[e.degree, e.score].filter(Boolean).join("  ·  ")} points={[]} />
          ))}
        </Section>
      )}

      {/* ---------- footer ---------- */}
      <footer id="contact" className="mt-6 scroll-mt-20 bg-[var(--pro-ink)] px-4 py-16 text-center text-[var(--pro-paper)]">
        <h2 className="pro-title text-[var(--pro-sand)]!">Let&apos;s talk</h2>
        <p className="mx-auto mt-4 max-w-md italic opacity-80">Happy to chat about internships, projects, or anything on this page.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5 [&_.pro-btn]:border-[var(--pro-paper)]">
          {contact.email && <a href={`mailto:${contact.email}`} className="pro-btn hover:bg-[var(--pro-paper)]! hover:text-[var(--pro-ink)]!">{contact.email}</a>}
          {contact.phone && <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="pro-btn hover:bg-[var(--pro-paper)]! hover:text-[var(--pro-ink)]!">{contact.phone}</a>}
          {socials.map(([label, url]) => <a key={label} href={url} {...external} className="pro-btn hover:bg-[var(--pro-paper)]! hover:text-[var(--pro-ink)]!">{label} ↗</a>)}
        </div>
        <Link href="/" className="pro-caps mt-12 inline-block opacity-70 hover:opacity-100">← Back to the game</Link>
      </footer>
    </div>
  );
}
