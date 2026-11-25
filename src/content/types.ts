/* Shared content types for every world's journey. */

export type TerrainHint = "flat" | "climb" | "peak" | "valley" | "pass";

export interface Photo {
  /** e.g. "/treks/kedarkantha/1.jpg". "" = drawn placeholder. */
  src: string;
  alt: string;
  /** colours for the drawn placeholder: [sky top, sky bottom, mountains] */
  palette: [string, string, string];
  snow?: boolean;
  /** which drawn placeholder to use when there's no src (default: mountains) */
  scene?: "mountains" | "city" | "hall";
}

export interface Collaborator {
  name: string;
  /** GitHub / LinkedIn / site. "" = plain name, no link */
  url?: string;
}

/** An audio/video clip on a Music card. */
export interface Clip {
  /** audio/video = a file in the gig folder, youtube = embedded, link = a button to any other site */
  type: "audio" | "video" | "youtube" | "link";
  src: string;
  title: string;
}

export type StoryCard =
  | { kind: "text"; title?: string; body: string; mood?: "normal" | "shout" | "thought" }
  | { kind: "photo"; photos: Photo[]; caption?: string }
  | { kind: "stats"; items: { label: string; value: string }[] }
  | { kind: "quote"; text: string; by?: string }
  | {
      kind: "project";
      image: Photo;
      brief?: string;
      status?: string;
      role?: string;
      dates: string;
      tech: string[];
      collaborators: Collaborator[];
      github?: string;
      demo?: string;
    }
  | {
      kind: "gig";
      image: Photo;
      brief?: string;
      band?: string;
      venue?: string;
      date: string;
      instruments: string[];
      members: Collaborator[];
      setlist: string[];
    }
  | { kind: "media"; clips: Clip[] };

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

/** Look of the scenic drive: "mountains" (Treks), "city" (Projects: neon sunset city), "hall" (Music: concert hall at night). */
export type JourneyTheme = "mountains" | "city" | "hall";

export interface JourneyContent {
  slug: string;
  title: string;
  intro: string;
  theme?: JourneyTheme;
  /** line under STAGE CLEAR! at the end */
  clear?: string;
  milestones: Milestone[];
}
