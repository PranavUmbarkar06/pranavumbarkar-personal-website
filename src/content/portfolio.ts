/*
  Typed view of portfolio.json. If you break the JSON's shape (e.g. a missing
  field or a typo in a key), `npm run build` will tell you where.
*/
import data from "./portfolio.json";

type Range = { start: string; end: string };

export type Internship = Range & { role: string; org: string; where: string; points: string[]; tech: string[]; link: string };
export type Project = { name: string; tagline: string; when: string; description: string; tech: string[]; points: string[]; github: string; live: string };
export type Achievement = { title: string; detail: string; when: string; where: string; description: string };
export type Position = Range & { title: string; org: string; points: string[] };
export type Education = Range & { school: string; degree: string; score: string };

export type Portfolio = {
  profile: { name: string; headline: string; location: string; status: string; photo: string; summary: string };
  contact: { email: string; phone: string; resume: string };
  links: { github: string; linkedin: string; leetcode: string; other: { label: string; url: string }[] };
  stats: { value: string; label: string }[];
  internships: Internship[];
  projects: Project[];
  liveProjects: Project[];
  skills: { group: string; items: string[] }[];
  positions: Position[];
  achievements: Achievement[];
  education: Education[];
};

export const portfolio: Portfolio = data;

export const range = (r: Range) => [r.start, r.end].filter(Boolean).join(" – ");

/** how many show on the main page before "see all" */
export const PREVIEW = { projects: 3, achievements: 5 };
