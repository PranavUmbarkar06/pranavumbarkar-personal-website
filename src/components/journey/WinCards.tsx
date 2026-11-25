"use client";

/*
  Music world story cards, drawn as early-90s desktop windows:
  navy title bar with a centred title, a system box on the left, bevelled
  minimise/maximise buttons, a menu bar with underlined letters, grey bevels
  and sunken white panels. Original styling, no real OS branding.
*/
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Clip, StoryCard } from "@/content/types";
import { PhotoArt } from "./PhotoArt";

function Win({ title, menu, status, children, tone = "white", label }: {
  title: string; menu?: string[]; status?: ReactNode; children: ReactNode; tone?: "white" | "grey"; label?: string;
}) {
  return (
    <article className="win" aria-label={label ?? title}>
      <header className="win-title" aria-hidden>
        <span className="win-sys"><i /></span>
        <span className="win-name">{title}</span>
        <span className="win-ctl">▼</span>
        <span className="win-ctl">▲</span>
      </header>
      {menu && (
        <nav className="win-menu" aria-hidden>
          {menu.map((m) => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
        </nav>
      )}
      <div className={tone === "grey" ? "win-body win-body-grey" : "win-body"}>{children}</div>
      {status && <footer className="win-status">{status}</footer>}
    </article>
  );
}

export function WinCard({ card }: { card: StoryCard }) {
  switch (card.kind) {
    case "text":
      if (card.mood === "shout")
        return (
          <Win title="Announcement" tone="grey" label="Highlight">
            <div className="flex items-center gap-4">
              <NoteIcon />
              <p className="win-shout">{card.body}</p>
            </div>
            <div className="mt-3 flex justify-center"><span className="win-btn win-btn-default" aria-hidden>OK</span></div>
          </Win>
        );
      if (card.mood === "thought")
        return (
          <Win title="BACKSTAGE.TXT" menu={["File", "Edit", "Search", "Help"]} label="Backstage thought">
            <p className="win-thought">{card.body}</p>
          </Win>
        );
      return (
        <Win title={`Liner Notes${card.title ? ` – ${card.title}` : ""}`} menu={["File", "Edit", "Search", "Help"]}>
          {card.title && <h3 className="win-h">{card.title}</h3>}
          <p className="win-text">{card.body}</p>
        </Win>
      );
    case "photo":
      return (
        <Win title="Photo Album" menu={["File", "View", "Help"]} status={`${card.photos.length} picture(s)`}>
          <div className={`grid gap-2 ${card.photos.length === 1 ? "" : card.photos.length === 2 ? "grid-cols-2" : "grid-cols-2 [&>*:first-child]:col-span-2"}`}>
            {card.photos.map((p, i) => (
              <div key={i} className={`win-sunken relative overflow-hidden ${card.photos.length === 1 || i === 0 ? "aspect-[16/10]" : "aspect-square"}`}>
                <PhotoArt photo={p} />
              </div>
            ))}
          </div>
          {card.caption && <p className="win-text mt-2">{card.caption}</p>}
        </Win>
      );
    case "stats":
      return (
        <Win title="Gig Stats" tone="grey">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(3, card.items.length)}, minmax(0, 1fr))` }}>
            {card.items.map((it) => (
              <div key={it.label} className="win-lcd">
                <div className="win-lcd-label">{it.label}</div>
                <div className="win-lcd-value">{it.value}</div>
              </div>
            ))}
          </div>
        </Win>
      );
    case "quote":
      return (
        <Win title="Fan Mail" menu={["File", "Reply", "Help"]}>
          <p className="win-quote">&ldquo;{card.text}&rdquo;</p>
          {card.by && <p className="win-text mt-1 text-right">— {card.by}</p>}
        </Win>
      );
    case "gig":
      return <GigWin card={card} />;
    case "media":
      return <Jukebox clips={card.clips} />;
    default:
      return null;
  }
}

/** The gig sheet: cover, brief, venue/date, what I played, band, setlist. */
function GigWin({ card }: { card: Extract<StoryCard, { kind: "gig" }> }) {
  return (
    <Win title={`Gig Info – ${card.band ?? "Solo set"}`} menu={["File", "Edit", "Setlist", "Help"]}
      status={<><span>{card.setlist.length} song(s)</span><span>{card.date}</span></>}>
      <div className="win-sunken relative aspect-[16/9] overflow-hidden">
        <PhotoArt photo={card.image} />
      </div>
      {card.brief && <p className="win-text mt-3 font-bold">{card.brief}</p>}
      <dl className="win-fields mt-3">
        {card.venue && (<><dt>Venue:</dt><dd>{card.venue}</dd></>)}
        <dt>Date:</dt><dd>{card.date}</dd>
        {card.band && (<><dt>Band:</dt><dd>{card.band}</dd></>)}
      </dl>
      {card.instruments.length > 0 && (
        <fieldset className="win-group">
          <legend>I played</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {card.instruments.map((t) => (
              <span key={t} className="win-check"><span className="win-box" aria-hidden>✓</span>{t}</span>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset className="win-group">
        <legend>On stage with</legend>
        {card.members.length ? (
          <div className="flex flex-wrap gap-2">
            {card.members.map((m) => m.url
              ? <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer" className="win-btn">{m.name} ↗</a>
              : <span key={m.name} className="win-btn win-btn-flat">{m.name}</span>)}
          </div>
        ) : <span className="win-text italic">Just me and a guitar</span>}
      </fieldset>
      {card.setlist.length > 0 && (
        <div className="mt-3">
          <div className="win-label">Setlist:</div>
          <ol className="win-list">
            {card.setlist.map((s, i) => <li key={i} className={i === 0 ? "is-sel" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{s}</li>)}
          </ol>
        </div>
      )}
    </Win>
  );
}

/** Clips: audio gets a little deck, video a screen, YouTube an embed, anything else a button. */
function Jukebox({ clips }: { clips: Clip[] }) {
  return (
    <Win title="Jukebox" menu={["File", "Play", "Help"]} tone="grey" status={`${clips.length} clip(s)`}>
      <div className="flex flex-col gap-3">
        {clips.map((c, i) => {
          if (c.type === "audio") return <AudioDeck key={i} clip={c} />;
          if (c.type === "video")
            return (
              <figure key={i}>
                <figcaption className="win-label">{c.title}</figcaption>
                <div className="win-sunken bg-black">
                  <video src={c.src} controls playsInline preload="metadata" className="block aspect-video w-full" onPlay={pauseOthers} />
                </div>
              </figure>
            );
          if (c.type === "youtube")
            return (
              <figure key={i}>
                <figcaption className="win-label">{c.title}</figcaption>
                <div className="win-sunken bg-black">
                  <iframe src={c.src} title={c.title} loading="lazy" className="block aspect-video w-full"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />
                </div>
              </figure>
            );
          return (
            <a key={i} href={c.src} target="_blank" rel="noopener noreferrer" className="win-btn self-start">▶ {c.title} ↗</a>
          );
        })}
      </div>
    </Win>
  );
}

/** Only one clip plays at a time. */
function pauseOthers(e: { currentTarget: HTMLMediaElement }) {
  document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((m) => { if (m !== e.currentTarget) m.pause(); });
}

const mmss = (t: number) => (Number.isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}` : "0:00");

function AudioDeck({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setDur(a.duration);
    const onEnd = () => { setPlaying(false); setT(0); };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    if (a.readyState >= 1) onMeta();
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };
  const stop = () => {
    const a = ref.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setT(0);
  };

  return (
    <div className="win-deck">
      <audio ref={ref} src={clip.src} preload="metadata" onPlay={pauseOthers} />
      <div className="win-label">{clip.title}</div>
      <div className="flex items-center gap-2">
        <button type="button" className="win-btn win-btn-sq" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <PauseGlyph /> : <PlayGlyph />}
        </button>
        <button type="button" className="win-btn win-btn-sq" onClick={stop} aria-label="Stop"><StopGlyph /></button>
        <input
          type="range" className="win-seek" min={0} max={dur || 0} step={0.1} value={Math.min(t, dur || 0)}
          aria-label={`Seek ${clip.title}`}
          onChange={(e) => { const a = ref.current; if (a) { a.currentTime = Number(e.target.value); setT(a.currentTime); } }}
        />
        <span className="win-time" aria-live="off">{mmss(t)} / {mmss(dur)}</span>
      </div>
      <div className={`win-eq ${playing ? "is-on" : ""}`} aria-hidden>
        {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 137) % 600}ms` }} />)}
      </div>
    </div>
  );
}

function PlayGlyph() { return <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden><path d="M3 1.5 L10.5 6 L3 10.5Z" fill="currentColor" /></svg>; }
function PauseGlyph() { return <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden><path d="M2.5 1.5h2.6v9H2.5z M6.9 1.5h2.6v9H6.9z" fill="currentColor" /></svg>; }
function StopGlyph() { return <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden><path d="M2 2h8v8H2z" fill="currentColor" /></svg>; }

/** Dialog icon: a white note in a navy disc. */
function NoteIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-11 shrink-0" aria-hidden>
      <circle cx={20} cy={20} r={18} fill="#13307e" stroke="#000" strokeWidth={2} />
      <path d="M17 27 V11 L28 9 V24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinejoin="round" />
      <ellipse cx={14.5} cy={27.5} rx={4} ry={3} fill="#fff" />
      <ellipse cx={25.5} cy={24.5} rx={4} ry={3} fill="#fff" />
    </svg>
  );
}
