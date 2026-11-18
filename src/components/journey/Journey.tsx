"use client";

/*
  The split-screen journey.
  Top: a pinned scene where the jeep drives over the hills as you scroll.
  Bottom: the story feed. When checkpoint N's section reaches the top of the
  feed, the jeep is exactly at signpost N (piecewise-linear scroll → road map).
*/
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Milestone } from "@/content/types";
import { vehicle, worlds } from "@/content/site";
import { sfx } from "@/lib/sound";
import { Jeep, LockIcon } from "../art";
import { MuteButton, StageSwitcher, useSound } from "../hud";
import { Card } from "./StoryCards";
import { PhotoArt } from "./PhotoArt";
import { buildRoad, farRange, JEEP_START, round1, SCENE_H } from "./terrain";

interface Props {
  slug: string;
  title: string;
  intro: string;
  milestones: Milestone[];
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function Journey({ slug, title, intro, milestones }: Props) {
  const road = useMemo(() => buildRoad(milestones), [milestones]);
  const { muted, toggle } = useSound();

  const worldRef = useRef<SVGGElement>(null);
  const farRef = useRef<SVGGElement>(null);
  const midRef = useRef<SVGGElement>(null);
  const jeepRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const [view, setView] = useState({ w: 800, h: 800 }); // screen size in scene units
  const [active, setActive] = useState(-1);

  const far = useMemo(() => farRange(road.end * 0.15 + 3000, 3, 245, 105), [road.end]);
  const mid = useMemo(() => farRange(road.end * 0.4 + 3000, 11, 275, 55), [road.end]);

  // grass colour along the road: green → snow on high ground → dusty tan after the pass
  const grassStops = useMemo(() => {
    const passI = milestones.findIndex((m) => m.terrain === "pass");
    const passX = passI >= 0 ? road.xs[passI] + 250 : Infinity;
    const stops: { o: number; c: string }[] = [];
    const total = road.end + 1600;
    for (let x = -400; x <= road.end + 1200; x += 120) {
      const snow = road.snowAt(x);
      const tan = x > passX ? clamp((x - passX) / 300, 0, 1) : 0;
      const base = tan > 0 ? mix("#5fbf3a", "#c9a46b", tan) : "#5fbf3a";
      stops.push({ o: (x + 400) / total, c: mix(base, "#f4f8ff", snow) });
    }
    return stops;
  }, [road, milestones]);

  /* ---------------- scroll → jeep ----------------
     No physics: the jeep's road position is a pure function of scroll.
     It stays at a fixed spot on screen and the landscape slides past. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anchors: [number, number][] = [];

    let viewW = 800, groundLine = 620;
    function measure() {
      const vh = window.innerHeight, vwPx = window.innerWidth;
      const phone = vwPx <= 700;
      const u = (vh * (phone ? 0.42 : 0.5)) / SCENE_H; // px per scene unit (keeps the jeep a sensible size)
      viewW = vwPx / u;
      const viewH = vh / u;
      groundLine = viewH * (phone ? 0.8 : 0.78); // where the grass sits on screen
      setView({ w: viewW, h: viewH });
      const max = document.documentElement.scrollHeight - vh;
      // checkpoint i's heading reaches 55% of the screen  →  jeep is at flag i
      anchors = [[0, JEEP_START]];
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = el.getBoundingClientRect().top + window.scrollY - vh * 0.55;
        const prev = anchors[anchors.length - 1];
        anchors.push([Math.max(s, prev[0] + 1), road.xs[i]]);
      });
      const last = anchors[anchors.length - 1];
      anchors.push([Math.max(max, last[0] + 1), road.end - 300]);
    }

    function roadX(scroll: number) {
      for (let i = 0; i < anchors.length - 1; i++) {
        const [s0, x0] = anchors[i], [s1, x1] = anchors[i + 1];
        if (scroll <= s1) return x0 + (x1 - x0) * clamp((scroll - s0) / (s1 - s0), 0, 1);
      }
      return anchors[anchors.length - 1][1];
    }

    let lastX: number | null = null;
    let wheelRot = 0;
    let lastActive = -2;
    let stopTimer = 0;
    const wheels = () => jeepRef.current?.querySelectorAll<SVGGElement>(".wheel") ?? [];

    function render() {
      const x = roadX(window.scrollY);
      const yR = road.groundY(x - 27), yF = road.groundY(x + 28);
      const ground = (yR + yF) / 2;
      const tilt = (Math.atan2(yF - yR, 55) * 180) / Math.PI; // slope of the hill under the jeep
      const camX = x - viewW * 0.4;
      const lift = road.groundY(x) - 285; // how high the road has climbed here
      const base = groundLine - 285; // pushes the 400-unit scene art down to the ground line

      worldRef.current?.setAttribute("transform", `translate(${-camX} ${base - lift})`);
      farRef.current?.setAttribute("transform", `translate(${-camX * 0.15} ${base - lift * 0.12})`);
      midRef.current?.setAttribute("transform", `translate(${-camX * 0.4} ${base - lift * 0.35})`);
      jeepRef.current?.setAttribute("transform", `translate(${x} ${ground}) rotate(${tilt})`);

      // wheels turn exactly as far as the jeep moved
      if (lastX !== null) {
        const dx = x - lastX;
        wheelRot += (dx / 13) * (180 / Math.PI);
        wheels().forEach((w) => (w.style.transform = `rotate(${wheelRot}deg)`));
        // little suspension bounce only while scrolling
        if (dx !== 0 && !reduce) {
          bodyRef.current?.classList.add("is-driving");
          clearTimeout(stopTimer);
          stopTimer = window.setTimeout(() => bodyRef.current?.classList.remove("is-driving"), 160);
        }
      }
      lastX = x;

      if (meterRef.current) meterRef.current.style.width = `${clamp((x - JEEP_START) / (road.end - 300 - JEEP_START), 0, 1) * 100}%`;

      let a = -1;
      road.xs.forEach((sx, i) => { if (x >= sx - 60) a = i; });
      if (a !== lastActive) {
        if (a > lastActive && lastActive !== -2) sfx.ding();
        lastActive = a;
        setActive(a);
      }
    }

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; render(); });
    };
    const onResize = () => { measure(); render(); };

    measure();
    // deep link: /world/treks#kedarkantha
    const hash = decodeURIComponent(location.hash.slice(1));
    const hi = milestones.findIndex((m) => m.id === hash);
    if (hi >= 0) window.scrollTo({ top: anchors[hi + 1][0] });
    render();

    sfx.engineOff();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      clearTimeout(stopTimer);
    };
  }, [road, milestones]);

  // card entrance ("ka-chunk") the first time each card scrolls in
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll(".pop-in").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const realStops = milestones.filter((m) => !m.finish).length;
  const shownCheckpoint = clamp(active + 1, 0, realStops);
  const totalKm = milestones.reduce((s, m) => s + (m.km ?? 0), 0);
  const worldIdx = worlds.findIndex((w) => w.id === slug);
  const nextWorld = worlds[(worldIdx + 1) % worlds.length];

  return (
    <div className="journey">
      {/* ---------- back: landscape, fixed behind the whole page ---------- */}
      <div className="fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#6ec6ff] to-[#d7f0ff]" />
        <div className="sky-photos" aria-hidden>
          {milestones.map((m, i) =>
            m.skyPhoto ? (
              <div key={m.id} className={`sky-photo ${i === active ? "is-on" : ""}`}>
                <PhotoArt photo={m.skyPhoto} sizes="100vw" />
              </div>
            ) : null,
          )}
        </div>

        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="xMinYMin slice">
          <g ref={farRef}>
            <path d={far.range} fill="#9fb4c8" stroke="#111" strokeWidth={2.5} strokeLinejoin="round" />
            <path d={far.caps} fill="#fff" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
          </g>
          <g ref={midRef}>
            <path d={mid.range} fill="#6f9a77" stroke="#111" strokeWidth={2.5} strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      {/* ---------- front: ground strip (grass, dirt, trees, signs, jeep) ---------- */}
      <svg className="pointer-events-none fixed inset-0 z-20 h-full w-full" viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="xMinYMin slice" aria-hidden>
          <defs>
            <linearGradient id="grass" gradientUnits="userSpaceOnUse" x1={-400} y1={0} x2={road.end + 1200} y2={0}>
              {grassStops.map((s, i) => <stop key={i} offset={s.o} stopColor={s.c} />)}
            </linearGradient>
            <pattern id="pebbles" width={60} height={40} patternUnits="userSpaceOnUse">
              <circle cx={10} cy={12} r={3} fill="#5e3a17" opacity={0.5} />
              <circle cx={42} cy={30} r={2.4} fill="#5e3a17" opacity={0.5} />
              <circle cx={30} cy={6} r={1.6} fill="#c08a52" opacity={0.6} />
            </pattern>
          </defs>
          <g ref={worldRef}>
            {road.pines.map((p, i) => <Pine key={i} {...p} />)}
            <path d={road.groundPath} fill="#8a5a2b" />
            <path d={road.groundPath} fill="url(#pebbles)" transform="translate(0 26)" />
            <path d={road.surface} fill="none" stroke="url(#grass)" strokeWidth={22} transform="translate(0 9)" />
            <path d={road.surface} fill="none" stroke="#111" strokeWidth={3.5} />
            <path d={road.surface} fill="none" stroke="#111" strokeWidth={2} opacity={0.35} transform="translate(0 20)" />
            {road.rocks.map((r, i) => (
              <ellipse key={i} cx={r.x} cy={r.y + 14} rx={9 * r.s} ry={5 * r.s} fill="#6b4a2a" stroke="#111" strokeWidth={2} />
            ))}
            {milestones.map((m, i) => (
              <Signpost key={m.id} x={road.xs[i]} y={round1(road.groundY(road.xs[i]))} m={m} on={i <= active} />
            ))}
            <g ref={jeepRef}>
              <g transform="scale(.9)">
                <g ref={bodyRef} className="jeep-body"><Jeep v={vehicle} /></g>
              </g>
            </g>
          </g>
      </svg>

