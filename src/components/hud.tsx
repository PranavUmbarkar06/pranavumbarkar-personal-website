"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";
import { worlds } from "@/content/site";
import { LockIcon, SpeakerIcon } from "./art";

/** Shared mute state: sound is on by default, starts on the first tap/key. */
export function useSound() {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    let m = false;
    try { m = localStorage.getItem("muted") === "1"; } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMuted(m);
    sfx.setMuted(m);
    const unlock = () => sfx.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
  const toggle = () => {
    const m = !muted;
    setMuted(m);
    sfx.setMuted(m);
    try { localStorage.setItem("muted", m ? "1" : "0"); } catch {}
  };
  return { muted, toggle };
}

export function MuteButton({ muted, onToggle, small = false }: { muted: boolean; onToggle: () => void; small?: boolean }) {
  return (
    <button className={`hud-btn shrink-0 bg-[#3d4651] ${small ? "hud-btn-sm size-[46px]" : "size-11 sm:size-[54px]"}`} onClick={onToggle} aria-pressed={muted}
      aria-label={muted ? "Turn sound on" : "Mute sound"} title={muted ? "Sound off" : "Sound on"}>
      <SpeakerIcon muted={muted} />
    </button>
  );
}

/** Floating pill to hop between worlds without going back to the menu. */
export function StageSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (!(e.target as HTMLElement).closest(".stage-switcher")) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="stage-switcher relative">
      <button className="chunky-btn btn-steel stages-btn" aria-expanded={open} aria-haspopup="menu"
        onClick={() => { sfx.click(); setOpen((o) => !o); }}>
        <span className="stages-grid" aria-hidden><i /><i /><i /><i /></span>
        <span className="outline-text">STAGES</span>
        <span className={`caret ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="stage-menu" role="menu">
          {worlds.map((w) =>
            w.locked ? (
              <span key={w.id} className="stage-item is-locked" role="menuitem" aria-disabled>
                <span className="inline-block h-5 w-5"><LockIcon /></span>
                <span className="outline-text">{w.title}</span>
                <span className="ml-auto text-xs text-[#c9d1d9]">SOON</span>
              </span>
            ) : (
              <Link key={w.id} href={`/world/${w.id}`} role="menuitem"
                className={`stage-item ${w.id === current ? "is-current" : ""}`} onClick={() => setOpen(false)}>
                <span className="inline-block h-5 w-5 rounded-full border-[3px] border-ink bg-[#4cc22a]" />
                <span className="outline-text">{w.title}</span>
                {w.id === current && <span className="ml-auto text-xs text-gold">HERE</span>}
              </Link>
            ),
          )}
          <Link href="/" role="menuitem" className="stage-item mt-1 border-t-2 border-black/40 pt-2" onClick={() => sfx.click()}>
            <span className="menu-back" aria-hidden /><span className="outline-text">MAIN MENU</span>
          </Link>
        </div>
      )}
    </div>
  );
}
