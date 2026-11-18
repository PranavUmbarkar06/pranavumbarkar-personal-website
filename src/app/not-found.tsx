import Link from "next/link";
import { Jeep } from "@/components/art";
import { vehicle } from "@/content/site";

export default function NotFound() {
  return (
    <main className="stage-bg flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <svg viewBox="-80 -110 160 120" className="w-[min(320px,80vw)] overflow-visible" aria-hidden>
        <path d="M-80 4 Q0 -6 80 4" fill="none" stroke="#8a5a2b" strokeWidth={10} strokeLinecap="round" />
        <g transform="translate(0 -38) rotate(180)"><Jeep v={vehicle} /></g>
      </svg>
      <h1 className="outline-text text-[clamp(40px,9vw,72px)] leading-none">CRASHED!</h1>
      <p className="text-lg text-[#dde6ee]">This road doesn&apos;t exist (yet).</p>
      <Link href="/" className="chunky-btn btn-green mt-2">
        <span className="outline-text">BACK TO STAGES</span>
      </Link>
    </main>
  );
}
