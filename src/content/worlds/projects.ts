/*
  ==========================================================
   PROJECTS: built from folders in /public/projects
  ==========================================================
   One folder = one checkpoint. See README.md ("Adding a project").

   public/projects/
     pixel-weather/          ← folder name = link id (/world/projects#pixel-weather)
       project.json          ← the text and links
       1.png  2.png  3.png   ← screenshots/photos, numbered (optional).
                               1 is the cover and also fades into the sky.

   Checkpoints are ordered by "when" (start date), oldest first.
   This runs at build time (and on refresh in `npm run dev`).
*/
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Collaborator, JourneyContent, Milestone, Photo, StoryCard, TerrainHint } from "../types";

const DIR = path.join(process.cwd(), "public", "projects");
const PHOTO_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The last stop on the road (not a folder). Edit freely. */
const FINISH: Milestone = {
  id: "next",
  sign: { what: "Next build", when: "Soon", where: "My garage" },
  terrain: "flat",
  lift: 0,
  finish: true,
  cards: [
    { kind: "text", mood: "shout", body: "Next build compiling..." },
    { kind: "text", body: "Got an idea worth building, or want to build one together? My inbox is open." },
  ],
};

/** What a project.json may contain. Only name and when are required. */
interface ProjectJson {
  name: string;
  when: string; // start: "2024-03" (or "2024-03-10", or "2024")
  end?: string; // finish: same format, or "ongoing". Leave out for a one-off (hackathon weekend).
  where?: string; // shown on the signpost, e.g. "Hackathon, IIT Bombay"
  status?: string; // "Shipped", "In progress", "Prototype", "Archived", "Won 1st place"...
  role?: string;
  highlight?: string;
  brief?: string;
  story?: string;
  learned?: string;
  tech?: string[];
  collaborators?: (string | Collaborator)[];
  github?: string;
  demo?: string; // only shown when set (i.e. the project is hosted somewhere)
  metric?: { label: string; value: string };
}

// colours for drawn placeholder covers: [sky top, sky bottom, neon accent]
const PALETTES: [string, string, string][] = [
  ["#3b1c6e", "#ff6fa8", "#2de2e6"],
  ["#1f2a6b", "#ff9a3c", "#ff3d9a"],
  ["#4a1458", "#ffb36b", "#25d6c4"],
  ["#22125a", "#f25fbf", "#ffd23f"],
  ["#103a5c", "#ff7d6b", "#ff4fd8"],
];

function fail(folder: string, msg: string): never {
  throw new Error(`[projects] public/projects/${folder}: ${msg}`);
}

function parseDate(folder: string, key: string, v: unknown) {
  const m = typeof v === "string" && v.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (!m) fail(folder, `"${key}" should look like "2024-03" (year-month), got ${JSON.stringify(v)}`);
  const y = Number(m[1]), mo = m[2] ? Number(m[2]) : 0, d = m[3] ? Number(m[3]) : 0;
  if (mo > 12) fail(folder, `"${key}" has month ${mo}`);
  return { y, mo, sortKey: y * 10000 + mo * 100 + d, label: mo ? `${MONTHS[mo - 1]} ${y}` : String(y) };
}

const isUrl = (v: unknown): v is string => typeof v === "string" && /^https?:\/\//.test(v.trim());

function readProject(folder: string, i: number) {
  const dir = path.join(DIR, folder);
  const jsonPath = path.join(dir, "project.json");
  if (!fs.existsSync(jsonPath)) fail(folder, "missing project.json");
  let data: ProjectJson;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (e) {
    fail(folder, `project.json is not valid JSON (${(e as Error).message}). Check for a missing comma or quote.`);
  }
  if (!data.name || typeof data.name !== "string") fail(folder, `project.json needs a "name"`);
  const start = parseDate(folder, "when", data.when);
  const ongoing = typeof data.end === "string" && data.end.trim().toLowerCase() === "ongoing";
  const end = data.end && !ongoing ? parseDate(folder, "end", data.end) : null;
  if (end && end.sortKey < start.sortKey) fail(folder, `"end" is before "when"`);
  for (const k of ["github", "demo"] as const) {
    if (data[k] && !isUrl(data[k])) fail(folder, `"${k}" should be a full link starting with https://`);
  }
  if (data.tech !== undefined && !Array.isArray(data.tech)) fail(folder, `"tech" should be a list, like ["React", "Python"]`);
  if (data.collaborators !== undefined && !Array.isArray(data.collaborators)) fail(folder, `"collaborators" should be a list`);

  const palette = PALETTES[i % PALETTES.length];
  const photos: Photo[] = fs
    .readdirSync(dir)
    .filter((f) => PHOTO_EXT.includes(path.extname(f).toLowerCase()) && /^\d+$/.test(path.parse(f).name))
    .sort((a, b) => Number(path.parse(a).name) - Number(path.parse(b).name))
    .map((f, n) => ({
      src: `/projects/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`,
      alt: `${data.name}, image ${n + 1}`,
      palette,
      scene: "city",
    }));

  const collaborators: Collaborator[] = (data.collaborators ?? [])
    .map((c) => (typeof c === "string" ? { name: c } : { name: String(c?.name ?? ""), url: isUrl(c?.url) ? c.url : undefined }))
    .filter((c) => c.name.trim());

  return { folder, data, start, end, ongoing, photos, palette, collaborators };
}

