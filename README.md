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

## Adding a project

The Projects world (neon city) works the same way: every folder in
`public/projects/` is one checkpoint, ordered by `when` (start date), oldest first.

```
public/projects/
  trail-tracker/        ← folder name = link id (/world/projects#trail-tracker)
    project.json        ← the text (copy it from _template/)
    1.png               ← cover image (also fades into the sky). Optional:
    2.png  3.png           without images a drawn neon placeholder is shown.
```

`project.json` (only `name` and `when` are required):

```json
{
  "name": "Trail Tracker",
  "when": "2024-09",
  "end": "2025-01",
  "where": "Side project",
  "status": "Shipped",
  "role": "Full-stack",
  "highlight": "Treks, meet code.",
  "brief": "One or two sentences: what it is and who it's for.",
  "story": "The longer story.",
  "learned": "One thing you learned.",
  "tech": ["Next.js", "TypeScript"],
  "collaborators": ["Kabir Singh", { "name": "Meera Joshi", "url": "https://github.com/meera" }],
  "github": "https://github.com/you/trail-tracker",
  "demo": "https://trail-tracker.vercel.app",
  "metric": { "label": "Users", "value": "120" }
}
```

- `end` is a date like `when`, or `"ongoing"`. Leave it out for a one-off (a hackathon weekend).
- `demo` is only shown when filled in, so leave it `""` if the project isn't hosted.
- `collaborators` can be plain names or `{ "name", "url" }` (url makes the name a link). `[]` = "Solo build".
- Keep `where` short (about 15 letters) so it fits on the neon sign.
- The 6 folders there now are made-up examples. Replace or delete them, and
  update the "6 builds" `stat` for Projects in `src/content/site.ts`.

## Adding a gig (Music world)

The Music world (concert hall at night) works the same way: every folder in
`public/music/` is one gig, ordered by `when`, oldest first.

```
public/music/
  battle-of-the-bands/  ← folder name = link id (/world/music#battle-of-the-bands)
    gig.json            ← the text (copy it from _template/)
    1.jpg               ← cover photo (also fades into the sky). Optional:
    2.jpg  3.jpg           without photos a drawn stage placeholder is shown.
    solo.mp3  set.mp4   ← audio / video clips. Optional. Any audio or video
                           file in the folder shows up in the "Jukebox" card.
```

`gig.json` (only `name` and `when` are required):

```json
{
  "name": "Battle of the Bands",
  "when": "2023-02-11",
  "venue": "College auditorium, Pune",
  "where": "Auditorium",
  "band": "Fuzz & Fables",
  "instruments": ["Lead guitar"],
  "members": ["Kabir Singh", { "name": "Meera Joshi", "url": "https://instagram.com/meera" }],
  "setlist": ["Song one", "Song two"],
  "highlight": "Second place, one snapped string.",
  "brief": "One or two sentences about the night.",
  "story": "The longer story.",
  "feeling": "A backstage thought (shown in italics).",
  "crowd": "600",
  "clips": [
    { "file": "solo.mp3", "title": "The solo, phone recording" },
    { "url": "https://www.youtube.com/watch?v=VIDEO_ID", "title": "Full set" }
  ]
}
```

- `when` can be `"2023-02"` or a full date `"2023-02-11"`.
- `instruments` = what you played. `members` = your bandmates (not you); `[]` = solo set.
- `clips`: `file` is a file in the same folder (mp3, m4a, wav, ogg, mp4, webm, mov...).
  `url` can be a YouTube link (played right in the card) or any other link (shown as a button).
  You only need to list a file in `clips` to give it a nice title or put it first.
- Phone videos can be big. Keep clips short (under ~20 MB) or put long ones on YouTube.
- Keep `where` short (about 15 letters) so it fits on the sign.
- The 5 folders there now are made-up examples (the two .wav files are placeholder
  tunes). Replace or delete them, and update the "5 gigs" `stat` for Music in `src/content/site.ts`.

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
- `src/app/recruiters/projects/page.tsx`, `src/app/recruiters/achievements/page.tsx` – full lists
- `src/components/pro/shell.tsx` – shared menu, footer, section and entry pieces
- `src/components/pro/art.tsx` – hero illustration and ornaments
- `src/app/world/[slug]/page.tsx` – a world's journey, or a COMING SOON screen if locked
- `src/components/StageSelect.tsx` – carousel, START, Spotify, mute
- `src/content/worlds/treks.ts`, `projects.ts`, `music.ts` – read each world's folders at build time
- `src/components/journey/Journey.tsx` – landscape, scroll-driven jeep, story feed
- `src/components/journey/terrain.ts` – hill generator (same hills every visit)
- `src/components/journey/StoryCards.tsx` – comic card styles (text, shout, thought, photo, stats, quote)
- `src/components/journey/HallScene.tsx` – Music world art (dome, arches, staff road, instruments)
- `src/components/journey/WinCards.tsx` – Music world cards drawn as retro desktop windows, plus the audio player
- `src/components/art.tsx` – SVG jeep, scenes, icons
- `src/lib/sound.ts` – tiny synth for engine hum, dings and blips (no audio files)
- `src/app/globals.css` – Tailwind setup plus the chunky game styles


## Editing the portfolio (/recruiters)

Everything on the portfolio page comes from **`src/content/portfolio.json`**.
Edit it, save, and the page updates. Rules:

- To hide something, leave the text as `""` or the list as `[]`. Empty sections disappear (and drop out of the top menu).
- Lists show in the order you write them, so put your best first. The main page shows the **first 3 projects** (live projects first) and the **first 5 achievements**; the full lists are on `/recruiters/projects` and `/recruiters/achievements`. Change the numbers in `PREVIEW` in `src/content/portfolio.ts`.
- If you break the format (missing field, typo in a key), `npm run build` / `npm run dev` points at the problem.

| Key | What it is |
| --- | --- |
| `profile` | `name`, `headline`, `location`, `status` (e.g. "Open to internships"), `photo` (e.g. `/me.jpg` in `public/`), `summary` |
| `contact` | `email`, `phone` (empty = not shown), `resume` (PDF in `public/`, e.g. `/cv.pdf`) |
| `links` | `github`, `linkedin`, `leetcode` full URLs, plus `other`: `[{ "label": "Kaggle", "url": "https://…" }]` |
| `stats` | the big numbers: `{ "value": "9.10", "label": "CGPA" }` |
| `internships` | `role`, `org`, `where`, `start`, `end`, `points` (bullets), `tech` (list), `link` |
| `projects` | `name`, `tagline`, `when`, `description` (short paragraph, shown on the main page card), `tech`, `points` (detail bullets, projects page), `github` (repo URL), `live` (site URL) |
| `liveProjects` | same fields as `projects`; shown in their own "Live projects" section above Projects |
| `skills` | `{ "group": "Languages", "items": ["C++", "Python"] }` |
| `positions` | positions of responsibility: `title`, `org`, `start`, `end`, `points` |
| `achievements` | `title`, `detail` (short tag like "1st place"), `when`, `where`, `description` (the what, shown on the achievements page) |
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
  "description": "Two or three sentences on what it is and why it matters.",
  "tech": ["React", "FastAPI"],
  "points": ["What it does.", "The hard part you solved."],
  "github": "https://github.com/you/repo",
  "live": "https://project.example.com"
}
```

Adding an achievement, copy-paste this into `achievements`:

```json
{
  "title": "Winner, Some Hackathon",
  "detail": "1st place",
  "when": "Feb 2027",
  "where": "IIT Bombay",
  "description": "What it was, what you built or did, and what you won."
}
```
