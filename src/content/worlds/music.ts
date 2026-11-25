/*
  ==========================================================
   MUSIC: built from folders in /public/music
  ==========================================================
   One folder = one gig / live performance. See README.md ("Adding a gig").

   public/music/
     battle-of-the-bands/    ← folder name = link id (/world/music#battle-of-the-bands)
       gig.json              ← the text, setlist, band
       1.jpg  2.jpg  3.jpg   ← photos, numbered (optional). 1 is the cover and fades into the sky.
       solo.mp3  set.mp4     ← audio / video clips (optional). Any audio or video file in the
                               folder is picked up. Name them in "clips" to give them a title.

   Gigs are ordered by "when", oldest first.
   This runs at build time (and on refresh in `npm run dev`).
*/
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Clip, Collaborator, JourneyContent, Milestone, Photo, StoryCard, TerrainHint } from "../types";

const DIR = path.join(process.cwd(), "public", "music");
const PHOTO_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const AUDIO_EXT = [".mp3", ".m4a", ".aac", ".wav", ".ogg", ".oga", ".opus", ".flac"];
const VIDEO_EXT = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The last stop on the road (not a folder). Edit freely. */
const FINISH: Milestone = {
  id: "encore",
  sign: { what: "Encore", when: "Next gig", where: "Your city?" },
  terrain: "flat",
  lift: 0,
  finish: true,
  cards: [
    { kind: "text", mood: "shout", body: "One more song?" },
    { kind: "text", body: "Putting a gig together, need a guitarist, or just want to jam? Send me a message and bring an amp." },
  ],
};

/** What a gig.json may contain. Only name and when are required. */
interface GigJson {
  name: string; // what the gig was, shown big on the sign: "Battle of the Bands"
  when: string; // "2023-02" or "2023-02-14"
  venue?: string; // full venue name, shown on the card
  where?: string; // short place for the sign (about 15 letters). Defaults to venue.
  band?: string; // band name. Leave out for a solo set.
  instruments?: string[]; // what YOU played: ["Lead guitar", "Backing vocals"]
  members?: (string | Collaborator)[]; // bandmates (not you)
  setlist?: string[];
  highlight?: string; // one punchy line, shown big
  brief?: string; // one or two sentences under the cover
  story?: string; // the longer story
  feeling?: string; // a backstage thought, shown in italics
  crowd?: string; // "300", "about 40", "1.5k"
  clips?: { file?: string; url?: string; title?: string }[];
}

// colours for drawn placeholder covers: [hall top, hall bottom, spotlight]
const PALETTES: [string, string, string][] = [
  ["#050914", "#16306b", "#e8f0ff"],
  ["#03060f", "#1d2f5e", "#cfe0ff"],
  ["#060b1c", "#22407f", "#ffffff"],
  ["#02040b", "#132a5c", "#dbe8ff"],
];

function fail(folder: string, msg: string): never {
  throw new Error(`[music] public/music/${folder}: ${msg}`);
}

function parseDate(folder: string, v: unknown) {
  const m = typeof v === "string" && v.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (!m) fail(folder, `"when" should look like "2024-03" or "2024-03-15", got ${JSON.stringify(v)}`);
  const y = Number(m[1]), mo = m[2] ? Number(m[2]) : 0, d = m[3] ? Number(m[3]) : 0;
  if (mo > 12) fail(folder, `"when" has month ${mo}`);
  const label = mo ? (d ? `${d} ${MONTHS[mo - 1]} ${y}` : `${MONTHS[mo - 1]} ${y}`) : String(y);
  const short = mo ? `${MONTHS[mo - 1]} ${y}` : String(y);
  return { sortKey: y * 10000 + mo * 100 + d, label, short };
}

const isUrl = (v: unknown): v is string => typeof v === "string" && /^https?:\/\//.test(v.trim());
const fileUrl = (folder: string, f: string) => `/music/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`;
const prettyName = (f: string) => {
  const s = path.parse(f).name.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : f;
};
const strList = (folder: string, key: string, v: unknown) => {
  if (v === undefined) return [];
  if (!Array.isArray(v)) fail(folder, `"${key}" should be a list, like ["one", "two"]`);
  return v.map(String).map((s) => s.trim()).filter(Boolean);
};

