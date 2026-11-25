/* A real photo when `src` is set, otherwise a drawn placeholder landscape. */
import Image from "next/image";
import { useId } from "react";
import type { Photo } from "@/content/types";
import { shade } from "../art";

export function PhotoArt({ photo, className = "", sizes = "(max-width: 700px) 100vw, 640px" }: { photo: Photo; className?: string; sizes?: string }) {
  const id = useId();
  if (photo.src) {
    // `fill`: the parent must be positioned (relative/absolute) and sized
    return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className={`object-cover ${className}`} />;
  }
  if (photo.scene === "city") return <CityArt photo={photo} className={className} id={id} />;
  if (photo.scene === "hall") return <HallArt photo={photo} className={className} id={id} />;
  const [top, bottom, land] = photo.palette;
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${photo.alt} (placeholder)`}
      className={`h-full w-full ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={400} height={250} fill={`url(#${id})`} />
      <circle cx={300} cy={70} r={26} fill="#fff8d6" opacity={0.85} />
      <path d="M0 170 L60 110 L110 150 L170 80 L235 150 L290 100 L340 140 L400 95 V250 H0Z" fill={shade(land, 0.25)} />
      {photo.snow && (
        <path d="M152 98 L170 80 L188 98 L178 94 L170 102 L161 94Z M276 113 L290 100 L304 113 L296 110 L290 116 L283 110Z" fill="#fff" />
      )}
      <path d="M0 200 Q80 160 160 190 T320 180 T400 185 V250 H0Z" fill={land} />
      <path d="M0 230 Q100 205 200 225 T400 220 V250 H0Z" fill={shade(land, -0.3)} />
    </svg>
  );
}

/** Drawn placeholder for the city theme: sunset, striped sun, skyline, palms. */
function CityArt({ photo, className, id }: { photo: Photo; className: string; id: string }) {
  const [top, bottom, neon] = photo.palette;
  const towers: [number, number, number][] = [[10, 120, 40], [46, 90, 30], [74, 140, 34], [230, 100, 36], [262, 70, 30], [290, 125, 44], [330, 95, 32], [358, 135, 42]];
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${photo.alt} (placeholder)`}
      className={`h-full w-full ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.75" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3a8" />
          <stop offset="1" stopColor="#ff3d9a" />
        </linearGradient>
      </defs>
      <rect width={400} height={250} fill={`url(#${id})`} />
      <circle cx={170} cy={150} r={62} fill={`url(#${id}s)`} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={100} y={140 + i * 10} width={140} height={2 + i * 1.3} fill={bottom} />)}
      {towers.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={250 - y} fill={i % 2 ? "#2b1a5a" : "#3d1866"} />
          <rect x={x} y={y} width={w} height={3} fill={i % 3 ? neon : "#ff3d9a"} />
        </g>
      ))}
      <rect y={196} width={400} height={54} fill="#1c0c33" />
      <path d="M0 214 H400" stroke={neon} strokeWidth={3} strokeDasharray="22 16" />
      {[[150, 1], [205, -1]].map(([x, l], i) => (
        <g key={i} transform={`translate(${x} 198)`} fill="#1c0c33" stroke="#1c0c33">
          <path d={`M0 0 Q${6 * l} -40 ${16 * l} -78`} fill="none" strokeWidth={5} />
          <g transform={`translate(${16 * l} -78)`}>
            {[-160, -120, -80, -40, 0].map((a) => <path key={a} d="M0 0 Q20 -16 44 -4 Q22 -9 0 0Z" transform={`rotate(${a})`} />)}
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Drawn placeholder for the hall theme: a curtained stage, spotlight, mic and amps, and the crowd. */
function HallArt({ photo, className, id }: { photo: Photo; className: string; id: string }) {
  const [top, bottom, light] = photo.palette;
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${photo.alt} (placeholder)`}
      className={`h-full w-full ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} stopOpacity={0.05} />
          <stop offset="1" stopColor={light} stopOpacity={0.45} />
        </linearGradient>
      </defs>
      <rect width={400} height={250} fill={`url(#${id})`} />
      {/* proscenium arch */}
      <path d="M40 250 V90 Q200 -10 360 90 V250" fill="none" stroke="#eef3ff" strokeWidth={3} opacity={0.8} />
      <path d="M54 250 V96 Q200 8 346 96 V250" fill="none" stroke="#eef3ff" strokeWidth={1.2} opacity={0.4} />
      {/* curtains */}
      <path d="M40 92 Q70 140 62 250 H40Z M360 92 Q330 140 338 250 H360Z" fill="#0b1a45" stroke="#eef3ff" strokeWidth={1.5} />
      <path d="M58 70 Q130 110 200 72 Q270 110 342 70 L346 58 Q200 20 54 58Z" fill="#0b1a45" stroke="#eef3ff" strokeWidth={1.5} />
      {/* spotlight */}
      <path d="M190 40 H210 L262 200 H138Z" fill={`url(#${id}b)`} />
      <ellipse cx={200} cy={200} rx={66} ry={9} fill={light} opacity={0.35} />
      {/* amps */}
      <rect x={96} y={156} width={44} height={44} rx={3} fill="#05070f" stroke="#eef3ff" strokeWidth={2} />
      <circle cx={118} cy={180} r={13} fill="none" stroke="#eef3ff" strokeWidth={1.5} />
      <rect x={262} y={146} width={44} height={54} rx={3} fill="#05070f" stroke="#eef3ff" strokeWidth={2} />
      <circle cx={284} cy={166} r={9} fill="none" stroke="#eef3ff" strokeWidth={1.5} />
      <circle cx={284} cy={186} r={9} fill="none" stroke="#eef3ff" strokeWidth={1.5} />
      {/* mic */}
      <path d="M200 200 V132 L212 120" stroke="#eef3ff" strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={208} y={106} width={12} height={20} rx={6} transform="rotate(-30 214 116)" fill="#eef3ff" />
      <rect y={200} width={400} height={50} fill="#05070f" />
      {/* crowd */}
      {Array.from({ length: 17 }, (_, i) => (
        <circle key={i} cx={8 + i * 24 + (i % 2) * 6} cy={236 + (i % 3) * 3} r={13} fill="#010206" stroke="#1d3f99" strokeWidth={1.5} />
      ))}
      <path d="M92 222 l6 -26 M318 220 l-4 -24" stroke="#010206" strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
}