      {/* ---------- HUD ---------- */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between p-3 sm:p-4">
          <div className="pointer-events-auto"><StageSwitcher current={slug} /></div>
          <div className="checkpoint-pill outline-text">
            <span className="whitespace-nowrap"><span className="hidden sm:inline">{title} · </span>CHECKPOINT {shownCheckpoint}/{realStops}</span>
            <span className="meter"><span ref={meterRef} /></span>
          </div>
          <div className="pointer-events-auto"><MuteButton muted={muted} onToggle={toggle} small /></div>
        </div>

      {/* ---------- story feed ---------- */}
      <main className="feed">
        <div className="mx-auto max-w-[640px] px-4 pt-28 pb-[62vh]">
          <section className="pop-in comic comic-intro mb-10 text-center">
            <h1 className="font-game text-[clamp(34px,7vw,52px)] leading-none text-[#1d3b5c]">{title}</h1>
            <p className="mt-2 text-lg">{intro}</p>
            <p className="scroll-hint font-game mt-3 text-xl text-[#c0392b]">▼ SCROLL TO DRIVE ▼</p>
          </section>

          {milestones.map((m, i) => (
            <section key={m.id} id={m.id} ref={(el) => { sectionRefs.current[i] = el; }} className="mb-14 scroll-mt-[45vh]">
              <header className="pop-in mb-3 flex flex-wrap items-center gap-2">
                <span className={`chip ${m.finish ? "chip-finish" : ""}`}>{m.finish ? "FINISH" : `CHECKPOINT ${i + 1}`}</span>
                <span className="chip chip-light">{m.sign.when}</span>
                <span className="chip chip-light">{m.sign.where}</span>
              </header>
              <h2 className="pop-in font-game outline-text mb-4 text-white text-[clamp(28px,6vw,40px)] leading-none">{m.sign.what}</h2>
              <div className="flex flex-col gap-4">
                {m.cards.map((c, j) => (
                  <div key={j} className="pop-in" style={{ transitionDelay: `${j * 60}ms` }}>
                    <Card card={c} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="pop-in comic comic-clear text-center">
            <p className="font-game text-[clamp(36px,8vw,56px)] leading-none text-[#1f7a14]">STAGE CLEAR!</p>
            <p className="mt-2 text-lg">
              {realStops} summits · {totalKm.toLocaleString("en-US", { maximumFractionDigits: 1 })} km on foot · 0 regrets
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/" className="chunky-btn btn-steel btn-small" onClick={() => sfx.click()}>
                <span className="outline-text">STAGES</span>
              </Link>
              {nextWorld.locked ? (
                <span className="chunky-btn btn-gray btn-small cursor-default">
                  <span className="inline-block h-6 w-6"><LockIcon /></span>
                  <span className="outline-text">{nextWorld.title}: SOON</span>
                </span>
              ) : (
                <Link href={`/world/${nextWorld.id}`} className="chunky-btn btn-green btn-small">
                  <span className="outline-text">NEXT: {nextWorld.title}</span>
                  <span className="play-tri" />
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------- scene pieces ---------------- */
function Pine({ x, y, s, snow }: { x: number; y: number; s: number; snow: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-4} y={-16} width={8} height={18} fill="#6b4226" stroke="#111" strokeWidth={2} />
      <path d="M0 -78 L22 -38 H12 L28 -12 H-28 L-12 -38 H-22Z" fill={snow ? "#3f7a5a" : "#2f8a43"} stroke="#111" strokeWidth={2.5} strokeLinejoin="round" />
      {snow && <path d="M0 -78 L12 -56 L4 -60 L-3 -54 L-12 -56Z" fill="#fff" stroke="#111" strokeWidth={1.5} strokeLinejoin="round" />}
    </g>
  );
}

function Signpost({ x, y, m, on }: { x: number; y: number; m: Milestone; on: boolean }) {
  const w = 176, h = 82;
  return (
    <g transform={`translate(${x + 70} ${y + 4})`}>
      <g className={`signpost ${on ? "is-on" : ""}`}>
        <rect x={-6} y={-112} width={12} height={116} fill="#7a4a22" stroke="#111" strokeWidth={2.5} />
        {m.finish && (
          <g transform="translate(110 0)">
            <rect x={-4} y={-170} width={8} height={174} fill="#e6e6e6" stroke="#111" strokeWidth={2.5} />
            <g transform="translate(4 -168)">
              <rect width={72} height={44} fill="#fff" stroke="#111" strokeWidth={3} />
              {Array.from({ length: 6 }, (_, c) => Array.from({ length: 4 }, (_, r) =>
                (c + r) % 2 ? <rect key={`${c}-${r}`} x={c * 12} y={r * 11} width={12} height={11} fill="#111" /> : null,
              ))}
            </g>
          </g>
        )}
        <g transform={`translate(${-w / 2} ${-112 - h + 30})`}>
          <rect width={w} height={h} rx={6} fill="#c98a4b" stroke="#111" strokeWidth={3} />
          <path d={`M8 ${h / 3} H${w - 8} M8 ${(2 * h) / 3} H${w - 8}`} stroke="#a8703a" strokeWidth={2} />
          <circle cx={9} cy={9} r={2.5} fill="#5a3415" /><circle cx={w - 9} cy={9} r={2.5} fill="#5a3415" />
          <text x={w / 2} y={24} textAnchor="middle" className="sign-what">{m.sign.what}</text>
          <text x={12} y={48} className="sign-label">WHEN</text>
          <text x={58} y={48} className="sign-text">{m.sign.when}</text>
          <text x={12} y={70} className="sign-label">WHERE</text>
          <text x={58} y={70} className="sign-text">{m.sign.where}</text>
        </g>
      </g>
    </g>
  );
}

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
