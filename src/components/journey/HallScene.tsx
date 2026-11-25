/*
  Art for the "hall" journey theme (Music): a grand concert hall at night.
  Original drawings: domed ceiling, curved balcony tiers, organ pipes, arcades,
  chandeliers, a road drawn as a musical staff, and the instruments that
  step into the spotlight as you scroll (mic, guitar, bass, drums, piano).
  Palette: midnight blue and black with white line work.
*/
import type { Road } from "./terrain";
import { rng } from "./terrain";

export const HALL = {
  ink: "#03050c",
  navy: "#0a1530",
  deep: "#071022",
  blue: "#1d3f99",
  electric: "#5b8cff",
  line: "#eef3ff",
  warm: "#fff4d8",
};
const W = HALL.line;

/** <defs> the hall layers share. */
export function HallDefs() {
  return (
    <defs>
      <radialGradient id="hall-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#3b63d6" stopOpacity={0.55} />
        <stop offset="0.6" stopColor="#1a3378" stopOpacity={0.2} />
        <stop offset="1" stopColor="#0a1530" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="lamp-dot">
        <stop offset="0" stopColor="#fff" stopOpacity={1} />
        <stop offset="0.3" stopColor={HALL.warm} stopOpacity={0.7} />
        <stop offset="1" stopColor={HALL.warm} stopOpacity={0} />
      </radialGradient>
      <linearGradient id="spot-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={0} />
        <stop offset="0.35" stopColor="#dfe8ff" stopOpacity={0.14} />
        <stop offset="1" stopColor="#dfe8ff" stopOpacity={0.3} />
      </linearGradient>
      <radialGradient id="spot-pool">
        <stop offset="0" stopColor="#eaf0ff" stopOpacity={0.55} />
        <stop offset="1" stopColor="#eaf0ff" stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

/** The great dome over the hall: ribbed arcs, a ring of lamps and an oculus. Fixed, no parallax. */
export function HallDome({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const ribs = 13;
  const lamps = 26;
  return (
    <g fill="none" stroke={W} strokeLinecap="round">
      <circle cx={cx} cy={cy} r={r * 1.15} fill="url(#hall-glow)" stroke="none" />
      {[1, 0.82, 0.62, 0.4].map((k, i) => (
        <path key={i} d={`M${cx - r * k} ${cy} A${r * k} ${r * k * 0.72} 0 0 1 ${cx + r * k} ${cy}`}
          strokeWidth={i === 0 ? 2.4 : 1.4} opacity={i === 0 ? 0.55 : 0.28} />
      ))}
      {Array.from({ length: ribs }, (_, i) => {
        const a = Math.PI * (i + 1) / (ribs + 1);
        const x0 = cx - Math.cos(a) * r * 0.22, y0 = cy - Math.sin(a) * r * 0.72 * 0.22;
        const x1 = cx - Math.cos(a) * r, y1 = cy - Math.sin(a) * r * 0.72;
        return <path key={i} d={`M${x0} ${y0} L${x1} ${y1}`} strokeWidth={1.2} opacity={0.22} />;
      })}
      <ellipse cx={cx} cy={cy - r * 0.72 * 0.2} rx={r * 0.2} ry={r * 0.1} strokeWidth={1.6} opacity={0.5} />
      {Array.from({ length: lamps }, (_, i) => {
        const a = Math.PI * (i + 0.5) / lamps;
        const x = cx - Math.cos(a) * r * 0.9, y = cy - Math.sin(a) * r * 0.72 * 0.9;
        return (
          <g key={i} className="dome-lamp" style={{ animationDelay: `${(i % 7) * 0.4}s` }}>
            <circle cx={x} cy={y} r={7} fill="url(#lamp-dot)" stroke="none" />
            <circle cx={x} cy={y} r={1.6} fill="#fff" stroke="none" />
          </g>
        );
      })}
    </g>
  );
}

/** Far layer: organ pipes and three curved balcony tiers with little lamps, `w` units wide. */
export function Balconies({ w, base }: { w: number; base: number }) {
  const swag = 150;
  const tiers = [base - 150, base - 102, base - 56];
  const pipeGroups: number[] = [];
  for (let x = 260; x < w + 200; x += 1100) pipeGroups.push(x);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* organ pipes peek above the top tier */}
      {pipeGroups.map((px) => (
        <g key={px}>
          {Array.from({ length: 15 }, (_, i) => {
            const d = Math.abs(i - 7);
            const h = 150 - d * 12 + (i % 2) * 8;
            const x = px + i * 15;
            return (
              <g key={i}>
                <rect x={x} y={tiers[0] - h} width={11} height={h + 20} rx={2} fill={HALL.deep} stroke={W} strokeWidth={1.3} strokeOpacity={0.55} />
                <path d={`M${x + 1} ${tiers[0] - h + 14} Q${x + 5.5} ${tiers[0] - h + 8} ${x + 10} ${tiers[0] - h + 14}`} fill="none" stroke={W} strokeWidth={1} opacity={0.5} />
              </g>
            );
          })}
        </g>
      ))}
      {tiers.map((y, t) => {
        const dip = 16 - t * 3;
        let top = `M-60 ${y}`;
        for (let x = -60; x < w + 200; x += swag) top += ` Q${x + swag / 2} ${y + dip * 2} ${x + swag} ${y}`;
        const lamps: number[] = [];
        for (let x = -60; x < w + 200; x += swag) lamps.push(x);
        return (
          <g key={t}>
            <path d={`${top} L${w + 200} ${y + 40} L-60 ${y + 40} Z`} fill={t === 0 ? "#0b1735" : t === 1 ? "#0a1430" : "#08112a"} />
            <path d={top} fill="none" stroke={W} strokeWidth={2} opacity={0.7} />
            <path d={top} fill="none" stroke={W} strokeWidth={1} opacity={0.35} transform="translate(0 7)" />
            {lamps.map((x) => (
              <g key={x}>
                <circle cx={x} cy={y - 2} r={9} fill="url(#lamp-dot)" opacity={0.8} />
                <circle cx={x} cy={y - 2} r={1.8} fill="#fff" />
              </g>
            ))}
          </g>
        );
      })}
      <rect x={-60} y={base - 20} width={w + 260} height={600} fill="#060d20" />
    </g>
  );
}

/** Mid layer: tall columns with round arches and crystal chandeliers, `w` units wide. */
export function Arcade({ w, base }: { w: number; base: number }) {
  const step = 230;
  const top = base - 210;
  const cols: number[] = [];
  for (let x = -80; x < w + 260; x += step) cols.push(x);
  return (
    <g strokeLinejoin="round">
      {/* the wall fades in from the dome above instead of cutting it with a hard edge */}
      <defs>
        <linearGradient id="arcade-wall" gradientUnits="userSpaceOnUse" x1={0} y1={top - 80} x2={0} y2={top + 10}>
          <stop offset="0" stopColor={HALL.ink} stopOpacity={0} />
          <stop offset="1" stopColor={HALL.ink} stopOpacity={1} />
        </linearGradient>
      </defs>
      {/* the wall with arched openings */}
      <path
        d={`M-100 ${top - 80} H${w + 300} V${base + 400} H-100 Z ` +
          cols.slice(0, -1).map((x) => {
            const x0 = x + 18, x1 = x + step - 18, r = (x1 - x0) / 2;
            return `M${x0} ${base + 400} V${top + r} A${r} ${r} 0 0 1 ${x1} ${top + r} V${base + 400} Z`;
          }).join(" ")}
        fill="url(#arcade-wall)" fillRule="evenodd"
      />
      {cols.slice(0, -1).map((x, i) => {
        const x0 = x + 18, x1 = x + step - 18, r = (x1 - x0) / 2, mx = (x0 + x1) / 2;
        return (
          <g key={i}>
            <path d={`M${x0} ${base + 10} V${top + r} A${r} ${r} 0 0 1 ${x1} ${top + r} V${base + 10}`} fill="none" stroke={W} strokeWidth={2.2} opacity={0.85} />
            <path d={`M${x0 + 8} ${base + 10} V${top + r} A${r - 8} ${r - 8} 0 0 1 ${x1 - 8} ${top + r} V${base + 10}`} fill="none" stroke={W} strokeWidth={1} opacity={0.35} />
            {/* keystone */}
            <path d={`M${mx - 7} ${top - 2} L${mx + 7} ${top - 2} L${mx + 4} ${top + 14} L${mx - 4} ${top + 14} Z`} fill={HALL.navy} stroke={W} strokeWidth={1.5} />
            {i % 2 === 0 && <Chandelier x={mx} y={top + 26} />}
          </g>
        );
      })}
      {cols.map((x, i) => (
        <g key={i}>
          <rect x={x - 6} y={top + 40} width={30} height={base - top} fill={HALL.navy} stroke={W} strokeWidth={1.6} />
          <path d={`M${x + 2} ${top + 50} V${base + 20} M${x + 9} ${top + 50} V${base + 20} M${x + 16} ${top + 50} V${base + 20}`} stroke={W} strokeWidth={0.8} opacity={0.35} />
          {/* curly capital */}
          <path d={`M${x - 12} ${top + 40} H${x + 30} M${x - 12} ${top + 40} q-6 -8 2 -12 q6 -2 6 5 M${x + 30} ${top + 40} q6 -8 -2 -12 q-6 -2 -6 5`} fill="none" stroke={W} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function Chandelier({ x, y }: { x: number; y: number }) {
  const arms = [-34, -18, 0, 18, 34];
  return (
    <g fill="none" stroke={W} strokeLinecap="round">
      <path d={`M${x} ${y - 30} V${y}`} strokeWidth={1.2} opacity={0.7} />
      <path d={`M${x - 36} ${y + 6} Q${x} ${y + 34} ${x + 36} ${y + 6}`} strokeWidth={1.6} opacity={0.8} />
      <path d={`M${x - 22} ${y + 2} Q${x} ${y + 20} ${x + 22} ${y + 2}`} strokeWidth={1.2} opacity={0.6} />
      {arms.map((a) => (
        <g key={a}>
          <circle cx={x + a} cy={y + 6 + (Math.abs(a) > 20 ? -2 : 12 - Math.abs(a) * 0.2)} r={8} fill="url(#lamp-dot)" stroke="none" />
          <circle cx={x + a} cy={y + 6 + (Math.abs(a) > 20 ? -2 : 12 - Math.abs(a) * 0.2)} r={1.7} fill="#fff" stroke="none" />
        </g>
      ))}
      <path d={`M${x} ${y + 22} l-3 8 l3 6 l3 -6 Z`} fill={W} stroke="none" opacity={0.85} />
    </g>
  );
}

/* ---------------- the staff road ---------------- */

export const STAFF_GAP = 8; // distance between staff lines (4 gaps = 32 units)

/** Notes, bar lines, clef and dynamics that sit on the staff road. Deterministic. */
export function staffMarks(road: Road) {
  const r = rng(23);
  const notes: { x: number; y: number; open: boolean; beam?: number; sharp?: boolean }[] = [];
  const bars: { x: number; y: number }[] = [];
  const dyn: { x: number; y: number; t: string }[] = [];
  const tune = [4, 3, 2, 3, 4, 4, 4, 5, 3, 3, 3, 1, 4, 6, 6, 7, 5, 4, 3, 2, 1, 2, 3, 6];
  const marks = ["pp", "mf", "ff", "p", "f", "sfz"];
  let n = 0;
  for (let x = 40; x < road.end + 1100; x += 62) {
    if (road.xs.some((sx) => Math.abs(sx - x) < 70)) { x += 30; continue; }
    if (n % 4 === 0) {
      const bx = Math.round(x - 30);
      bars.push({ x: bx, y: Math.round(road.groundY(bx) * 10) / 10 });
      if ((n / 4) % 5 === 2) dyn.push({ x: bx + 22, y: road.groundY(bx + 22), t: marks[(n / 4) % marks.length] });
    }
    const step = tune[n % tune.length];
    const g = road.groundY(x);
    const beamed = n % 8 === 5;
    notes.push({
      x: Math.round(x),
      y: Math.round((g + step * (STAFF_GAP / 2)) * 10) / 10,
      open: n % 7 === 3,
      beam: beamed ? Math.round((road.groundY(x + 62) + tune[(n + 1) % tune.length] * (STAFF_GAP / 2)) * 10) / 10 : undefined,
      sharp: r() < 0.08,
    });
    n++;
  }
  return { notes, bars, dyn };
}

/** A stylised treble clef sitting on the staff; (x, y) = top staff line. */
export function Clef({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={W} strokeWidth={2.6} strokeLinecap="round">
      <path d="M4 48 C-2 53 -9 46 -4 41 C0 38 5 42 2 45 M2 45 L6 -14 C7 -24 -2 -25 -3 -16 C-4 -6 16 4 15 18 C14 29 3 33 -3 28 C-9 23 -6 13 2 13 C8 13 10 21 4 23" />
      <text x={20} y={15} className="staff-time">4</text>
      <text x={20} y={31} className="staff-time">4</text>
    </g>
  );
}

/** Footlight row in front of the stage edge (on the ground strip). */
export function footlights(road: Road) {
  const out: { x: number; y: number }[] = [];
  for (let x = -380; x < road.end + 1180; x += 46) out.push({ x, y: Math.round((road.groundY(x) + 78) * 10) / 10 });
  return out;
}

/* ---------------- instruments ---------------- */

export type InstrumentKind = "mic" | "guitar" | "bass" | "drums" | "piano";
const ORDER: InstrumentKind[] = ["mic", "guitar", "bass", "drums", "piano"];

/** Where each instrument stands: two between every pair of signs, plus one at the start. */
export function instrumentSpots(road: Road) {
  const xs = [330, ...road.xs.flatMap((sx, i) => (i < road.xs.length - 1 ? [sx + 380, sx + 760] : [sx + 400]))];
  return xs.map((x, i) => ({ x, y: Math.round((road.groundY(x) + 1) * 10) / 10, kind: ORDER[i % ORDER.length] }));
}

/** A spotlight cone + floor pool behind an instrument. */
function Spot({ w }: { w: number }) {
  return (
    <g className="instr-spot">
      <path d={`M-10 -330 L10 -330 L${w} 0 L${-w} 0 Z`} fill="url(#spot-beam)" />
      <ellipse cx={0} cy={0} rx={w * 1.05} ry={9} fill="url(#spot-pool)" />
    </g>
  );
}

export function Instrument({ kind }: { kind: InstrumentKind }) {
  const art = { mic: <Mic />, guitar: <Guitar />, bass: <Bass />, drums: <Drums />, piano: <Piano /> }[kind];
  const spot = { mic: 46, guitar: 52, bass: 56, drums: 92, piano: 104 }[kind];
  return (
    <>
      <Spot w={spot} />
      <g className="instr-art">{art}</g>
    </>
  );
}

const S = { stroke: W, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Vintage microphone on a stand, with a curly cable. */
function Mic() {
  return (
    <g {...S}>
      <path d="M2 -2 C30 4 26 -10 50 -6 C70 -3 64 6 84 2" fill="none" strokeWidth={2} opacity={0.8} />
      <ellipse cx={0} cy={-3} rx={22} ry={5} fill={HALL.navy} />
      <path d="M0 -6 V-108" strokeWidth={3.5} />
      <path d="M0 -108 L14 -122" strokeWidth={3} />
      <rect x={-4} y={-72} width={8} height={10} rx={2} fill={HALL.navy} />
      <g transform="translate(18 -130) rotate(-25)">
        <rect x={-12} y={-24} width={24} height={40} rx={12} fill="#c9d3e8" />
        {[-14, -8, -2, 4, 10].map((y) => <path key={y} d={`M-10 ${y} H10`} strokeWidth={1.4} stroke={HALL.navy} />)}
        <rect x={-13} y={-2} width={26} height={5} rx={1} fill={HALL.navy} strokeWidth={1.6} />
      </g>
    </g>
  );
}

/** Guitar outline shared by guitar + bass: double-cutaway body with a long neck. */
function GuitarShape({ body, guard, neck, len, pegs }: { body: string; guard: string; neck: number; len: number; pegs: number }) {
  return (
    <g {...S}>
      {/* stand */}
      <path d="M-20 0 L0 -26 L20 0 M0 -26 V-34" fill="none" strokeWidth={2.4} />
      <g transform="rotate(-8 0 -30)">
        <rect x={-neck / 2} y={-66 - len} width={neck} height={len + 4} fill="#3a2a1c" />
        {Array.from({ length: Math.floor(len / 13) }, (_, i) => (
          <path key={i} d={`M${-neck / 2} ${-70 - i * 13} H${neck / 2}`} strokeWidth={1} opacity={0.7} />
        ))}
        <path d={`M${-neck / 2 - 1} ${-66 - len} l-3 -26 q${neck / 2 + 4} -8 ${neck + 8} -2 l-4 28 Z`} fill={body} />
        {Array.from({ length: pegs }, (_, i) => (
          <circle key={i} cx={-neck / 2 - 6} cy={-70 - len - 4 - i * (20 / pegs)} r={2.4} fill={W} strokeWidth={1} />
        ))}
        <path d="M0 -14 C16 -14 26 -22 24 -38 C23 -46 15 -49 16 -57 C17 -65 23 -70 19 -76 C15 -81 9 -75 6 -68 L-6 -68 C-9 -76 -17 -81 -21 -75 C-24 -69 -16 -62 -16 -55 C-16 -48 -25 -45 -25 -36 C-25 -22 -13 -14 0 -14 Z" fill={body} />
        <path d="M-12 -24 C-18 -32 -16 -44 -8 -50 L6 -50 C8 -40 10 -30 4 -22 C0 -19 -8 -19 -12 -24 Z" fill={guard} strokeWidth={1.6} />
        <rect x={-6} y={-48} width={12} height={4} rx={1.5} fill={W} strokeWidth={1} />
        <rect x={-6} y={-38} width={12} height={4} rx={1.5} fill={W} strokeWidth={1} />
        <rect x={-7} y={-28} width={14} height={3} rx={1} fill={HALL.ink} strokeWidth={1} />
        <circle cx={14} cy={-26} r={2.6} fill={W} strokeWidth={1} />
        <circle cx={16} cy={-34} r={2.6} fill={W} strokeWidth={1} />
        {Array.from({ length: Math.min(pegs, 4) }, (_, i) => (
          <path key={i} d={`M${-neck / 2 + 1.5 + i * ((neck - 3) / Math.max(1, Math.min(pegs, 4) - 1))} ${-66 - len} V-26`} strokeWidth={0.6} opacity={0.9} />
        ))}
      </g>
    </g>
  );
}

function Guitar() {
  return <GuitarShape body="#e9eef8" guard={HALL.navy} neck={7} len={68} pegs={6} />;
}

function Bass() {
  return (
    <g transform="scale(1.1)">
      <GuitarShape body={HALL.blue} guard="#e9eef8" neck={8} len={96} pegs={4} />
    </g>
  );
}

/** A drum kit: kick, toms, floor tom, snare, hi-hat and two cymbals. */
function Drums() {
  return (
    <g {...S}>
      {/* cymbal stands */}
      <path d="M-62 0 L-56 -10 L-50 0 M-56 -10 V-96 M58 0 L64 -10 L70 0 M64 -10 V-108" fill="none" strokeWidth={2} />
      <ellipse cx={-56} cy={-98} rx={26} ry={4} fill="#c9d3e8" transform="rotate(-10 -56 -98)" />
      <ellipse cx={64} cy={-110} rx={28} ry={4} fill="#c9d3e8" transform="rotate(12 64 -110)" />
      {/* hi-hat */}
      <path d="M-86 0 V-70" strokeWidth={2} />
      <ellipse cx={-86} cy={-70} rx={16} ry={3} fill="#c9d3e8" />
      <ellipse cx={-86} cy={-74} rx={16} ry={3} fill="#c9d3e8" />
      {/* floor tom */}
      <rect x={34} y={-50} width={34} height={42} rx={3} fill={HALL.blue} />
      <ellipse cx={51} cy={-50} rx={17} ry={4} fill={W} />
      <path d="M38 -8 L36 0 M64 -8 L66 0" />
      {/* snare */}
      <rect x={-66} y={-46} width={30} height={16} rx={2} fill={HALL.blue} />
      <ellipse cx={-51} cy={-46} rx={15} ry={3.5} fill={W} />
      <path d="M-51 -30 V0 M-60 0 L-51 -12 L-42 0" fill="none" strokeWidth={2} />
      {/* rack toms */}
      <g transform="rotate(-10 -14 -70)"><rect x={-30} y={-80} width={28} height={20} rx={3} fill={HALL.blue} /><ellipse cx={-16} cy={-80} rx={14} ry={3.5} fill={W} /></g>
      <g transform="rotate(10 16 -70)"><rect x={2} y={-80} width={28} height={20} rx={3} fill={HALL.blue} /><ellipse cx={16} cy={-80} rx={14} ry={3.5} fill={W} /></g>
      {/* kick */}
      <circle cx={0} cy={-31} r={31} fill={HALL.blue} />
      <circle cx={0} cy={-31} r={25} fill="#e9eef8" strokeWidth={1.6} />
      <path d="M-12 -24 Q-4 -46 10 -38 Q2 -32 -2 -22 Q8 -24 12 -30" fill="none" stroke={HALL.blue} strokeWidth={2.4} />
      <circle cx={0} cy={-31} r={5} fill="none" stroke={HALL.blue} strokeWidth={1.4} />
      <path d="M-22 0 L-18 -8 M22 0 L18 -8" />
      {/* sticks */}
      <path d="M-40 -52 L-14 -64 M-36 -58 L-10 -66" strokeWidth={2} />
    </g>
  );
}

/** Concert grand, side view, lid up, with a bench. */
function Piano() {
  return (
    <g {...S}>
      {/* lid */}
      <path d="M-58 -62 L-46 -128 C-10 -142 40 -122 74 -66 Z" fill="#101a36" />
      <path d="M-46 -128 C-10 -142 40 -122 74 -66" fill="none" strokeWidth={1} opacity={0.5} transform="translate(-3 6)" />
      <path d="M12 -62 L-6 -122" strokeWidth={2} />
      {/* case */}
      <path d="M-74 -62 H50 C66 -62 78 -58 80 -50 V-40 H-74 Z" fill={HALL.ink} />
      <path d="M-70 -56 H48" strokeWidth={1} opacity={0.55} />
      {/* keyboard */}
      <rect x={-92} y={-58} width={22} height={12} fill="#f4f6fb" strokeWidth={1.8} />
      <path d="M-88 -58 V-52 M-84 -58 V-52 M-78 -58 V-52 M-74 -58 V-52" stroke={HALL.ink} strokeWidth={2.4} />
      {/* legs + lyre */}
      <path d="M-66 -40 V-4 M62 -40 V-4 M8 -40 V-4" strokeWidth={4} />
      <path d="M-66 -40 V-4 M62 -40 V-4 M8 -40 V-4" stroke={HALL.ink} strokeWidth={1.5} />
      <circle cx={-66} cy={-2} r={2.4} fill={W} /><circle cx={62} cy={-2} r={2.4} fill={W} /><circle cx={8} cy={-2} r={2.4} fill={W} />
      <path d="M-30 -40 Q-36 -22 -30 -6 H-20 Q-14 -22 -20 -40" fill="none" strokeWidth={1.8} />
      {/* bench */}
      <rect x={-124} y={-30} width={30} height={7} rx={2} fill={HALL.navy} />
      <path d="M-120 -23 V0 M-98 -23 V0" strokeWidth={2.4} />
      {/* sheet music */}
      <path d="M-62 -62 L-58 -80 L-36 -80 L-40 -62" fill="#f4f6fb" strokeWidth={1.4} />
      <path d="M-56 -76 H-40 M-57 -72 H-41 M-58 -68 H-42" stroke={HALL.ink} strokeWidth={0.8} />
    </g>
  );
}

/* ---------------- signpost: a program card on a music stand ---------------- */

export function HallSign({ what, when, where, w, h, on, fit }: {
  what: string; when: string; where: string; w: number; h: number; on: boolean;
  fit: (text: string, max: number, width: number) => object;
}) {
  return (
    <g>
      {/* stand legs (pole is drawn by the signpost) */}
      <path d={`M${w / 2 - 22} 112 L${w / 2} 92 L${w / 2 + 22} 112`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" transform={`translate(0 ${h - 30})`} />
      <rect x={-4} y={-4} width={w + 8} height={h + 8} rx={14} fill={on ? HALL.electric : HALL.blue} opacity={on ? 0.45 : 0.15} />
      <rect width={w} height={h} rx={10} fill="#f6f8ff" stroke={HALL.ink} strokeWidth={3} />
      <rect x={5} y={5} width={w - 10} height={h - 10} rx={7} fill="none" stroke={HALL.navy} strokeWidth={1.2} />
      {/* flourish on top */}
      <path d={`M${w / 2 - 34} -2 C${w / 2 - 20} -16 ${w / 2 - 8} -2 ${w / 2} -12 C${w / 2 + 8} -2 ${w / 2 + 20} -16 ${w / 2 + 34} -2`}
        fill="none" stroke={on ? "#fff" : "#9fb2dd"} strokeWidth={2} strokeLinecap="round" />
      <text x={w / 2} y={27} textAnchor="middle" className="hall-what" {...fit(what, 17, w - 24)}>{what}</text>
      <path d={`M24 ${h / 2 - 6} H${w - 24}`} stroke={HALL.navy} strokeWidth={0.8} opacity={0.6} />
      <text x={14} y={53} className="hall-label">WHEN</text>
      <text x={62} y={53} className="hall-text" {...fit(when, 15, w - 76)}>{when}</text>
      <text x={14} y={72} className="hall-label">WHERE</text>
      <text x={62} y={72} className="hall-text" {...fit(where, 15, w - 76)}>{where}</text>
    </g>
  );
}
