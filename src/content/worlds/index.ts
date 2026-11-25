/* Which worlds have journey content. Add a new world's loader here when it's built. */
import "server-only";
import type { JourneyContent } from "../types";
import { loadMusic } from "./music";
import { loadProjects } from "./projects";
import { loadTreks } from "./treks";

export const journeys: Record<string, () => JourneyContent> = { treks: loadTreks, projects: loadProjects, music: loadMusic };
