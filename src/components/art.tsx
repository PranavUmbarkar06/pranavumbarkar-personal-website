/* Hand-drawn SVG art: the jeep, world scenes, trophy and the corner host. */
import { useId } from "react";
import type { SceneKind, Vehicle, World } from "@/content/site";
import { player } from "@/content/site";

const INK = "#111";

/** Darken (amt < 0) or lighten (amt > 0) a hex colour. */
export function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = num >> 16, g = (num >> 8) & 255, b = num & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ---------------- driver face ---------------- */
function DriverFace() {
  const id = useId();
  if (player.driverPhoto) {
    return (
      <>
        <clipPath id={id}><circle r={12} /></clipPath>
        <image href={player.driverPhoto} x={-12} y={-12} width={24} height={24}
          preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
        <circle r={12} fill="none" stroke={INK} strokeWidth={2.5} />
      </>
    );
  }
  return (
    <>
      <circle r={12} fill="#f1b98a" stroke={INK} strokeWidth={2.5} />
      <path d="M-12 -2 Q-12 -14 0 -14 Q12 -14 12 -2 Q6 -8 -2 -7 Q-8 -6 -12 -2Z" fill="#2a1b12" stroke={INK} strokeWidth={2} />
      <rect x={-9} y={-3} width={7} height={5} rx={1.5} fill="#111" />
      <rect x={2} y={-3} width={7} height={5} rx={1.5} fill="#111" />
      <path d="M-2 -1 H2" stroke="#111" strokeWidth={1.5} />
      <path d="M-4 5 Q0 9 5 5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

/* ---------------- jeep ---------------- */
function Wheel({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} -12)`}>
      <g className="wheel">
        <circle r={13} fill="#222" stroke={INK} strokeWidth={2.5} />
        <circle r={6.5} fill="#bfc6cc" stroke={INK} strokeWidth={2} />
        <path d="M0 -10 V10 M-10 0 H10" stroke="#555" strokeWidth={2} />
        <circle r={2} fill={INK} />
      </g>
    </g>
  );
}

/** Jeep drawn with its origin at the ground, centred between the wheels. */
export function Jeep({ v, driver = true }: { v: Vehicle; driver?: boolean }) {
  const bar = "M-34 -32 L-30 -60 H-16 L-14 -32";
  return (
    <g className="jeep">
      <path d="M-38 -32 L-50 -84" stroke={INK} strokeWidth={2} />
      <path d="M-50 -84 L-34 -79 L-48 -73Z" fill="#ffd23f" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={bar} fill="none" stroke={v.trim} strokeWidth={5} strokeLinejoin="round" />
      <path d={bar} fill="none" stroke={INK} strokeWidth={1.5} opacity={0.6} />
      {driver && (
        <>
          <rect x={-17} y={-48} width={18} height={18} rx={4} fill="#2f8fd8" stroke={INK} strokeWidth={2.5} />
          <g transform="translate(-7 -60)"><g className="driver-head"><DriverFace /></g></g>
        </>
      )}
      <path d="M13 -36 L5 -62" stroke="#3c4650" strokeWidth={5} strokeLinecap="round" />
      <path d="M13 -36 L5 -62" stroke="#a9dff7" strokeWidth={2} strokeLinecap="round" />
      <path d="M-46 -14 V-34 H12 L18 -40 H44 Q48 -40 48 -36 V-14 Z" fill={v.body} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <rect x={-46} y={-26} width={94} height={4} fill={v.trim} />
      <path d="M-40 -31 H8" stroke="#fff" strokeOpacity={0.45} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={44} cy={-31} r={3.2} fill="#fff6b0" stroke={INK} strokeWidth={1.5} />
      <rect x={-50} y={-20} width={6} height={6} rx={1} fill={INK} />
      <Wheel x={-26} />
      <Wheel x={28} />
    </g>
  );
}

/* ---------------- scene decorations ---------------- */
function Gear({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  const dash = `${r * 0.42} ${r * 0.42}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="none" stroke={INK} strokeWidth={r * 0.55} strokeDasharray={dash} />
      <circle r={r} fill="none" stroke={c} strokeWidth={r * 0.4} strokeDasharray={dash} />
      <circle r={r * 0.8} fill={c} stroke={INK} strokeWidth={2.5} />
      <circle r={r * 0.3} fill={INK} />
    </g>
  );
}

function Speaker({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={100} width={40} height={56} rx={4} fill="#2b2140" stroke={INK} strokeWidth={2.5} />
      <circle cx={x + 20} cy={115} r={7} fill="#555" stroke={INK} strokeWidth={2} />
      <circle cx={x + 20} cy={138} r={12} fill="#555" stroke={INK} strokeWidth={2} />
      <circle cx={x + 20} cy={138} r={4} fill={INK} />
    </g>
  );
}

