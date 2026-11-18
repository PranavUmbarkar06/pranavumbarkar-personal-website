/*
  Tiny synth sound kit (Web Audio, no files needed).
  Browsers only allow audio after the visitor's first click/tap/key,
  so sound starts on that first interaction.
*/
import { sound } from "@/content/site";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let music: HTMLAudioElement | null = null;
let muted = false;
let engineGain: GainNode | null = null;
let engineWanted = true;

function ensure() {
  if (ctx || typeof window === "undefined") return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : sound.volume;
  master.connect(ctx.destination);
  startEngine();
  if (sound.music) {
    music = new Audio(sound.music);
    music.loop = true;
    music.volume = sound.volume;
    music.muted = muted;
    music.play().catch(() => {});
  }
  return ctx;
}

/** Low idle engine hum that loops quietly in the background. */
function startEngine() {
  if (!ctx || !master) return;
  const hum = ctx.createGain();
  engineGain = hum;
  hum.gain.value = engineWanted ? 0.18 : 0;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 260;
  hum.connect(lp).connect(master);
  [55, 82.5].forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i ? "square" : "sawtooth";
    o.frequency.value = f;
    // little putt-putt wobble
    const lfo = ctx!.createOscillator();
    const lfoGain = ctx!.createGain();
    lfo.frequency.value = 7 + i * 2;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain).connect(o.frequency);
    o.connect(hum);
    o.start();
    lfo.start();
  });
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = "square", slideTo?: number, level = 0.7) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  /** Call on any user gesture; starts audio the first time. */
  unlock() {
    const c = ensure();
    if (c && c.state === "suspended") c.resume();
  },
  swipe() { tone(420, 0, 0.09, "triangle", 760, 0.5); },
  start() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.14)); },
  locked() { tone(196, 0, 0.12, "square", undefined, 0.6); tone(147, 0.12, 0.18, "square", undefined, 0.6); },
  ding() { tone(1319, 0, 0.25, "triangle", undefined, 0.6); tone(1760, 0.08, 0.3, "triangle", undefined, 0.5); },
  rev() { tone(70, 0, 0.6, "sawtooth", 220, 0.7); },
  /** Silence the engine hum (used on story pages). */
  engineOff() {
    engineWanted = false;
    if (ctx && engineGain) engineGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
  },
  engineOn() {
    engineWanted = true;
    if (ctx && engineGain) engineGain.gain.setTargetAtTime(0.18, ctx.currentTime, 0.1);
  },
  click() { tone(880, 0, 0.05, "square", undefined, 0.4); },
  setMuted(m: boolean) {
    muted = m;
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : sound.volume, ctx.currentTime, 0.05);
    if (music) music.muted = m;
  },
};
