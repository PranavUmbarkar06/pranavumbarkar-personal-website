/*
  ==========================================================
   TREKS: built from folders in /public/treks
  ==========================================================
   One folder = one checkpoint. See README.md ("Adding a trek").

   public/treks/
     kedarkantha/            ← folder name = link id (/world/treks#kedarkantha)
       trek.json             ← the text
       1.jpg  2.jpg  3.jpg   ← photos, numbered. 1 also fades into the sky.

   Checkpoints are ordered by "when", oldest first.
   This runs at build time (and on refresh in `npm run dev`).
*/
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { JourneyContent, Milestone, Photo, StoryCard, TerrainHint } from "../types";

const DIR = path.join(process.cwd(), "public", "treks");
const PHOTO_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The last stop on the road (not a folder). Edit freely. */
const FINISH: Milestone = {
  id: "next",
  sign: { what: "Next summit", when: "Soon", where: "Loading..." },
  terrain: "flat",
  lift: 0,
  finish: true,
  cards: [
    { kind: "text", mood: "shout", body: "Next summit loading..." },
    { kind: "text", body: "Got a trek I should do next? I'm listening." },
  ],
};

/** What a trek.json may contain. Only name and when are required. */
interface TrekJson {
  name: string;
  when: string; // "2023-12" (or "2023-12-24", or "2023")
  where?: string;
  highlight?: string;
  bestMemory?: string;
  description?: string;
  altitude_m?: number;
  distance_km?: number;
  days?: number;
}

// colours for drawn placeholders when a trek has no photos yet
const PALETTES: [string, string, string][] = [
  ["#ffb76b", "#ffe4b5", "#8a6a4f"],
  ["#6d8a96", "#c9d9de", "#2f6b3a"],
  ["#ff7e5f", "#feb47b", "#4b3b5c"],
  ["#5b86e5", "#b6d8ff", "#7d8fa8"],
  ["#3a7bd5", "#a8d8ff", "#b08a62"],
];

function fail(folder: string, msg: string): never {
  throw new Error(`[treks] public/treks/${folder}: ${msg}`);
}

function parseWhen(folder: string, when: unknown) {
  const m = typeof when === "string" && when.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (!m) fail(folder, `"when" should look like "2023-12" (year-month), got ${JSON.stringify(when)}`);
  const y = Number(m[1]), mo = m[2] ? Number(m[2]) : 0, d = m[3] ? Number(m[3]) : 0;
  if (mo > 12) fail(folder, `"when" has month ${mo}`);
  return { sortKey: y * 10000 + mo * 100 + d, label: mo ? `${MONTHS[mo - 1]} ${y}` : String(y) };
}

function readTrek(folder: string, i: number) {
  const dir = path.join(DIR, folder);
  const jsonPath = path.join(dir, "trek.json");
  if (!fs.existsSync(jsonPath)) fail(folder, "missing trek.json");
  let data: TrekJson;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (e) {
    fail(folder, `trek.json is not valid JSON (${(e as Error).message}). Check for a missing comma or quote.`);
  }
  if (!data.name || typeof data.name !== "string") fail(folder, `trek.json needs a "name"`);
  const when = parseWhen(folder, data.when);
  for (const k of ["altitude_m", "distance_km", "days"] as const) {
    if (data[k] !== undefined && typeof data[k] !== "number") fail(folder, `"${k}" should be a plain number, like 3810`);
  }

  // photos: 1.jpg, 2.jpg, ... in number order
  const palette = PALETTES[i % PALETTES.length];
  const snow = (data.altitude_m ?? 0) >= 3000;
  const photos: Photo[] = fs
    .readdirSync(dir)
    .filter((f) => PHOTO_EXT.includes(path.extname(f).toLowerCase()) && /^\d+$/.test(path.parse(f).name))
    .sort((a, b) => Number(path.parse(a).name) - Number(path.parse(b).name))
    .map((f, n) => ({
      src: `/treks/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`,
      alt: `${data.name}, photo ${n + 1}`,
      palette,
      snow,
    }));

  return { folder, data, when, photos, palette, snow };
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function loadTreks(): JourneyContent {
  const folders = fs.existsSync(DIR)
    ? fs.readdirSync(DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
        .map((d) => d.name)
    : [];

  const treks = folders.map(readTrek).sort((a, b) => a.when.sortKey - b.when.sortKey || a.folder.localeCompare(b.folder));
  const maxAlt = Math.max(0, ...treks.map((t) => t.data.altitude_m ?? 0));

  let prevLift = 0;
  const milestones: Milestone[] = treks.map((t, i) => {
    const d = t.data;
    // road height follows altitude (roughly), so later, higher treks climb
    const lift = d.altitude_m !== undefined ? Math.max(0, Math.min(170, (d.altitude_m - 800) / 22)) : prevLift;
    const terrain: TerrainHint =
      i === 0 ? "flat"
      : d.altitude_m !== undefined && d.altitude_m === maxAlt ? "peak"
      : lift > prevLift + 20 ? "climb"
      : lift < prevLift - 20 ? "valley"
      : "flat";
    prevLift = lift;

    const cards: StoryCard[] = [];
    if (d.highlight) cards.push({ kind: "text", mood: "shout", body: d.highlight });
    if (d.description) cards.push({ kind: "text", body: d.description });
    if (t.photos.length) cards.push({ kind: "photo", photos: t.photos });
    if (d.bestMemory) cards.push({ kind: "text", title: "Best memory", body: d.bestMemory });
    const stats = [
      d.altitude_m !== undefined && { label: "ALTITUDE", value: `${fmt(d.altitude_m)} m` },
      d.distance_km !== undefined && { label: "DISTANCE", value: `${fmt(d.distance_km)} km` },
      d.days !== undefined && { label: "DAYS", value: fmt(d.days) },
    ].filter(Boolean) as { label: string; value: string }[];
    if (stats.length) cards.push({ kind: "stats", items: stats });

    return {
      id: t.folder,
      sign: { what: d.name, when: t.when.label, where: d.where ?? "" },
      skyPhoto: t.photos[0] ?? { src: "", alt: d.name, palette: t.palette, snow: t.snow },
      terrain,
      lift,
      km: d.distance_km,
      cards,
    };
  });

  milestones.push({ ...FINISH, lift: Math.max(0, prevLift - 20) });
  const totalKm = treks.reduce((s, t) => s + (t.data.distance_km ?? 0), 0);

  return {
    slug: "treks",
    title: "TREKS",
    theme: "mountains",
    clear: `${treks.length} summits · ${fmt(totalKm)} km on foot · 0 regrets`,
    intro: `${treks.length} climbs, oldest first. Scroll to drive.`,
    milestones,
  };
}