function Decor({ scene }: { scene: SceneKind }) {
  switch (scene) {
    case "mountains":
      return (
        <g stroke={INK} strokeLinejoin="round">
          <path d="M20 150 L95 45 L170 150Z" fill="#8f9fb0" strokeWidth={2.5} />
          <path d="M77 70 L95 45 L113 70 L104 64 L95 72 L86 64Z" fill="#fff" strokeWidth={2} />
          <path d="M140 150 L220 30 L300 150Z" fill="#7a8a9c" strokeWidth={2.5} />
          <path d="M199 62 L220 30 L241 62 L230 55 L220 64 L210 55Z" fill="#fff" strokeWidth={2} />
        </g>
      );
    case "workshop":
      return (
        <g>
          <Gear x={80} y={90} r={30} c="#e6a03a" />
          <Gear x={128} y={62} r={18} c="#f2c35a" />
          <Gear x={250} y={85} r={24} c="#d9822b" />
          <path d="M190 150 V40 H240" fill="none" stroke={INK} strokeWidth={6} />
          <path d="M190 150 V40 H240" fill="none" stroke="#ffd23f" strokeWidth={3} />
          <path d="M236 40 V58" stroke={INK} strokeWidth={2} />
          <rect x={229} y={58} width={14} height={10} fill="#666" stroke={INK} strokeWidth={2} />
        </g>
      );
    case "neon": {
      // sunset sun, skyline with neon trims, palms
      const towers: [number, number, number, string][] = [[6, 78, 30, "#ff3d9a"], [40, 52, 26, "#2de2e6"], [70, 92, 34, "#ff9a3c"], [206, 66, 30, "#2de2e6"], [240, 40, 26, "#ff3d9a"], [270, 84, 44, "#ffd23f"]];
      return (
        <g>
          <circle cx={160} cy={112} r={52} fill="#ffcf6b" />
          <path d="M108 112 A52 52 0 0 0 212 112 Z" fill="#ff3d9a" opacity={0.55} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={100} y={104 + i * 11} width={120} height={2.5 + i * 1.5} fill="#ff8a6b" />)}
          {towers.map(([x, y, w, neon], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={160 - y} fill={i % 2 ? "#3d1866" : "#2b1a5a"} stroke={INK} strokeWidth={2.5} />
              <rect x={x + 2} y={y + 4} width={w - 4} height={3} fill={neon} />
              {Array.from({ length: Math.floor((140 - y) / 14) }, (_, r) => (
                <rect key={r} x={x + 6} y={y + 14 + r * 14} width={w - 12} height={4} fill="#ffe08a" opacity={0.5 + ((r + i) % 2) * 0.3} />
              ))}
            </g>
          ))}
          {[[124, 1], [196, -1]].map(([x, l], i) => (
            <g key={i} transform={`translate(${x} 150)`} strokeLinejoin="round" strokeLinecap="round">
              <path d={`M0 0 Q${5 * l} -36 ${14 * l} -70`} fill="none" stroke={INK} strokeWidth={7} />
              <path d={`M0 0 Q${5 * l} -36 ${14 * l} -70`} fill="none" stroke="#8a5a34" strokeWidth={3.5} />
              <g transform={`translate(${14 * l} -70)`}>
                {[-160, -125, -90, -55, -20, 10].map((a) => (
                  <path key={a} d="M0 0 Q18 -15 42 -4 Q22 -8 0 0Z" transform={`rotate(${a})`} fill="#1f9a62" stroke={INK} strokeWidth={2} />
                ))}
              </g>
            </g>
          ))}
        </g>
      );
    }
    case "music":
      return (
        <g>
          {/* concert-hall dome and a staff behind the notes */}
          <g fill="none" stroke="#eef3ff">
            <path d="M10 156 A140 118 0 0 1 290 156" strokeWidth={2} opacity={0.35} />
            <path d="M44 156 A106 88 0 0 1 256 156" strokeWidth={1.2} opacity={0.22} />
            {[30, 38, 46, 54, 62].map((y) => <path key={y} d={`M30 ${y} H270`} strokeWidth={1.2} opacity={0.45} />)}
          </g>
          <g fill="#fff" stroke={INK} strokeWidth={2.5}>
            <g transform="translate(60 60)">
              <ellipse rx={9} ry={7} transform="rotate(-20)" />
              <path d="M8 -2 V-36 L22 -30" fill="none" strokeWidth={4} />
            </g>
            <g transform="translate(240 50) scale(.8)">
              <ellipse rx={9} ry={7} transform="rotate(-20)" />
              <ellipse cx={28} cy={-6} rx={9} ry={7} transform="rotate(-20 28 -6)" />
              <path d="M8 -2 V-38 L36 -44 V-8" fill="none" strokeWidth={4} />
            </g>
            <g transform="translate(150 40) scale(.6)">
              <ellipse rx={9} ry={7} transform="rotate(-20)" />
              <path d="M8 -2 V-36" fill="none" strokeWidth={4} />
            </g>
          </g>
          <Speaker x={24} />
          <Speaker x={256} />
        </g>
      );
    case "city": {
      const blocks: [number, number, number][] = [[14, 70, 40], [58, 40, 34], [96, 85, 30], [190, 55, 38], [232, 30, 30], [266, 75, 44]];
      return (
        <g>
          {blocks.map(([x, y, w], i) => {
            const wins = [];
            for (let wy = y + 10; wy < 140; wy += 16)
              for (let wx = x + 6; wx < x + w - 8; wx += 11)
                wins.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width={6} height={8} fill={(wx + wy + i) % 3 ? "#ffe680" : "#3b4a5a"} />);
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={160 - y} fill={["#5a6b7d", "#6f8194", "#4f5f70"][i % 3]} stroke={INK} strokeWidth={2.5} />
                {wins}
              </g>
            );
          })}
        </g>
      );
    }
    case "paper":
      return (
        <g>
          <path d="M100 50 Q150 30 200 55" fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="4 5" />
          <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
            <path d="M40 70 L100 50 L70 85 Z" fill="#fff" />
            <path d="M70 85 L75 68 L100 50" fill="#dfe6ee" />
            <path d="M220 45 L270 30 L246 58 Z" fill="#fff" />
            <path d="M246 58 L250 44 L270 30" fill="#dfe6ee" />
            <g transform="translate(150 95) rotate(-8)">
              <rect x={-24} y={-30} width={48} height={60} rx={3} fill="#fffdf5" />
              <path d="M-15 -16 H15 M-15 -6 H15 M-15 4 H10 M-15 14 H12" stroke="#9aa6b2" strokeWidth={2.5} />
            </g>
          </g>
        </g>
      );
  }
}

