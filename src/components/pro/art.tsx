/* Engraving-style artwork for the recruiter page (original, drawn in code). */
import { rng } from "@/components/journey/terrain";

const W = 1200, H = 440;

/** jagged ridge from left to right, closed at the bottom */
function ridge(seed: number, base: number, amp: number, step: number) {
  const r = rng(seed);
  const pts: string[] = [];
  for (let x = -20; x <= W + 20; x += step) {
    const y = base - amp * (0.35 + 0.65 * Math.abs(Math.sin(x / (step * 3.1) + seed))) - r() * amp * 0.25;
    pts.push(`${x} ${y.toFixed(0)}`);
  }
  return `M-20 ${H} L${pts.join(" L")} L${W + 20} ${H} Z`;
}

function pines(seed: number, base: number, n: number) {
  const r = rng(seed);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.round(r() * W), h = 26 + r() * 38, y = base + r() * 14, w = h * 0.32;
    out.push(`M${x} ${(y - h).toFixed(0)} L${(x + w).toFixed(0)} ${y.toFixed(0)} L${(x - w).toFixed(0)} ${y.toFixed(0)} Z`);
  }
  return out.join(" ");
}

const FAR = ridge(3, 250, 90, 46);
const MID = ridge(11, 305, 70, 34);
const NEAR = ridge(23, 360, 48, 26);
const TREES = pines(5, 372, 46);

export function ProHero() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1d1915" strokeWidth="1" opacity="0.35" />
        </pattern>
        <pattern id="sunlines" width="10" height="9" patternUnits="userSpaceOnUse">
          <rect width="10" height="3.2" y="5.8" fill="#f7f1e4" />
        </pattern>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f1e4" />
          <stop offset="1" stopColor="#e3d2b2" />
        </linearGradient>
        <clipPath id="sunclip"><rect x="0" y="175" width={W} height="200" /></clipPath>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />
      {/* sun with retro bands */}
      <circle cx="790" cy="190" r="118" fill="#8c4a2b" />
      <circle cx="790" cy="190" r="118" fill="url(#sunlines)" clipPath="url(#sunclip)" />
      <circle cx="790" cy="190" r="134" fill="none" stroke="#1d1915" strokeWidth="1" />
      {/* birds */}
      <g fill="none" stroke="#1d1915" strokeWidth="2" strokeLinecap="round">
        <path d="M300 110 q8 -8 16 0 q8 -8 16 0" />
        <path d="M345 86 q6 -6 12 0 q6 -6 12 0" />
        <path d="M268 140 q5 -5 10 0 q5 -5 10 0" />
      </g>
      {/* ridges */}
      <path d={FAR} fill="#c9b18a" stroke="#1d1915" strokeWidth="1.5" />
      <path d={FAR} fill="url(#hatch)" opacity="0.5" />
      <path d={MID} fill="#8a7a55" stroke="#1d1915" strokeWidth="1.5" />
      <path d={MID} fill="url(#hatch)" />
      <path d={NEAR} fill="#5b3e2b" stroke="#1d1915" strokeWidth="1.5" />
      <path d={TREES} fill="#1d1915" />
      <rect y="380" width={W} height={H - 380} fill="#1d1915" />
      {/* road */}
      <path d="M-20 420 C 250 388, 520 404, 760 394 S 1100 380, 1220 386" fill="none" stroke="#efe7d6" strokeWidth="3" strokeDasharray="18 12" />
      {/* little jeep: a nod to the game */}
      <g transform="translate(560 372)" fill="#efe7d6">
        <path d="M0 18 L4 6 L22 6 L28 0 L40 0 L44 10 L54 12 L54 20 L0 20 Z" />
        <circle cx="13" cy="21" r="5" fill="#1d1915" stroke="#efe7d6" strokeWidth="2.5" />
        <circle cx="43" cy="21" r="5" fill="#1d1915" stroke="#efe7d6" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/** little flourish under section titles */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 20" width="160" height="20" className={`mx-auto block ${className}`} aria-hidden>
      <g fill="none" stroke="#1d1915" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 10 H58 M102 10 H156" />
        <path d="M58 10 C 64 2, 72 2, 72 8 C 72 12, 66 12, 66 9" />
        <path d="M102 10 C 96 2, 88 2, 88 8 C 88 12, 94 12, 94 9" />
        <path d="M58 10 C 64 18, 72 18, 74 12 M102 10 C 96 18, 88 18, 86 12" />
      </g>
      <path d="M80 3 L86 10 L80 17 L74 10 Z" fill="#8c4a2b" stroke="#1d1915" strokeWidth="1" />
    </svg>
  );
}
