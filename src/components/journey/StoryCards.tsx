/* The comic-book cards in the story feed. One component per card kind. */
import type { StoryCard } from "@/content/types";
import { PhotoArt } from "./PhotoArt";

export function Card({ card }: { card: StoryCard }) {
  switch (card.kind) {
    case "text":
      if (card.mood === "shout")
        return (
          <div className="comic comic-shout">
            <p className="font-game text-[clamp(24px,5vw,34px)] leading-tight uppercase">{card.body}</p>
          </div>
        );
      if (card.mood === "thought")
        return (
          <div className="comic-thought">
            <p className="text-lg italic">{card.body}</p>
            <span className="puff puff-1" /><span className="puff puff-2" />
          </div>
        );
      return (
        <div className="comic">
          {card.title && <h3 className="font-game mb-1 text-2xl text-[#1d3b5c]">{card.title}</h3>}
          <p className="text-lg leading-snug">{card.body}</p>
        </div>
      );
    case "photo":
      return (
        <figure className="comic p-2.5!">
          <div className={`grid gap-2 ${card.photos.length === 1 ? "" : card.photos.length === 2 ? "grid-cols-2" : "grid-cols-2 [&>*:first-child]:col-span-2"}`}>
            {card.photos.map((p, i) => (
              <div key={i} className={`relative overflow-hidden rounded-md border-[3px] border-ink ${card.photos.length === 1 || i === 0 ? "aspect-[16/10]" : "aspect-square"}`}>
                <PhotoArt photo={p} />
              </div>
            ))}
          </div>
          {card.caption && <figcaption className="caption-strip">{card.caption}</figcaption>}
        </figure>
      );
    case "stats":
      return (
        <div className="grid grid-cols-3 gap-2.5">
          {card.items.map((it) => (
            <div key={it.label} className="stat-tile">
              <div className="text-xs font-bold tracking-wider text-[#5b4a2f]">{it.label}</div>
              <div className="font-game text-[clamp(18px,4vw,26px)] leading-none">{it.value}</div>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="comic comic-speech">
          <p className="font-game text-2xl leading-tight">&ldquo;{card.text}&rdquo;</p>
          {card.by && <footer className="mt-1 text-sm text-[#555]">— {card.by}</footer>}
        </blockquote>
      );
  }
}
