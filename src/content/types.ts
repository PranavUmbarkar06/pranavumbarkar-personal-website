/* Shared content types for every world's journey. */

export type TerrainHint = "flat" | "climb" | "peak" | "valley" | "pass";

export interface Photo {
  /** e.g. "/treks/kedarkantha/1.jpg". "" = drawn placeholder. */
  src: string;
  alt: string;
  /** colours for the drawn placeholder: [sky top, sky bottom, mountains] */
  palette: [string, string, string];
  snow?: boolean;
}

export type StoryCard =
  | { kind: "text"; title?: string; body: string; mood?: "normal" | "shout" | "thought" }
  | { kind: "photo"; photos: Photo[]; caption?: string }
  | { kind: "stats"; items: { label: string; value: string }[] }
  | { kind: "quote"; text: string; by?: string };

export interface Milestone {
  id: string;
  sign: { what: string; when: string; where: string };
  skyPhoto?: Photo;
  terrain: TerrainHint;
  /** how high the road has climbed by this sign (0..200) */
  lift: number;
  km?: number;
  finish?: boolean;
  cards: StoryCard[];
}

export interface JourneyContent {
  slug: string;
  title: string;
  intro: string;
  milestones: Milestone[];
}
