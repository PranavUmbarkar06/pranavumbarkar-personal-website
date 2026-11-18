# Pranav's Personal Website

A game-style personal site: a "stage select" landing page and scroll-driven
worlds where a red jeep drives over the hills of your life.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS**. Hosted on Vercel.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install     # first time only
npm run dev     # then open http://localhost:3000
```

`npm run build` makes a production build (Vercel runs this for you).

## Adding a trek

Every folder in `public/treks/` is one checkpoint on the Treks road.
The number of folders = the number of checkpoints. They are ordered by
`when`, oldest first.

```
public/treks/
  kedarkantha/          ← folder name: lowercase, dashes, no spaces
    trek.json           ← the text (copy it from _template/)
    1.jpg               ← photo 1 also fades into the sky at this checkpoint
    2.jpg
    3.jpg               ← as many as you like: 1, 2, 3, ... (jpg, png, webp)
```

`trek.json` (only `name` and `when` are required):

```json
{
  "name": "Kedarkantha Summit",
  "when": "2023-12",
  "where": "Uttarakhand",
  "highlight": "3 AM. -12°C. Why do I do this?",
  "description": "Summit push in the dark, snow up to the knees the whole way.",
  "bestMemory": "The sun coming up at the summit, and the best chai of my life.",
  "altitude_m": 3810,
  "distance_km": 20,
  "days": 5
}
```

- `when` is year-month (`"2023-12"`); `"2023-12-24"` or `"2023"` also work.
- Numbers (`altitude_m`, `distance_km`, `days`) have no quotes and no units.
  Higher altitude = the road climbs higher; the highest trek gets the big peak.
- To add a trek: copy `public/treks/_template`, rename the folder, edit
  `trek.json`, drop in `1.jpg`, `2.jpg`, ... and refresh the page.
- To remove a trek: delete its folder. Folders starting with `_` are ignored.
- The 5 folders there now are made-up examples with PLACEHOLDER photos.
  Replace or delete them.
- A typo in `trek.json` stops the build with a message naming the folder.
- Big phone photos are fine: Next.js resizes them automatically.

## Other settings

| What | File |
| --- | --- |
| Counters, trophy (age), greeting, your face + corner photo | `src/content/site.ts` → `player` |
| World cards, which are locked | `src/content/site.ts` → `worlds` |
| Spotify playlist link | `src/content/site.ts` → `links.spotify` |
| Sound volume | `src/content/site.ts` → `sound` |
| Portfolio page (/recruiters): everything | `src/content/portfolio.json` (see below) |
| The finish-flag card at the end of Treks | `src/content/worlds/treks.ts` → `FINISH` |

Your face / corner photo go in `public/photos/` (e.g. `"/photos/face.png"`).

## Where things are

- `src/app/page.tsx` – stage select (landing)
- `src/app/recruiters/page.tsx` – portfolio page for recruiters (reads `portfolio.json`)
- `src/components/pro/art.tsx` – its hero illustration and ornaments
- `src/app/world/[slug]/page.tsx` – a world's journey, or a COMING SOON screen if locked
- `src/components/StageSelect.tsx` – carousel, START, Spotify, mute
- `src/content/worlds/treks.ts` – reads the trek folders at build time
- `src/components/journey/Journey.tsx` – landscape, scroll-driven jeep, story feed
- `src/components/journey/terrain.ts` – hill generator (same hills every visit)
- `src/components/journey/StoryCards.tsx` – comic card styles (text, shout, thought, photo, stats, quote)
- `src/components/art.tsx` – SVG jeep, scenes, icons
- `src/lib/sound.ts` – tiny synth for engine hum, dings and blips (no audio files)
- `src/app/globals.css` – Tailwind setup plus the chunky game styles


## Editing the portfolio (/recruiters)

Everything on the portfolio page comes from **`src/content/portfolio.json`**.
Edit it, save, and the page updates. Rules:

- To hide something, leave the text as `""` or the list as `[]`. Empty sections disappear (and drop out of the top menu).
- Lists show in the order you write them, so put the newest first.
- If you break the format (missing field, typo in a key), `npm run build` / `npm run dev` points at the problem.

| Key | What it is |
| --- | --- |
| `profile` | `name`, `headline`, `location`, `status` (e.g. "Open to internships"), `photo` (e.g. `/me.jpg` in `public/`), `summary` |
| `contact` | `email`, `phone` (empty = not shown), `resume` (PDF in `public/`, e.g. `/cv.pdf`) |
| `links` | `github`, `linkedin`, `leetcode` full URLs, plus `other`: `[{ "label": "Kaggle", "url": "https://…" }]` |
| `stats` | the big numbers: `{ "value": "9.10", "label": "CGPA" }` |
| `internships` | `role`, `org`, `where`, `start`, `end`, `points` (bullets), `tech` (list), `link` |
| `projects` | `name`, `tagline`, `when`, `tech`, `points`, `github` (repo URL), `live` (site URL) |
| `liveProjects` | same fields as `projects`; shown in their own "Live projects" section above Projects |
| `skills` | `{ "group": "Languages", "items": ["C++", "Python"] }` |
| `positions` | positions of responsibility: `title`, `org`, `start`, `end`, `points` |
| `achievements` | `title`, `detail`, `when` |
| `education` | `school`, `degree`, `start`, `end`, `score` |

Adding an internship, copy-paste this into the `internships` list:

```json
{
  "role": "Software Engineering Intern",
  "org": "Company name",
  "where": "City, India",
  "start": "May 2027",
  "end": "July 2027",
  "points": ["What you built.", "What changed because of it."],
  "tech": ["Python", "Go"],
  "link": ""
}
```

Adding a project, copy-paste this into `projects` (or `liveProjects` if it is deployed):

```json
{
  "name": "Project name",
  "tagline": "One line about it",
  "when": "March 2027",
  "tech": ["React", "FastAPI"],
  "points": ["What it does.", "The hard part you solved."],
  "github": "https://github.com/you/repo",
  "live": "https://project.example.com"
}
```
