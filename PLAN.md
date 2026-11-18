# Pranav's Personal Website: Full Plan

Status: v2 (2026-11-18). Pranav's answers are folded in; see "Decisions" right below.

Stack: Next.js (App Router) + TypeScript + Tailwind, hosted on **Vercel**. No backend. All content lives in typed data files in the repo.

This is a fun gimmick site, not a recruiter portfolio. No CV, no "About" fallback page.

## Decisions (2026-11-18)

| Topic | Decision |
|---|---|
| Milestone order | Oldest first, every world reads like a journey. |
| VEHICLE button | No customisation and no showroom. The jeep is always the red jeep. The button just makes the jeep honk and rev in place (section 7). |
| Worlds at launch | Build **one world only: Treks**. Projects, Music, Internships and Blogs show as **locked "COMING SOON"** cards. |
| Recruiter path | None. Everything stays in-game. |
| Blogs | Don't exist yet. Pranav will write them in Notion later; Blogs world stays locked until then. |
| Sound | On by default at very low volume (~10-15%). Browsers block sound until the first tap, so it starts on the first interaction (START or any tap). Mute toggle always visible. |
| Trophy | Fixed at 20 for now. |
| Hosting | Vercel. |
| Music world (later) | Music he plays: instruments and songs performed live. Cards are his own audio/video clips. |
| Spotify | A Spotify icon button on the landing page linking to his public playlist of favourite songs. |
| Content | Invent placeholder details for now (section 3b); real photos and stories replace them later. |

Treks was picked as the first world because the hills-and-jeep idea fits it most naturally. Easy to swap if he prefers another.

Art rule: everything is original. We borrow the *feeling* of a chunky mobile hill-climb game (thick outlines, bold colours, big tactile buttons, bouncy physics) but no names, logos, sprites, fonts, sounds or layouts copied from any existing game.

---

## 1. The experience in one paragraph

You land on a loud, game-style **stage select**. Pranav's cutout waves from the corner, a trophy counter shows **20**. You swipe through world cards (Treks, Projects, Music, Internships, Blogs), pick one and hit the big green **START**. The screen splits: the top half is a pinned side-scrolling scene where his red jeep (him at the wheel) drives across hills themed to that world, driven by your scroll. Each time the jeep reaches a milestone, a real photo fades into the sky and a wooden roadside sign shows *What / When / Where*. Under the dirt line, comic-book cards scroll by with the full story, photos and audio for that milestone. A floating **STAGES** button (top-left, always) takes you back to switch worlds.

---

## 2. Pages and routes

| Route | What it is |
|---|---|
| `/` | Stage select (landing). World carousel, VEHICLE, START, trophy, cutout. |
| `/world/[slug]` | Split-screen journey for one world: `treks`, `projects`, `music`, `internships`, `blogs`. Statically generated per world. |
| `/world/[slug]#[milestoneId]` | Deep link: page loads and auto-scrolls the jeep to that milestone. Shareable. |
| `/blogs/[postSlug]` | **Later**, once Blogs unlocks: full post reader, content pulled from Notion at build time. |
| `404` | Jeep flipped upside down: "Crashed! Back to STAGES". |

At launch only `/world/treks` is generated. Visiting a locked world's URL shows a "COMING SOON" padlock screen with a STAGES button.

Global on every non-landing route: STAGES button (top-left), mute toggle (top-right, small).

---

## 3. Content model and data schema

One file per world in `content/worlds/*.ts` (or `.json`/MDX for blogs). Typed with TypeScript so a missing field is a build error.

```ts
type WorldSlug = 'treks' | 'projects' | 'music' | 'internships' | 'blogs';

interface World {
  slug: WorldSlug;
  title: string;            // "TREKS"
  tagline: string;          // shown on the stage card
  cardArt: string;          // stage-card illustration
  locked?: boolean;         // show a padlock "coming soon" card
  theme: WorldTheme;
  milestones: Milestone[];  // in driving order (usually chronological)
}

interface WorldTheme {
  palette: { sky: string; skyTop: string; ground: string; dirt: string; accent: string };
  terrain: {
    seed: number;           // deterministic hill shape
    roughness: number;      // 0 = gentle, 1 = spiky
    baseHeight: number;
  };
  parallaxLayers: string[]; // far → near (mountains, trees, city, stage lights...)
  props: string[];          // small roadside decor (pine trees, amps, office chairs...)
  music?: string;           // optional looped background track
  ambience?: string;        // wind, crowd, keyboard clatter...
}

interface Milestone {
  id: string;               // used for #deep-links
  sign: { what: string; when: string; where: string };   // wooden signpost
  skyPhoto?: Photo;         // the photo that fades into the sky
  terrainHint?: 'climb' | 'peak' | 'valley' | 'flat';    // shape the road near this sign
  cards: StoryCard[];       // the comic cards beneath, 1 to N per milestone
  tags?: string[];
  links?: { label: string; href: string }[];             // GitHub, Spotify, certificate...
}

interface Photo { src: string; alt: string; focalPoint?: [number, number] }

type StoryCard =
  | { kind: 'text';  title?: string; body: string; mood?: 'normal' | 'shout' | 'thought' }
  | { kind: 'photo'; photos: Photo[]; caption?: string }        // 1 = big panel, 2-4 = comic grid
  | { kind: 'audio'; src: string; title: string; note?: string; waveform?: number[] }
  | { kind: 'video'; src: string; poster: string; caption?: string }
  | { kind: 'quote'; text: string; by?: string }
  | { kind: 'stats'; items: { label: string; value: string }[] } // "Altitude 4,200 m", "Stars 120"
  | { kind: 'link';  label: string; href: string; blurb?: string };
```

