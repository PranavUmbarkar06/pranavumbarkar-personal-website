"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { links, player, vehicle, worlds } from "@/content/site";
import { sfx } from "@/lib/sound";
import { BriefcaseIcon, HostFigure, LockIcon, Scene, SpotifyIcon, TrophyIcon } from "./art";
import { MuteButton, useSound } from "./hud";

const n = worlds.length;

/** -2..2 style offset of card i from the current card, wrapping around. */
function offset(i: number, cur: number) {
  let d = (((i - cur) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

export default function StageSelect() {
  const router = useRouter();
  const [cur, setCur] = useState(0);
  const [shake, setShake] = useState(0);
  const [loadingKey, setLoadingKey] = useState(0); // 0 = closed, otherwise remounts the loader
  const [drag, setDrag] = useState<number | null>(null);
  const [cardW, setCardW] = useState(0);

  const firstCard = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const wheelLock = useRef(0);

  const world = worlds[cur];
  const go = useCallback((step: number) => {
    sfx.swipe();
    setCur((c) => (c + step + n) % n);
  }, []);
  const pick = useCallback((i: number) => {
    sfx.swipe();
    setCur(i);
  }, []);

  const launch = useCallback((i: number) => {
    sfx.rev();
    setCur(i);
    setLoadingKey((k) => k + 1);
    const id = worlds[i].id;
    router.prefetch(`/world/${id}`);
    setTimeout(() => router.push(`/world/${id}`), 1300);
  }, [router]);

  const start = useCallback(() => {
    if (worlds[cur].locked) {
      sfx.locked();
      setShake((k) => k + 1);
      return;
    }
    launch(cur);
  }, [cur, launch]);

  const { muted, toggle: toggleMute } = useSound();
  useEffect(() => sfx.engineOn(), []);

  // card width drives how far side cards sit
  useLayoutEffect(() => {
    const measure = () => setCardW(firstCard.current?.offsetWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loadingKey) {
        if (e.key === "Escape") setLoadingKey(0);
        return;
      }
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Enter" && !(e.target as HTMLElement).closest("button")) start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadingKey, go, start]);

  // swipe / drag
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".arrow")) return;
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (drag !== null || Math.abs(dx) > 6) setDrag(dx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    const wasDrag = drag !== null;
    startX.current = null;
    setDrag(null);
    if (dx > 50) return go(-1);
    if (dx < -50) return go(1);
    if (wasDrag) return;
    // a tap: centre card starts, side card becomes centre
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-i]");
    if (!el) return;
    const i = Number(el.dataset.i);
    if (i === cur) start();
    else pick(i);
  };
  const onWheel = (e: React.WheelEvent) => {
    const v = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(v) < 20 || Date.now() < wheelLock.current) return;
    wheelLock.current = Date.now() + 450;
    go(v > 0 ? 1 : -1);
  };

  const shift = cardW * 0.78;

  return (
    <div className="relative h-dvh overflow-hidden select-none">
      {/* ---------- background ---------- */}
      <div className="stage-bg fixed inset-0 -z-0 overflow-hidden" aria-hidden>
        <div className="spot spot-l" />
        <div className="spot spot-r" />
        <svg className="absolute bottom-0 left-0 h-[38vh] w-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0 180 Q150 90 300 160 T600 140 T900 170 T1200 120 V300 H0Z" fill="#1d2733" />
          <path d="M0 230 Q200 170 400 220 T800 210 T1200 200 V300 H0Z" fill="#141b24" />
        </svg>
      </div>

      {/* ---------- HUD ---------- */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex flex-col gap-1.5">
          <Counter icon="coin" value={player.coins} />
          <Counter icon="gem" value={player.gems} />
        </div>
        <div className="flex items-start gap-3 sm:gap-4">
          <a className="hud-btn size-11 shrink-0 bg-[#1db954] sm:size-[54px]" href={links.spotify} target="_blank" rel="noopener noreferrer"
            aria-label="My favourite songs on Spotify" title="My favourite songs on Spotify">
            <SpotifyIcon />
          </a>
          <MuteButton muted={muted} onToggle={toggleMute} />
          <div className="relative h-14 w-14 sm:h-[70px] sm:w-[70px]" title="Trophies (that's my age)">
            <TrophyIcon />
            <span className="pill-green outline-text absolute -right-1.5 -bottom-1 min-w-9 px-1.5 text-center text-lg sm:text-[22px]">
              {player.trophies}
            </span>
          </div>
        </div>
      </header>

      {/* ---------- stage select ---------- */}
      <main className="relative z-[2] flex h-full flex-col items-center justify-center pt-10 pb-[150px] sm:pb-[130px] short:pb-[100px]">
        <h1 className="outline-text mb-2.5 text-[clamp(30px,5vw,52px)] tracking-wide">{world.title}</h1>

        <div
          className={`relative h-[clamp(190px,38vw,340px)] w-full touch-pan-y outline-none ${drag !== null ? "cursor-grabbing" : "cursor-grab"}`}
          tabIndex={0}
          aria-label="World select. Use left and right arrows."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { startX.current = null; setDrag(null); }}
          onWheel={onWheel}
        >
          {worlds.map((w, i) => {
            const d = offset(i, cur);
            const ad = Math.abs(d);
            return (
              <div
                key={w.id}
                ref={i === 0 ? firstCard : undefined}
                data-i={i}
                className={`world-card ${w.locked ? "is-locked" : ""} ${ad === 0 ? "is-center" : ad === 1 ? "is-side" : "is-far"} ${drag !== null ? "transition-none!" : ""}`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${d * shift + (drag ?? 0) * 0.6}px) scale(${ad === 0 ? 1 : 0.6})`,
                  zIndex: 3 - ad,
                }}
              >
                {w.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Scene world={w} vehicle={vehicle} />
                )}
                {w.locked && (
                  <div className="lock-veil">
                    <span className="lock-badge"><LockIcon /></span>
                    <span className="outline-text text-[clamp(18px,3vw,30px)]">COMING SOON</span>
                  </div>
                )}
                <span className="outline-text absolute right-2.5 bottom-2.5 rounded-xl border-[3px] border-ink bg-black/55 px-2.5 py-0.5 text-base">
                  {w.stat}
                </span>
              </div>
            );
          })}
          <button className="arrow arrow-prev" aria-label="Previous world" onClick={() => go(-1)} />
          <button className="arrow arrow-next" aria-label="Next world" onClick={() => go(1)} />
        </div>

        <p className="outline-text mt-3.5 mb-1.5 text-[clamp(15px,2vw,20px)] text-[#e8eef5] short:hidden">{world.subtitle}</p>
        <div className="flex gap-2 short:hidden">
          {worlds.map((w, i) => (
            <button
              key={w.id}
              aria-label={w.title}
              onClick={() => pick(i)}
              className={`h-3 w-3 rounded-full border-2 border-ink transition ${i === cur ? "scale-125 bg-gold" : "bg-[#4a5562]"}`}
            />
          ))}
        </div>
      </main>

      {/* ---------- bottom buttons ---------- */}
      <nav className="fixed inset-x-0 bottom-[max(18px,env(safe-area-inset-bottom))] z-10 flex items-center justify-center gap-3 px-4 sm:gap-5">
        <Link href="/recruiters" className="chunky-btn btn-steel btn-recruiter" onClick={() => sfx.click()}>
          <span className="inline-block h-6 w-6 shrink-0 sm:h-7 sm:w-7"><BriefcaseIcon /></span>
          <span className="outline-text leading-none">FOR<br className="sm:hidden" /> RECRUITERS</span>
        </Link>
        {world.locked ? (
          <button key={shake} className={`chunky-btn btn-gray min-w-[150px] justify-center sm:min-w-[240px] ${shake ? "btn-shake" : ""}`}
            onClick={start} aria-label={`${world.title} is coming soon`}>
            <span className="lock-wiggle inline-block h-7 w-7"><LockIcon /></span>
            <span className="outline-text">COMING SOON</span>
          </button>
        ) : (
          <button className="chunky-btn btn-green btn-pulse min-w-[150px] justify-center sm:min-w-[240px]" onClick={start}>
            <span className="outline-text">START</span>
            <span className="play-tri" />
          </button>
        )}
      </nav>

      {/* ---------- corner host ---------- */}
      <aside className="pointer-events-none fixed bottom-3.5 left-3.5 z-20 hidden flex-col items-start md:flex short:hidden">
        <div className="bubble">{player.greeting}</div>
        <div className="host-wave aspect-[3/4] w-[clamp(90px,12vw,150px)]">
          <HostFigure />
        </div>
      </aside>

      {/* ---------- loading after START ---------- */}
      {loadingKey > 0 && (
        <div className="overlay" key={loadingKey}>
          <div className="w-full max-w-[460px] text-center">
            <div className="outline-text mb-4.5 text-[clamp(40px,8vw,72px)]">{world.title}</div>
            <div className="mb-3.5 h-7 overflow-hidden rounded-[14px] border-[5px] border-ink bg-[#222]">
              <div className="bar-fill h-full" />
            </div>
            <p className="text-lg text-[#dde6ee]">Warming up the engine...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Counter({ icon, value }: { icon: "coin" | "gem"; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-[20px] border-[3px] border-ink bg-black/35 py-0.5 pr-3.5 pl-1 text-lg sm:text-[22px]">
      <span className={`ico ico-${icon}`} />
      <span className="outline-text">{value.toLocaleString("en-US")}</span>
    </div>
  );
}
