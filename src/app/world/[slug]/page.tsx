import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import Journey from "@/components/journey/Journey";
import { player, worlds } from "@/content/site";
import { journeys } from "@/content/worlds";

export function generateStaticParams() {
  return worlds.map((w) => ({ slug: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/world/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = worlds.find((x) => x.id === slug);
  return { title: w ? `${w.title} · ${player.name}` : player.name, description: w?.subtitle };
}

export default function WorldPage({ params }: PageProps<"/world/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#9fd8ff]" />}>
      <World params={params} />
    </Suspense>
  );
}

async function World({ params }: { params: PageProps<"/world/[slug]">["params"] }) {
  const { slug } = await params;
  const world = worlds.find((w) => w.id === slug);
  if (!world) notFound();
  const load = journeys[slug];
  if (world.locked || !load) return <ComingSoon title={world.title} subtitle={world.subtitle} />;
  const journey = load();
  return <Journey slug={journey.slug} title={journey.title} intro={journey.intro} milestones={journey.milestones} />;
}