World specifics (what goes in the signs and cards):

| World | What / When / Where on the sign | Typical cards | Terrain flavour |
|---|---|---|---|
| Treks | Trek name / month-year / region, altitude | photos, stats (altitude, km, days), short story | steep mountains, snow at peaks, pines |
| Projects | Project name / dates / tech or team | screenshots, what-I-built text, stats, GitHub/demo link | circuit-board or city skyline, flatter road with ramps |
| Music | Song/gig/album / date / venue or "bedroom" | audio clips, video, lyrics or story | rolling hills with stage lights, notes as props |
| Internships | Role @ company / dates / city | what-I-did, stats/impact, photo, certificate link | office towers, bridges, highway signs |
| Blogs | Post title / publish date / topic | excerpt, cover image, "Read full post" link | gentle meadow, paper/ink props |

Music (later): each milestone is a live performance or an instrument he picked up. Sign = song or gig / date / venue; cards = his own audio or video clip, the instrument, a short story about the night.

Blogs (later): posts written in Notion. At build time the site fetches them through the Notion API (a Notion integration token stored as a Vercel environment variable) and turns each post into a milestone plus a `/blogs/[postSlug]` page. Rebuild on Vercel to publish a new post.

## 3b. Placeholder content for Treks (invented, replace later)

Oldest first. Photos are placeholders until real ones arrive.

| # | What | When | Where | Story card (placeholder) | Stats |
|---|---|---|---|---|---|
| 1 | First school trek, Sinhagad Fort | Dec 2018 | Pune, Maharashtra | Wrong shoes, two blisters, one vada pav at the top that tasted like victory. | 1,312 m · 2.7 km · 1 day |
| 2 | Monsoon trek to Rajmachi | Jul 2020 | Lonavala, Maharashtra | Rain sideways for six hours, a waterfall every ten minutes, zero dry socks. | 826 m · 15 km · 2 days |
| 3 | Triund ridge | May 2022 | Dharamshala, Himachal | First sunset above the clouds. Slept in a tent that was mostly a suggestion. | 2,850 m · 9 km · 2 days |
| 4 | Kedarkantha winter summit | Dec 2023 | Uttarakhand | Summit push at 3 AM in -12°C. Snow up to the knees, chai never tasted better. | 3,810 m · 20 km · 5 days |
| 5 | Hampta Pass crossing | Jun 2025 | Manali to Spiti, Himachal | Green valley on one side, moon-like desert on the other. River crossings at dawn. | 4,270 m · 26 km · 5 days |
| 6 | Finish flag: "Next summit loading..." | 2026 | ? | Teaser card: the next trek he wants to do. | n/a |

Terrain hints: gentle hills for 1-2, climbing for 3, a big snowy peak at 4, a high pass with a dip on the far side at 5.

---

## 4. Component map

```
app/
  page.tsx                    → <StageSelect/>
  world/[slug]/page.tsx       → <Journey world=…/> (or <ComingSoon/> if locked)
  blogs/[postSlug]/page.tsx   → <BlogReader/>  (later)
components/
  ui/        ChunkyButton, Panel (thick border + drop shadow), Badge, IconButton, MuteToggle
  hud/       StagesButton, TrophyCounter, CoinCounter?, ProgressBar (distance meter)
  select/    StageCarousel, StageCard, LockedCard, CutoutHost (the waving photo), StartButton, VehicleButton, SpotifyButton
  journey/   Journey (layout + scroll orchestration)
             DriveScene (top half): Sky, SkyPhotoLayer, ParallaxLayer×n, Terrain, Road, Signpost, Jeep, Props, Particles (dust)
             StoryFeed (bottom half): MilestoneSection, StoryCard (switch on kind), AudioCard, PhotoGrid, StatsCard
lib/
  terrain.ts      deterministic hill generator (seeded noise → points → smooth path)
  scrollMap.ts    maps scroll position ↔ jeep x-position ↔ active milestone
  useAudio.ts     single shared audio manager (one clip at a time, respects mute)
  storage.ts      saves mute / volume / visited worlds in localStorage
content/
  worlds/*.ts, blogs/*.mdx, site.ts (name, age, socials)
public/
  art/ (cutout, jeep parts, face, props, parallax layers), photos/<world>/, audio/<world>/
```