/* ---------------- full world scene ---------------- */
export function Scene({ world, vehicle }: { world: World; vehicle: Vehicle }) {
  const id = useId();
  const [top, bottom] = world.sky;
  const road = "M0 172 C70 158 110 176 160 172 S260 154 320 166";
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 block h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={320} height={200} fill={`url(#${id})`} />
      <circle cx={280} cy={30} r={16} fill="#fff6b0" opacity={0.9} />
      <g className="cloud" fill="#fff" opacity={0.9}>
        <ellipse cx={70} cy={28} rx={22} ry={9} />
        <ellipse cx={86} cy={22} rx={14} ry={10} />
        <ellipse cx={200} cy={40} rx={18} ry={7} />
        <ellipse cx={380} cy={30} rx={20} ry={8} />
      </g>
      <Decor scene={world.scene} />
      <path d="M0 150 Q60 120 120 140 T240 130 T320 135 V200 H0Z" fill={shade(world.hill, 0.25)} stroke={INK} strokeWidth={2.5} />
      <path d={`${road} V200 H0Z`} fill={world.scene === "neon" ? "#2a2140" : "#8a5a2b"} stroke={INK} strokeWidth={3} />
      <path d={`${road} V178 C260 166 210 184 160 182 S70 168 0 182Z`} fill={world.hill} />
      <path d={road} fill="none" stroke={INK} strokeWidth={3} />
      <path d="M20 172 l4 -8 l4 8z M100 168 l3 -7 l3 7z M250 162 l4 -8 l4 8z M290 164 l3 -6 l3 6z" fill={shade(world.hill, -0.25)} />
      <g fill="#5e3a17" opacity={0.6}>
        <circle cx={40} cy={190} r={3} />
        <circle cx={130} cy={192} r={2.5} />
        <circle cx={210} cy={188} r={3} />
        <circle cx={290} cy={192} r={2} />
      </g>
      <g transform="translate(150 174) rotate(-2) scale(.95)">
        <Jeep v={vehicle} />
      </g>
    </svg>
  );
}

