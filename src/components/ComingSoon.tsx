import Link from "next/link";
import { LockIcon } from "./art";

export default function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <main className="stage-bg flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="lock-big"><LockIcon /></div>
      <h1 className="outline-text text-[clamp(40px,9vw,72px)] leading-none">{title}</h1>
      <p className="outline-text text-[clamp(22px,4vw,30px)] text-gold">COMING SOON</p>
      <p className="max-w-sm text-lg text-[#dde6ee]">{subtitle}. This road is still being paved.</p>
      <Link href="/" className="chunky-btn btn-steel mt-2">
        <span className="outline-text">BACK TO STAGES</span>
      </Link>
    </main>
  );
}