---

## 5. Animation and scroll mechanics (the heart of it)

**Layout (desktop):** `DriveScene` is `position: sticky; top: 0; height: 50vh`. `StoryFeed` scrolls normally underneath. The bottom edge of the scene is a jagged dirt strip that visually "contains" the feed, so the cards look like they come out of the ground.

**One source of truth: scroll progress.**
1. Each `MilestoneSection` in the feed is measured (top offset, height) after layout and on resize.
2. The road has a fixed x-position for each milestone's signpost (evenly spaced, e.g. every 1,600 px of road, with longer gaps for milestones that have more cards).
3. `scrollMap` piecewise-linearly maps feed scroll → road x: when milestone N's section reaches the top of the feed, the jeep is exactly at signpost N. Between sections the jeep drives between signs. This keeps the car and the cards in sync regardless of card height.
4. Camera follows the jeep with a slight lead. Parallax layers move at 0.1×, 0.3×, 0.6× of camera x.

**Jeep physics (fake, cheap, convincing):** no physics engine. Every frame:
- Sample terrain height at the front and rear wheel x → place wheels on the curve, compute body angle from the two points.
- Body sits on a spring (critically damped) so bumps make it bob; wheels rotate by distance travelled / radius.
- Scrolling fast → bigger dust particles, slight forward lean; scrolling backwards → jeep reverses (wheels spin back, reverse lean). Stopping → small settle wobble.
- The driver's head (his face cutout) has its own tiny spring so it bobbles on landings. That's the charm moment.
- Smoothing: jeep x eases toward target x (lerp ~0.15/frame) so trackpad jitter looks like driving, not teleporting.

