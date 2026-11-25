# Visual polish pass (23 Nov 2026)

Screenshots: `previews/before/` and `previews/after/`, same names (desktop 1440×900 and mobile 390×844; worlds shot at the top, 35% and 100% of the scroll).

## What felt awkward

1. **The START button looked disabled.** Its pulse animation was called `pulse`, which clashes with Tailwind's own `pulse` keyframes (opacity drops to 0.5). The main call to action spent half its time washed out.
2. **Carousel arrows sat on top of the side cards** on desktop, and the side cards' stat badges and "COMING SOON" text shrank to unreadable 60% copies.
3. **Bottom buttons had different heights** (FOR RECRUITERS was shorter than START), and the HUD buttons were top-aligned against a taller trophy. Coin and gem pills had different widths.
4. **Story cards collided with the HUD.** In every world the cards scrolled straight under STAGES and the checkpoint pill with nothing between them.
5. **The jeep and signposts drove across the reading column** on desktop. The jeep sat at 40% of the screen, right inside the centred 640px column, so the car, signs and lamps were painted over card text and headings.
6. **Wooden signposts overflowed.** Long names like "Panhala to Pawankhind" ran past the board edges (only the neon signs squeezed long text).
7. **Music world had a hard horizontal seam** across the sky where the arcade wall's flat top cut the dome.
8. **Motion was inconsistent.** Popovers and the speech bubble grew from `scale(0)`, every hover ran on touch screens too, timings and springs varied file to file, and there were no visible keyboard focus rings on the game buttons.
9. Photo frames were plain white while images loaded, and the trek sky photo (0.9 opacity) competed with the illustrated hills.

## What changed

| Area | Fix |
| --- | --- |
| START button | Keyframes renamed `btn-throb` (scale only), slowed to 1.8s |
| Carousel | Side cards pushed further out on wide screens; arrows sit in the gap between the centre card and the side cards (driven by a `--cw` card-width variable). Stat badge and lock label only show on the centre card |
| Landing layout | Bigger world title, a bit more breathing room above the subtitle, bottom buttons stretch to equal height, HUD row centred, counters equal width with tabular numbers |
| Journey HUD | A soft gradient band in each theme's sky colour sits behind the HUD, so cards fade out instead of hitting the buttons. STAGES is slightly smaller on phones |
| Journey layout (≥1180px) | Story column moves right of centre and the camera keeps the jeep at 17% of the screen, so the car and the sign it is passing stay in open sky on the left. Below 1180px nothing changes |
| Signposts | Wooden signs squeeze long text to fit the board, same as neon |
| Music | Arcade wall fades in from transparent, so the dome blends into the hall |
| Motion | Shared `--ease-out` / `--ease-pop` curves; pops start at `scale(0.85)` not 0; stage menu drops in at 180ms from its corner; hovers only on real pointers; press states ease back; card entrance travels 24px instead of 40px; gold focus rings on game buttons, arrows and stage menu items |
| Details | Photo frames get a neutral backdrop while loading; trek sky photo at 0.78 opacity |

Recruiters dashboard: checked on desktop and mobile. It already reads as one consistent system, so I left it alone.

Not changed: concept, interactions, information architecture, content, sound.
Checked: `tsc` clean, `eslint` clean, `next build` succeeds.

## Pass 2: make the feed feel like game screens

The first pass fixed bugs. This one goes after the remaining "web page in the sky" feeling.

| Area | Change |
| --- | --- |
| Journey HUD | STAGES, the progress plate and mute are now one family: 46px tall, 4px ink border, bevelled, same drop. The plate takes each world's colour (steel / violet / navy) |
| Progress bar | Recessed track, two-tone gold fill, a diamond tick per checkpoint that lights up as you pass it, and a chequered finish flag |
| Checkpoint headers | The three loose chips became a banner: a coin badge with the checkpoint number (grey until reached, then gold/pink/blue and tilts), the title, and WHEN/WHERE plates styled like the landing counters. The finish uses a chequered badge |
| Intro card | WORLD N tab on top, styled as a chunky button (hidden in Music, which keeps its WELCOME.EXE title bar) |
| Stage clear | Three outlined gold stars pop in one after another |
| Rhythm | More room between checkpoints (56px → 80px), so the scenery gets a breath between chapters |

## Pass 3: Impeccable + Taste review

Ran Impeccable's polish playbook and craft floor, and read the Taste skill. Taste targets company websites (one section per screen, photo-led heroes, finish gate), so its page rules don't fit a game-as-portfolio; I took its interaction and accessibility rules only.

| Finding | Source | Fix |
| --- | --- | --- |
| WORLD N tab above the intro title is an eyebrow label | Impeccable ban | Removed (pass 2 had added it) |
| Every story card faded in on scroll, the same entrance repeated down the page | Impeccable motion, Taste "never" | Cards are now simply there; the authored moments are the jeep drive, the checkpoint badge flipping gold, and the stage-clear stars |
| Unicode ▼ and ◀ standing in for icons | Impeccable | Drawn chevrons/triangles in the same outlined style as the play button (the ▼ in Music's retro window controls stays: it's period-accurate) |
| Carousel dots were 12px tap targets; stage menu rows ~34px | Taste tap-size | Dots get a 44px invisible hit area; menu rows are 44px tall |
| Text selection and scrollbar used browser defaults | Impeccable browser surfaces | Gold selection and a dark scrollbar on the game side (recruiter page keeps its own) |
| Chunky zero-blur offset shadows | Impeccable "refuse" list | Kept on purpose: this world is a cartoon game UI and chose that look |

## Pass 4: ethereal atmosphere

Air added between the viewer and the art, without softening the chunky cartoon pieces. Screenshots: `previews/ethereal/`.

- **Haze:** a sky-tinted mist that thickens toward the horizon, so the far ranges, skylines and balconies fade into the air (aerial perspective).
- **Light:** one soft breathing glow per world (warm sun in Treks, peach in Projects, cool blue in Music) and a halo behind the card on the landing page.
- **Motes:** two drifting layers, fine specks plus big out-of-focus bokeh orbs, rising slowly. They're tinted per world (white pollen, pink sparkle, blue stage dust).
- **Ground mist:** soft clouds roll across the road in front of the scenery (stage smoke in Music) and over the hills on the landing page.
- **Floating cards:** story cards get a soft blurred lift under their hard ink shadow, so they hang in the air.
- Everything is behind the cards and pointer-transparent, and it stops under reduced motion.