/* ---------------- HUD trophy ---------------- */
export function TrophyIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full drop-shadow-[0_4px_0_rgba(0,0,0,.5)]">
      <path d="M18 8h28v14a14 14 0 0 1-28 0z" fill="#ffd23f" stroke="#2a1a00" strokeWidth={3} />
      <path d="M18 12H8v4a10 10 0 0 0 10 10M46 12h10v4a10 10 0 0 1-10 10" fill="none" stroke="#2a1a00" strokeWidth={3} />
      <rect x={28} y={36} width={8} height={10} fill="#ffd23f" stroke="#2a1a00" strokeWidth={3} />
      <rect x={18} y={46} width={28} height={9} rx={2} fill="#c98a12" stroke="#2a1a00" strokeWidth={3} />
      <path d="M24 12v8" stroke="#fff6c2" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- corner host (placeholder cutout) ---------------- */
export function HostFigure() {
  if (player.cornerPhoto) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={player.cornerPhoto} alt={player.name} className="h-full w-full object-contain object-bottom drop-shadow-[0_6px_0_rgba(0,0,0,.45)]" />;
  }
  return (
    <svg viewBox="0 0 120 160" aria-hidden className="h-full w-full drop-shadow-[0_6px_0_rgba(0,0,0,.45)]">
      <path d="M28 160 V112 Q28 92 60 92 Q92 92 92 112 V160Z" fill="#e3262b" stroke={INK} strokeWidth={4} />
      <path d="M46 96 L60 112 L74 96" fill="none" stroke={INK} strokeWidth={3} />
      <path d="M90 108 Q108 92 106 62" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <path d="M90 108 Q108 92 106 62" fill="none" stroke="#e3262b" strokeWidth={9} strokeLinecap="round" />
      <circle cx={106} cy={56} r={10} fill="#f1b98a" stroke={INK} strokeWidth={3.5} />
      <rect x={52} y={78} width={16} height={16} fill="#f1b98a" stroke={INK} strokeWidth={3.5} />
      <circle cx={60} cy={54} r={28} fill="#f1b98a" stroke={INK} strokeWidth={4} />
      <path d="M32 50 Q30 24 58 22 Q88 22 88 48 Q76 34 58 36 Q42 37 32 50Z" fill="#2a1b12" stroke={INK} strokeWidth={3.5} />
      <circle cx={49} cy={55} r={4} fill={INK} />
      <circle cx={71} cy={55} r={4} fill={INK} />
      <path d="M48 66 Q60 77 72 66" fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={40} cy={64} r={4} fill="#f08a7a" opacity={0.6} />
      <circle cx={80} cy={64} r={4} fill="#f08a7a" opacity={0.6} />
    </svg>
  );
}

/* ---------------- small icons ---------------- */
export function LockIcon() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden className="block h-full w-full">
      <path d="M9 14 V10 a7 7 0 0 1 14 0 V14" fill="none" stroke={INK} strokeWidth={6} />
      <path d="M9 14 V10 a7 7 0 0 1 14 0 V14" fill="none" stroke="#c9d1d9" strokeWidth={3} />
      <rect x={5} y={13} width={22} height={16} rx={3} fill="#ffd23f" stroke={INK} strokeWidth={3} />
      <circle cx={16} cy={20} r={2.5} fill={INK} />
      <path d="M16 21 V25" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

export function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden className="block h-full w-full">
      <g fill="none" stroke={INK} strokeLinecap="round">
        <path d="M5 9 Q12 6.5 19 9.5" strokeWidth={2.6} />
        <path d="M6 12.6 Q12 10.6 17.6 13" strokeWidth={2.2} />
        <path d="M7 16 Q12 14.6 16.2 16.4" strokeWidth={1.8} />
      </g>
    </svg>
  );
}

export function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden className="block h-full w-full">
      <path d="M4 9 H8 L13 5 V19 L8 15 H4Z" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {muted ? (
        <path d="M16 9 L21 14 M21 9 L16 14" stroke="#ff5a5a" strokeWidth={2.6} strokeLinecap="round" />
      ) : (
        <g fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round">
          <path d="M16 9.5 Q18 12 16 14.5" />
          <path d="M18.5 7.5 Q22 12 18.5 16.5" />
        </g>
      )}
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden className="block h-full w-full">
      <path d="M11 9 V6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 V9" fill="none" stroke={INK} strokeWidth={5} />
      <path d="M11 9 V6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 V9" fill="none" stroke="#c9d1d9" strokeWidth={2} />
      <rect x={3} y={9} width={26} height={19} rx={3} fill="#a8703a" stroke={INK} strokeWidth={3} />
      <path d="M3 17 H29" stroke={INK} strokeWidth={2.5} />
      <rect x={13} y={14} width={6} height={6} rx={1} fill="#ffd23f" stroke={INK} strokeWidth={2} />
    </svg>
  );
}