**Milestone moments** (triggered when the jeep passes a signpost's x):
- Signpost: already in the world; on approach it "pops" (scale 0.9 → 1.05 → 1) and the text plank flips in.
- Sky photo: cross-fades into the sky layer (opacity 0 → 0.85 over ~600 ms, slight scale-down + blur-to-sharp), masked with a soft vignette so it sits *behind* the hills. Previous photo fades out. Scrolling back restores the earlier one.
- Feed: the matching card group gets a small "ka-chunk" entrance (slide up + overshoot) the first time.
- Optional: coin/star pickup sound + a counter tick.

**End of road:** last milestone is a finish flag. Below it in the feed: "Stage clear!" card with buttons to the next world and back to STAGES.

**Tech choices:**
- Rendering the scene: SVG for terrain and signs (crisp, easy to theme) + absolutely positioned images for photos and the jeep. Switch to a `<canvas>` only if profiling says so.
- Animation: one `requestAnimationFrame` loop reading `scrollY`; Framer Motion for UI-level entrances (cards, buttons, carousel). No GSAP needed.
- Terrain: seeded simplex noise sampled into ~200 points per screen, smoothed with Catmull-Rom → SVG path. Same seed = same hills every visit. `terrainHint` nudges the curve near specific milestones (peak for the summit trek).
- Performance: transforms only (`translate3d`, `rotate`), `will-change` on moving layers, photos lazy-loaded one milestone ahead, `next/image` for sizes.

**Accessibility / reduced motion:** with `prefers-reduced-motion`, the jeep jumps between signposts without bounce, no parallax, photos simply swap. All story content is in the normal DOM, so screen readers and search engines read the feed as a plain article. Keyboard: arrow keys / PageDown scroll; STAGES and all buttons are real buttons.

---

## 6. Stage select (landing) in detail

Already being built in another thread with dummy data. Target behaviour:
- Background: bold sky gradient, chunky clouds drifting, a strip of hills at the bottom with the jeep idling (engine-shake).
- Centre: horizontal carousel of world cards. Swipe / drag / arrow keys / mouse wheel. Snap to centre; centred card is bigger, others tilt and dim. Each card: illustration, world name in a heavy outlined font, tagline, milestone count ("8 checkpoints"), and a "visited" tick if they've played it.
- Bottom: **VEHICLE** (left) and big green **START** (right). START plays a rev + the jeep zooms off-screen, then route change to `/world/[slug]`. On a locked card START turns grey and reads "COMING SOON"; tapping it makes the padlock shake.
- Locked cards: Projects, Music, Internships, Blogs are greyed with a chunky padlock and a "COMING SOON" ribbon. Only Treks is playable.
- Top-right: **trophy 20** (his age, fixed) and a small mute toggle.
- **Spotify button:** round green chunky icon button (Spotify's standard icon, used only as a link to his playlist, not as site branding), placed near the trophy or bottom corner. Opens his public playlist in a new tab. Tooltip/label: "My favourite songs". URL lives in `content/site.ts`.
- Corner: his cutout photo, idle bob + wave on hover/tap, speech bubble "Pick a stage!" that cycles a few lines.
- No settings gear (his call).

---

## 7. What VEHICLE does

No customisation and no showroom screen. The jeep is always red. Tapping VEHICLE makes the idling jeep on the landing page honk, rev and bounce once in place, then it settles back. Nothing opens.

## 8. Mobile behaviour

- Portrait: scene takes the top ~40% (`40svh`, using small-viewport units so browser bars don't jump it), feed below. Card width = full width minus 16 px gutters.
- Stage select: one card centred, peeking neighbours, swipe with snap; VEHICLE and START stacked in a thumb-friendly bottom bar.
- Touch scrolling drives the jeep exactly like desktop (same scroll mapping). Momentum scrolling is fine because the jeep eases toward target.
- Sky photos are cropped with `focalPoint` so the important part survives the narrow sky.
- Landscape phone: scene shrinks to 35% height so cards still have room.
- Audio: never autoplays; first tap on START unlocks audio (iOS requirement). Mute state remembered.
- Performance budget: fewer parallax layers and particles on low-end devices (detect via `navigator.hardwareConcurrency` / reduced motion).
- Target: Lighthouse performance 85+ on mobile, first load under ~300 KB JS.

---

## 9. Sound

On by default at very low master volume (~0.12). Browsers won't play audio before the first click/tap, so the audio manager arms on the first interaction anywhere and starts then. Engine idle on landing, rev on START, tyre crunch while driving (volume tied to speed), "ding" at signposts, honk when VEHICLE is tapped, a soft wind loop in Treks. Story-card audio clips (later, Music world) play at normal volume when tapped and duck the effects. All original or CC0 sounds. Mute state saved in localStorage.

---

## 10. Assets Pranav needs to supply

**Must have**
1. **Cutout photo** of himself for the stage select (PNG with transparent background, waist up, at least 1200 px tall). A plain photo works too; we can cut it out.
2. **Face photo** for the driver: front-facing, neutral or grinning, good light, at least 800 px. Ideally 2 extras (happy, shocked) for bump reactions.
3. **Per Treks milestone (replaces the placeholders):** What / When / Where, 1 sky photo (landscape, at least 2000 px wide), 1-4 extra photos, a 2-6 sentence story, altitude/distance/days.
4. **Spotify playlist link** (public).
5. Later, for Music: clips of songs played live, instrument names, venue and date. For Blogs: posts in a Notion database shared with a Notion integration.

**We make (original art, built in code/SVG or drawn)**
- Jeep body, wheels, props, signposts, terrain, parallax layers, world card illustrations, UI buttons, sound effects (CC0 sources).

**A simple way to hand content over:** one folder per world, `content-drop/treks/01-kedarkantha/` containing photos + a `notes.txt` with What/When/Where/story. We convert it into the data files.

---

## 11. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| 0. Landing page | Stage select (in progress): Treks playable, 4 locked COMING SOON cards, Spotify button, VEHICLE with no colour picker or showroom | Swipe, START, VEHICLE, trophy, Spotify, cutout all work on phone + desktop |
| 1. Data layer | `content/` types + the invented Treks placeholders from 3b | `/world/treks` renders a plain list of milestones |
| 2. Journey skeleton | Split layout, sticky scene, terrain generator, jeep moving with scroll, signposts | Scroll up/down keeps jeep at the right sign for each card |
| 3. Juice | Jeep springs + head bobble, dust, sky photo cross-fade, card entrances, end-of-stage card | Feels fun on a mid-range Android |
| 4. Treks theme + sound | Mountain palette, parallax pines and peaks, snow near the summit; low-volume sound on by default, mute | Looks like Treks from a screenshot |
| 5. Launch v1 | Reduced motion, 404, OG image, deploy to Vercel | Live URL |
| 6. Real content | Swap placeholders for his real trek photos and stories | No placeholder text left in Treks |
| Later | Unlock worlds one by one: Music (his live clips), Projects, Internships, Blogs (from Notion) | Each new world = new data file + theme |

v1 is one polished world. Every later world reuses the same journey engine, so adding one is mostly content and a theme.

---

## 12. Still open

- The Spotify playlist URL (placeholder link until he sends it).
- Custom domain or the free `*.vercel.app` one.
