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
