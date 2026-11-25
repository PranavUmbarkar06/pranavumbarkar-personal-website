/*
  Deterministic road for a world. Scene units: the scene is 400 units tall,
  width depends on screen aspect. y grows downward (SVG).
*/
import type { Milestone } from "@/content/types";

export const SCENE_H = 400;
export const BASE_Y = 300; // ground height at lift 0
export const SPACING = 1100; // road distance between signposts
export const START_X = 700; // first signpost
export const JEEP_START = 220;

const r1 = (v: number) => Math.round(v * 10) / 10;
const gauss = (d: number, w: number) => Math.exp(-(d * d) / (2 * w * w));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Tiny seeded PRNG so props land in the same place every visit. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const round1 = r1;

/** bump: how bumpy the road is between signs (1 = mountain trail, ~0.3 = city street) */
export function buildRoad(milestones: Milestone[], { bump = 1 }: { bump?: number } = {}) {
  const xs = milestones.map((_, i) => START_X + i * SPACING);
  const end = xs[xs.length - 1] + 900;

  function lift(x: number) {
    if (x <= xs[0]) return milestones[0].lift * smooth(Math.max(0, Math.min(1, x / xs[0])));
    for (let i = 0; i < xs.length - 1; i++) {
      if (x <= xs[i + 1]) {
        const t = smooth((x - xs[i]) / (xs[i + 1] - xs[i]));
        return milestones[i].lift + (milestones[i + 1].lift - milestones[i].lift) * t;
      }
    }
    return milestones[milestones.length - 1].lift;
  }

  function hints(x: number) {
    let h = 0;
    milestones.forEach((m, i) => {
      const d = x - xs[i];
      if (m.terrain === "peak") h += 95 * gauss(d, 230);
      else if (m.terrain === "valley") h -= 45 * gauss(d, 260);
      else if (m.terrain === "pass") h += 60 * gauss(d, 170) - 55 * gauss(d - 420, 220);
    });
    return h;
  }

  /** how much the bumpy noise is flattened (near "flat" signs) */
  function calm(x: number) {
    let c = 1;
    milestones.forEach((m, i) => {
      if (m.terrain === "flat") c *= 1 - 0.85 * gauss(x - xs[i], 170);
    });
    return c;
  }

  function noise(x: number) {
    return bump * 16 * Math.sin(x / 170) + bump * (8 * Math.sin(x / 71 + 1.3) + 3.5 * Math.sin(x / 29 + 0.4));
  }

  /** ground y at road x */
  function groundY(x: number) {
    return BASE_Y - lift(x) - hints(x) - noise(x) * calm(x);
  }

  /** elevation 0..1 (used for snow) */
  function snowAt(x: number) {
    return Math.max(0, Math.min(1, (lift(x) + hints(x) - 115) / 60));
  }

  // SVG path for the ground surface (from -400 to end + 1200)
  const pts: string[] = [];
  for (let x = -400; x <= end + 1200; x += 10) pts.push(`${x} ${groundY(x).toFixed(1)}`);
  const surface = "M" + pts.join(" L");
  const groundPath = `${surface} L${end + 1200} 1200 L-400 1200 Z`;

  // roadside pines, skipping the area around signs
  const r = rng(7);
  const pines: { x: number; y: number; s: number; snow: boolean }[] = [];
  for (let x = -200; x < end + 1100; x += 70 + r() * 120) {
    if (xs.some((sx) => Math.abs(sx - x) < 150)) continue;
    pines.push({ x: r1(x), y: r1(groundY(x) + 2), s: r1(0.7 + r() * 0.6), snow: snowAt(x) > 0.3 });
  }

  // rocks
  const rocks: { x: number; y: number; s: number }[] = [];
  for (let x = 0; x < end + 1100; x += 160 + r() * 260) rocks.push({ x: r1(x), y: r1(groundY(x) + 3), s: r1(0.6 + r() * 0.8) });

  return { xs, end, groundY, snowAt, surface, groundPath, pines, rocks };
}

export type Road = ReturnType<typeof buildRoad>;

/** Far mountain silhouette for the parallax layer, `w` units wide. */
export function farRange(w: number, seed: number, base: number, amp: number) {
  const r = rng(seed);
  const peaks: string[] = [`M-50 ${SCENE_H + 200}`, `L-50 ${base}`];
  const caps: string[] = [];
  let x = -50;
  while (x < w + 200) {
    const half = 70 + r() * 90;
    const h = amp * (0.5 + r() * 0.6);
    const px = x + half, py = base - h;
    peaks.push(`L${px.toFixed(0)} ${py.toFixed(0)}`, `L${(x + half * 2).toFixed(0)} ${base}`);
    if (h > amp * 0.75) {
      const k = 0.28;
      caps.push(`M${(px - half * k).toFixed(0)} ${(py + h * k).toFixed(0)} L${px.toFixed(0)} ${py.toFixed(0)} L${(px + half * k).toFixed(0)} ${(py + h * k).toFixed(0)} L${(px + half * 0.1).toFixed(0)} ${(py + h * k * 0.75).toFixed(0)} L${(px - half * 0.08).toFixed(0)} ${(py + h * k * 1.05).toFixed(0)} Z`);
    }
    x += half * 2 - 30 - r() * 40;
  }
  peaks.push(`L${w + 200} ${SCENE_H + 200} Z`);
  return { range: peaks.join(" "), caps: caps.join(" ") };
}

/** City skyline for a parallax layer: buildings standing on `base`, `w` units wide. */
export function skyline(w: number, seed: number, minH: number, maxH: number, minW = 40, maxW = 90) {
  const r = rng(seed);
  const out: { x: number; w: number; h: number; kind: number; c: number }[] = [];
  let x = -60;
  while (x < w + 200) {
    const bw = minW + r() * (maxW - minW);
    out.push({ x: r1(x), w: r1(bw), h: r1(minH + Math.pow(r(), 1.6) * (maxH - minH)), kind: Math.floor(r() * 4), c: Math.floor(r() * 3) });
    x += bw - 4 + r() * 14;
  }
  return out;
}
