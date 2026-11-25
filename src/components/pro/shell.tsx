/* Shared pieces for the portfolio pages (/recruiters and its sub-pages). */
import Link from "next/link";
import { EB_Garamond, Playfair_Display } from "next/font/google";
import { portfolio, type Project } from "@/content/portfolio";
import { Ornament } from "./art";

const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const body = EB_Garamond({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });

export const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const { profile, contact, links, internships, projects, liveProjects, skills, education, achievements } = portfolio;

export const socials = [
  ["GitHub", links.github], ["LinkedIn", links.linkedin], ["LeetCode", links.leetcode],
  ...links.other.map((o) => [o.label, o.url] as const),
].filter(([, url]) => url);

export function ProShell({ children }: { children: React.ReactNode }) {
  const nav = [
    ["/recruiters#about", "About", true],
    ["/recruiters#experience", "Experience", internships.length > 0],
    ["/recruiters/projects", "Projects", projects.length + liveProjects.length > 0],
    ["/recruiters#skills", "Skills", skills.length > 0],
    ["/recruiters/achievements", "Achievements", achievements.length > 0],
    ["/recruiters#education", "Education", education.length > 0],
    ["#contact", "Contact", true],
  ] as const;
  const btn = "pro-btn hover:bg-[var(--pro-paper)]! hover:text-[var(--pro-ink)]!";
  return (
    <div className={`pro ${display.variable} ${body.variable} min-h-dvh`}>
      <nav className="pro-nav sticky top-0 z-20 border-b border-[var(--pro-line)] bg-[var(--pro-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link href="/recruiters" className="pro-display shrink-0 text-lg tracking-[0.12em] uppercase">
            <span className="sm:hidden">{profile.name.split(" ")[0]}</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>
          <div className="pro-caps ml-auto flex gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            {nav.filter(([, , show]) => show).map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/" className="text-[var(--pro-rust)]">← Game</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer id="contact" className="mt-6 scroll-mt-20 bg-[var(--pro-ink)] px-4 py-16 text-center text-[var(--pro-paper)]">
        <h2 className="pro-title text-[var(--pro-sand)]!">Let&apos;s talk</h2>
        <p className="mx-auto mt-4 max-w-md italic opacity-80">Happy to chat about internships, projects, or anything on this page.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5 [&_.pro-btn]:border-[var(--pro-paper)]">
          {contact.email && <a href={`mailto:${contact.email}`} className={btn}>{contact.email}</a>}
          {contact.phone && <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className={btn}>{contact.phone}</a>}
          {socials.map(([label, url]) => <a key={label} href={url} {...external} className={btn}>{label} ↗</a>)}
        </div>
        <Link href="/" className="pro-caps mt-12 inline-block opacity-70 hover:opacity-100">← Back to the game</Link>
      </footer>
    </div>
  );
}

export function Section({ id, title, children, wide = false }: { id: string; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section id={id} className="scroll-mt-20 px-4 py-14 sm:py-16">
      <h2 className="pro-title">{title}</h2>
      <Ornament className="mt-3 mb-10" />
      <div className={`mx-auto ${wide ? "max-w-5xl" : "max-w-3xl"}`}>{children}</div>
    </section>
  );
}

/** Big centred heading for the sub-pages. */
export function PageTitle({ title, intro }: { title: string; intro: string }) {
  return (
    <header className="px-4 pt-14 pb-4 text-center">
      <Link href="/recruiters" className="pro-caps text-[var(--pro-muted)] hover:text-[var(--pro-rust)]">← Back to portfolio</Link>
      <h1 className="pro-display mt-6 text-[clamp(38px,7vw,72px)] leading-none tracking-[0.08em] uppercase">{title}</h1>
      <Ornament className="my-5" />
      <p className="mx-auto max-w-xl italic text-[var(--pro-muted)]">{intro}</p>
    </header>
  );
}

export function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-12 text-center">
      <Link href={href} className="pro-btn pro-btn-solid">{label} →</Link>
    </div>
  );
}

export function Entry({ id, date, lead, sub, tech, text, points = [], actions }: {
  id?: string; date: string; lead: string; sub?: string; tech?: string[]; text?: string; points?: string[]; actions?: React.ReactNode;
}) {
  return (
    <article id={id} className="pro-entry scroll-mt-24">
      {date && <p className="pro-dateline">— {date} —</p>}
      <h3 className="pro-lead mt-3">{lead}</h3>
      {sub && <p className="mt-1 text-center italic text-[var(--pro-muted)]">{sub}</p>}
      {tech && tech.length > 0 && <p className="pro-tag mt-1 text-center">{tech.join(" · ")}</p>}
      {text && <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed">{text}</p>}
      {points.length > 0 && <ul className="pro-cols mt-5">{points.map((p) => <li key={p}>{p}</li>)}</ul>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </article>
  );
}

export function projectId(p: Project) {
  return p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProjectLinks({ p }: { p: Project }) {
  if (!p.github && !p.live) return null;
  return (
    <>
      {p.live && <a href={p.live} {...external} className="pro-btn pro-btn-solid">Visit live ↗</a>}
      {p.github && <a href={p.github} {...external} className="pro-btn">Code on GitHub ↗</a>}
    </>
  );
}

/** Full write-up of a project (used on /recruiters/projects and for live projects). */
export function ProjectEntry({ p }: { p: Project }) {
  return <Entry id={projectId(p)} date={p.when} lead={p.name} sub={p.tagline} tech={p.tech} text={p.description} points={p.points} actions={<ProjectLinks p={p} />} />;
}

/** Short card for the main page: title, when, description, GitHub. */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="flex w-full flex-col border-[1.5px] md:w-[calc((100%-40px)/3)] border-[var(--pro-line)] bg-[var(--pro-paper)] p-6 text-center">
      <p className="pro-dateline">{p.when}</p>
      <h3 className="pro-lead mt-2">
        <Link href={`/recruiters/projects#${projectId(p)}`} className="hover:underline">{p.name}</Link>
      </h3>
      {p.tagline && <p className="pro-tag mt-1">{p.tagline}</p>}
      <p className="mt-4 flex-1 text-[15.5px] leading-relaxed">{p.description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {p.github ? <a href={p.github} {...external} className="pro-btn">GitHub ↗</a>
          : <Link href={`/recruiters/projects#${projectId(p)}`} className="pro-btn">Read more</Link>}
      </div>
    </article>
  );
}