/** YouTube link → embed URL (privacy-friendly domain), or null. */
function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function readGig(folder: string, i: number) {
  const dir = path.join(DIR, folder);
  const jsonPath = path.join(dir, "gig.json");
  if (!fs.existsSync(jsonPath)) fail(folder, "missing gig.json");
  let data: GigJson;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (e) {
    fail(folder, `gig.json is not valid JSON (${(e as Error).message}). Check for a missing comma or quote.`);
  }
  if (!data.name || typeof data.name !== "string") fail(folder, `gig.json needs a "name"`);
  const date = parseDate(folder, data.when);
  if (data.members !== undefined && !Array.isArray(data.members)) fail(folder, `"members" should be a list`);
  if (data.clips !== undefined && !Array.isArray(data.clips)) fail(folder, `"clips" should be a list`);

  const files = fs.readdirSync(dir);
  const palette = PALETTES[i % PALETTES.length];
  const photos: Photo[] = files
    .filter((f) => PHOTO_EXT.includes(path.extname(f).toLowerCase()) && /^\d+$/.test(path.parse(f).name))
    .sort((a, b) => Number(path.parse(a).name) - Number(path.parse(b).name))
    .map((f, n) => ({ src: fileUrl(folder, f), alt: `${data.name}, photo ${n + 1}`, palette, scene: "hall" }));

  // clips: the ones named in gig.json first (in that order), then any other media files in the folder
  const kindOf = (f: string) => {
    const ext = path.extname(f).toLowerCase();
    return AUDIO_EXT.includes(ext) ? "audio" : VIDEO_EXT.includes(ext) ? "video" : null;
  };
  const clips: Clip[] = [];
  const used = new Set<string>();
  (data.clips ?? []).forEach((c, n) => {
    if (c?.file) {
      const f = String(c.file);
      if (!files.includes(f)) fail(folder, `clip ${n + 1}: there's no file called "${f}" in the folder`);
      const type = kindOf(f);
      if (!type) fail(folder, `clip ${n + 1}: "${f}" isn't an audio or video file (${[...AUDIO_EXT, ...VIDEO_EXT].join(" ")})`);
      used.add(f);
      clips.push({ type, src: fileUrl(folder, f), title: c.title?.trim() || prettyName(f) });
    } else if (c?.url) {
      if (!isUrl(c.url)) fail(folder, `clip ${n + 1}: "url" should be a full link starting with https://`);
      const yt = youtubeEmbed(c.url);
      clips.push(yt ? { type: "youtube", src: yt, title: c.title?.trim() || "Video" } : { type: "link", src: c.url.trim(), title: c.title?.trim() || "Watch / listen" });
    } else {
      fail(folder, `clip ${n + 1} needs a "file" (in the folder) or a "url"`);
    }
  });
  files
    .filter((f) => !used.has(f) && kindOf(f))
    .sort()
    .forEach((f) => clips.push({ type: kindOf(f)!, src: fileUrl(folder, f), title: prettyName(f) }));

  const members: Collaborator[] = (data.members ?? [])
    .map((c) => (typeof c === "string" ? { name: c } : { name: String(c?.name ?? ""), url: isUrl(c?.url) ? c.url : undefined }))
    .filter((c) => c.name.trim());

  return {
    folder, data, date, photos, palette, clips, members,
    instruments: strList(folder, "instruments", data.instruments),
    setlist: strList(folder, "setlist", data.setlist),
  };
}

// the staff road rolls like a phrase: calm, dip, big crescendo, calm, rise
const TERRAIN: TerrainHint[] = ["flat", "valley", "peak", "flat", "climb"];

export function loadMusic(): JourneyContent {
  const folders = fs.existsSync(DIR)
    ? fs.readdirSync(DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
        .map((d) => d.name)
    : [];

  const gigs = folders.map(readGig).sort((a, b) => a.date.sortKey - b.date.sortKey || a.folder.localeCompare(b.folder));

  const milestones: Milestone[] = gigs.map((g, i) => {
    const d = g.data;
    const cover: Photo = g.photos[0] ?? { src: "", alt: `${d.name} (cover)`, palette: g.palette, scene: "hall" };
    const cards: StoryCard[] = [];
    if (d.highlight) cards.push({ kind: "text", mood: "shout", body: d.highlight });
    cards.push({
      kind: "gig",
      image: cover,
      brief: d.brief,
      band: d.band?.trim() || undefined,
      venue: d.venue?.trim() || undefined,
      date: g.date.label,
      instruments: g.instruments,
      members: g.members,
      setlist: g.setlist,
    });
    if (g.clips.length) cards.push({ kind: "media", clips: g.clips });
    if (d.story) cards.push({ kind: "text", title: "The story", body: d.story });
    if (g.photos.length > 1) cards.push({ kind: "photo", photos: g.photos.slice(1, 4) });
    if (d.feeling) cards.push({ kind: "text", mood: "thought", body: d.feeling });
    const stats = [
      d.crowd && { label: "CROWD", value: String(d.crowd) },
      g.setlist.length > 0 && { label: "SONGS", value: String(g.setlist.length) },
      { label: "ON STAGE", value: g.members.length ? `${g.members.length + 1}` : "SOLO" },
    ].filter(Boolean) as { label: string; value: string }[];
    cards.push({ kind: "stats", items: stats });

    return {
      id: g.folder,
      sign: { what: d.name, when: g.date.short, where: d.where?.trim() || d.venue?.trim() || "" },
      skyPhoto: cover,
      terrain: TERRAIN[i % TERRAIN.length],
      lift: [0, 10, 25, 15, 35][i % 5],
      cards,
    };
  });

  milestones.push(FINISH);

  const songs = gigs.reduce((n, g) => n + g.setlist.length, 0);
  const players = new Set(gigs.flatMap((g) => g.members.map((m) => m.name.toLowerCase()))).size;

  return {
    slug: "music",
    title: "MUSIC",
    theme: "hall",
    intro: `${gigs.length} nights on stage, oldest first. Scroll to play.`,
    clear: `${gigs.length} gigs · ${songs} songs · ${players} bandmates · one very patient amp`,
    milestones,
  };
}