/** "Mar 2024 – Jun 2024", "Mar 2024 – now", or just "Mar 2024". */
function dateRange(p: ReturnType<typeof readProject>) {
  if (p.ongoing) return `${p.start.label} – now`;
  if (p.end && p.end.label !== p.start.label) return `${p.start.label} – ${p.end.label}`;
  return p.start.label;
}

/** "3 mo", "1 yr 2 mo", "ONGOING", or "" when unknown. */
function duration(p: ReturnType<typeof readProject>) {
  if (p.ongoing) return "ONGOING";
  const e = p.start.mo && p.end?.mo ? p.end : null;
  if (!e) return "";
  const months = (e.y - p.start.y) * 12 + (e.mo - p.start.mo) + 1;
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12), m = months % 12;
  return m ? `${y} yr ${m} mo` : `${y} yr`;
}

export function loadProjects(): JourneyContent {
  const folders = fs.existsSync(DIR)
    ? fs.readdirSync(DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
        .map((d) => d.name)
    : [];

  const projects = folders.map(readProject).sort((a, b) => a.start.sortKey - b.start.sortKey || a.folder.localeCompare(b.folder));

  // the city is mostly flat: gentle overpasses that slowly rise as the builds get bigger
  const milestones: Milestone[] = projects.map((p, i) => {
    const d = p.data;
    const lift = Math.min(60, i * 12);
    const terrain: TerrainHint = i % 3 === 2 ? "climb" : "flat";
    const cover: Photo = p.photos[0] ?? { src: "", alt: `${d.name} (cover)`, palette: p.palette, scene: "city" };

    const cards: StoryCard[] = [];
    if (d.highlight) cards.push({ kind: "text", mood: "shout", body: d.highlight });
    cards.push({
      kind: "project",
      image: cover,
      brief: d.brief,
      status: d.status,
      role: d.role,
      dates: dateRange(p),
      tech: (d.tech ?? []).map(String).filter(Boolean),
      collaborators: p.collaborators,
      github: d.github || undefined,
      demo: d.demo || undefined,
    });
    if (d.story) cards.push({ kind: "text", title: "The story", body: d.story });
    if (p.photos.length > 1) cards.push({ kind: "photo", photos: p.photos.slice(1, 4) });
    if (d.learned) cards.push({ kind: "text", mood: "thought", body: d.learned });
    const dur = duration(p);
    const stats = [
      dur && { label: "BUILD TIME", value: dur },
      { label: "CREW", value: p.collaborators.length ? `${p.collaborators.length + 1}` : "SOLO" },
      d.metric?.label && d.metric.value && { label: d.metric.label.toUpperCase(), value: String(d.metric.value) },
    ].filter(Boolean) as { label: string; value: string }[];
    cards.push({ kind: "stats", items: stats });

    return {
      id: p.folder,
      sign: { what: d.name, when: p.start.label, where: d.where ?? "" },
      skyPhoto: cover,
      terrain,
      lift,
      cards,
    };
  });

  milestones.push({ ...FINISH, lift: Math.min(60, projects.length * 12) });

  const crew = new Set(projects.flatMap((p) => p.collaborators.map((c) => c.name.toLowerCase()))).size;
  const shipped = projects.filter((p) => p.data.demo).length;

  return {
    slug: "projects",
    title: "PROJECTS",
    theme: "city",
    intro: `${projects.length} builds, oldest first. Scroll to cruise.`,
    clear: `${projects.length} builds · ${crew} collaborators · ${shipped} live demos · countless bugs`,
    milestones,
  };
}
