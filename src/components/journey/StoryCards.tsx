/* The comic-book cards in the story feed. One component per card kind. */
import type { Collaborator, JourneyTheme, StoryCard } from "@/content/types";
import { PhotoArt } from "./PhotoArt";
import { WinCard } from "./WinCards";

export function Card({ card, theme }: { card: StoryCard; theme?: JourneyTheme }) {
  // Music world: every card is an old-school desktop window
  if (theme === "hall" && card.kind !== "project") return <WinCard card={card} />;
  switch (card.kind) {
    case "text":
      if (card.mood === "shout")
        return (
          <div className="comic comic-shout">
            <p className="font-game text-[clamp(24px,5vw,34px)] leading-tight uppercase">{card.body}</p>
          </div>
        );
      if (card.mood === "thought")
        return (
          <div className="comic-thought">
            <p className="text-lg italic">{card.body}</p>
            <span className="puff puff-1" /><span className="puff puff-2" />
          </div>
        );
      return (
        <div className="comic">
          {card.title && <h3 className="font-game mb-1 text-2xl text-[#1d3b5c]">{card.title}</h3>}
          <p className="text-lg leading-snug">{card.body}</p>
        </div>
      );
    case "photo":
      return (
        <figure className="comic p-2.5!">
          <div className={`grid gap-2 ${card.photos.length === 1 ? "" : card.photos.length === 2 ? "grid-cols-2" : "grid-cols-2 [&>*:first-child]:col-span-2"}`}>
            {card.photos.map((p, i) => (
              <div key={i} className={`relative overflow-hidden rounded-md border-[3px] border-ink bg-[#dfe7ee] ${card.photos.length === 1 || i === 0 ? "aspect-[16/10]" : "aspect-square"}`}>
                <PhotoArt photo={p} />
              </div>
            ))}
          </div>
          {card.caption && <figcaption className="caption-strip">{card.caption}</figcaption>}
        </figure>
      );
    case "stats":
      return (
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(3, card.items.length)}, minmax(0, 1fr))` }}>
          {card.items.map((it) => (
            <div key={it.label} className="stat-tile">
              <div className="text-xs font-bold tracking-wider text-[#5b4a2f]">{it.label}</div>
              <div className="font-game text-[clamp(18px,4vw,26px)] leading-none">{it.value}</div>
            </div>
          ))}
        </div>
      );
    case "project":
      return <ProjectCard card={card} />;
    case "gig":
    case "media":
      return <WinCard card={card} />;
    case "quote":
      return (
        <blockquote className="comic comic-speech">
          <p className="font-game text-2xl leading-tight">&ldquo;{card.text}&rdquo;</p>
          {card.by && <footer className="mt-1 text-sm text-[#555]">— {card.by}</footer>}
        </blockquote>
      );
  }
}

/** The project dossier: cover, brief, role/dates, stack, crew and links. */
function ProjectCard({ card }: { card: Extract<StoryCard, { kind: "project" }> }) {
  return (
    <article className="comic project-card p-0! overflow-hidden">
      <div className="relative aspect-[16/9] border-b-4 border-ink">
        <PhotoArt photo={card.image} />
        {card.status && <span className="status-badge">{card.status}</span>}
      </div>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        {card.brief && <p className="text-lg leading-snug font-bold">{card.brief}</p>}
        <dl className="dossier">
          {card.role && (<><dt>ROLE</dt><dd>{card.role}</dd></>)}
          <dt>WHEN</dt><dd>{card.dates}</dd>
          {card.tech.length > 0 && (
            <>
              <dt>STACK</dt>
              <dd className="flex flex-wrap gap-1.5">{card.tech.map((t) => <span key={t} className="tech-chip">{t}</span>)}</dd>
            </>
          )}
          <dt>CREW</dt>
          <dd className="flex flex-wrap gap-1.5">
            {card.collaborators.length ? card.collaborators.map((c) => <Crew key={c.name} c={c} />) : <span className="italic">Solo build</span>}
          </dd>
        </dl>
        {(card.github || card.demo) && (
          <div className="mt-1 flex flex-wrap gap-3">
            {card.github && (
              <a href={card.github} target="_blank" rel="noopener noreferrer" className="chunky-btn btn-code btn-link">
                <CodeIcon /><span className="outline-text">GITHUB</span>
              </a>
            )}
            {card.demo && (
              <a href={card.demo} target="_blank" rel="noopener noreferrer" className="chunky-btn btn-demo btn-link">
                <span className="outline-text">LIVE DEMO</span><span className="play-tri" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Crew({ c }: { c: Collaborator }) {
  const initials = c.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const body = (<><span className="crew-dot" aria-hidden>{initials}</span>{c.name}</>);
  return c.url
    ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="crew-chip is-link">{body}<span aria-hidden>↗</span></a>
    : <span className="crew-chip">{body}</span>;
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path d="M8 6 L2 12 L8 18 M16 6 L22 12 L16 18 M14 4 L10 20" fill="none" stroke="#111" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6 L2 12 L8 18 M16 6 L22 12 L16 18 M14 4 L10 20" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
