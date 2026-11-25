/*
  Art for the "city" journey theme (Projects): a neon sunset beach city.
  Original drawings: striped sunset sun, skyline, art-deco hotels, palms and street lamps.
*/
import type { skyline } from "./terrain";

const INK = "#111";
export const NEON = { pink: "#ff3d9a", teal: "#2de2e6", orange: "#ff9a3c", purple: "#7b2dff", yellow: "#ffd23f" };

type Buildings = ReturnType<typeof skyline>;

/** <defs> the city layers share (window patterns, sun gradient, lamp glow). */
export function CityDefs() {
  return (
    <defs>
      <pattern id="win-far" width={14} height={18} patternUnits="userSpaceOnUse">
        <rect x={4} y={5} width={4} height={6} fill="#ff8ad8" opacity={0.55} />
      </pattern>
      <pattern id="win-mid" width={16} height={20} patternUnits="userSpaceOnUse">
        <rect x={3} y={5} width={5} height={7} fill="#ffe08a" opacity={0.85} />
        <rect x={10} y={5} width={4} height={7} fill="#3a2458" opacity={0.6} />
      </pattern>
      <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3a8" />
        <stop offset="0.45" stopColor="#ffb347" />
        <stop offset="1" stopColor="#ff3d9a" />
      </linearGradient>
      <radialGradient id="lamp-glow">
        <stop offset="0" stopColor="#ffd9f0" stopOpacity={0.9} />
        <stop offset="0.35" stopColor={NEON.pink} stopOpacity={0.45} />
        <stop offset="1" stopColor={NEON.pink} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

/** Big striped sunset sun, centred at (cx, cy). */
export function CitySun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // horizontal gaps get thicker towards the bottom
  const gaps = [0.18, 0.34, 0.48, 0.6, 0.71, 0.81, 0.9].map((t, i) => ({ y: cy + r * (t * 2 - 1) + r * 0.25, h: 2 + i * 1.6 }));
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.35} fill="#ff6fa8" opacity={0.18} />
      <mask id="sun-stripes">
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#fff" />
        {gaps.map((g, i) => <rect key={i} x={cx - r} y={g.y} width={r * 2} height={g.h} fill="#000" />)}
      </mask>
      <circle cx={cx} cy={cy} r={r} fill="url(#sun)" mask="url(#sun-stripes)" />
    </g>
  );
}

/** Building silhouettes standing on y = base. */
export function Skyline({ buildings, base, fills, windows, stroke = 2.5, trims }: {
  buildings: Buildings; base: number; fills: string[]; windows: string; stroke?: number; trims?: string[];
}) {
  return (
    <g strokeLinejoin="round">
      {buildings.map((b, i) => {
        const top = base - b.h, x0 = b.x, x1 = b.x + b.w, mx = b.x + b.w / 2;
        let roof = `M${x0} ${top} H${x1}`;
        if (b.kind === 1) roof = `M${x0} ${top} H${mx - 3} V${top - 24} H${mx + 3} V${top} H${x1}`; // antenna
        if (b.kind === 2) roof = `M${x0} ${top} H${x0 + b.w * 0.15} V${top - 12} H${x0 + b.w * 0.3} V${top - 22} H${x1 - b.w * 0.3} V${top - 12} H${x1 - b.w * 0.15} V${top} H${x1}`; // deco steps
        if (b.kind === 3) roof = `M${x0} ${top} H${mx - b.w * 0.2} L${mx} ${top - b.w * 0.55} L${mx + b.w * 0.2} ${top} H${x1}`; // spire
        const d = `M${x0} ${base + 400} V${top} ${roof.slice(roof.indexOf("H"))} V${base + 400} Z`;
        return (
          <g key={i}>
            <path d={d} fill={fills[b.c % fills.length]} stroke={INK} strokeWidth={stroke} />
            <rect x={x0 + 4} y={top + 10} width={Math.max(0, b.w - 8)} height={b.h + 400} fill={`url(#${windows})`} />
            {trims && b.kind !== 3 && (
              <rect x={x0 + 2} y={top + 4} width={b.w - 4} height={3} fill={trims[(i + b.c) % trims.length]} />
            )}
          </g>
        );
      })}
    </g>
  );
}

/** Palm tree with its foot at (x, y). `dark` = background silhouette. */
export function Palm({ x, y, s, lean = 1, dark }: { x: number; y: number; s: number; lean?: number; dark?: string }) {
  const trunk = `M0 0 Q${8 * lean} -60 ${22 * lean} -118`;
  const tx = 22 * lean, ty = -118;
  const leaf = "M0 0 Q26 -22 62 -6 Q32 -12 0 0Z";
  const angles = [-160, -128, -95, -60, -25, 8];
  const green = dark ?? "#1f9a62";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <path d={trunk} fill="none" stroke={dark ?? INK} strokeWidth={dark ? 7 : 10} />
      {!dark && <path d={trunk} fill="none" stroke="#8a5a34" strokeWidth={5.5} />}
      {!dark && <path d={trunk} fill="none" stroke="#5e3a1f" strokeWidth={5.5} strokeDasharray="2 9" />}
      <g transform={`translate(${tx} ${ty})`}>
        {angles.map((a, i) => (
          <path key={i} d={leaf} transform={`rotate(${a}) scale(${i % 2 ? 0.92 : 1.05})`} fill={green}
            stroke={dark ? "none" : INK} strokeWidth={2.2} />
        ))}
        {!dark && (
          <>
            <circle cx={-4} cy={4} r={4} fill="#6b4226" stroke={INK} strokeWidth={1.8} />
            <circle cx={4} cy={5} r={4} fill="#6b4226" stroke={INK} strokeWidth={1.8} />
          </>
        )}
      </g>
    </g>
  );
}

/** Curved street lamp with a soft pink glow, foot at (x, y). */
export function StreetLamp({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-26} cy={-104} r={34} fill="url(#lamp-glow)" />
      <path d="M0 0 V-100 Q0 -112 -12 -112 H-22" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M0 0 V-100 Q0 -112 -12 -112 H-22" fill="none" stroke="#3b2d5c" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M-34 -112 H-14 L-18 -104 H-30Z" fill="#3b2d5c" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x={-29} y={-104} width={10} height={4} rx={2} fill="#fff1c7" />
      <rect x={-5} y={-4} width={10} height={6} fill="#3b2d5c" stroke={INK} strokeWidth={2} />
    </g>
  );
}

/** Background palms placed in some of the skyline gaps. */
export function backPalms(buildings: Buildings, base: number, every = 3) {
  return buildings
    .filter((_, i) => i % every === 1)
    .map((b, i) => ({ x: b.x + b.w + 2, y: base + 2, s: 0.7 + ((i * 37) % 10) / 22, lean: i % 2 ? 1 : -1 }));
}
