/*
  ==========================================================
   SITE DATA  (edit this file to make the site yours)
  ==========================================================
   Everything on the landing page comes from here.
   Each world's journey content lives in src/content/worlds/<id>.ts.
   - Swap the dummy text for your own (all of it is made up for now).
   - To use a real photo, put it in /public/photos and set the
     path, e.g. image: "/photos/treks.jpg".
     Leave it as "" to keep the drawn cartoon scene.
*/

export type SceneKind = "mountains" | "workshop" | "music" | "city" | "paper";

export interface World {
  id: string;
  title: string;
  subtitle: string;
  stat: string;
  scene: SceneKind;
  sky: [top: string, bottom: string];
  hill: string;
  image: string;
  /** true = padlock + "COMING SOON". false = START opens /world/<id>. */
  locked: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  body: string;
  trim: string;
}

export const player = {
  name: "PRANAV",
  /** Your face for the driver's seat (square-ish photo). "" = cartoon face. */
  driverPhoto: "",
  /** Cutout photo in the bottom-left corner (transparent PNG is ideal). "" = cartoon. */
  cornerPhoto: "",
  greeting: "Hey! Pick a world and hit START.",
  coins: 1337, // dummy counter
  gems: 42, // dummy counter
  trophies: 20, // your age
};

/** The cards you swipe through. Order here = order on screen. */
export const worlds: World[] = [
  {
    id: "treks",
    locked: false,
    title: "TREKS",
    subtitle: "Mountains, trails & sore legs",
    stat: "5 summits",
    scene: "mountains",
    sky: ["#7fd3ff", "#d8f3ff"],
    hill: "#5fbf3a",
    image: "",
  },
  {
    id: "projects",
    locked: true,
    title: "PROJECTS",
    subtitle: "Things I built (and broke)",
    stat: "8 builds",
    scene: "workshop",
    sky: ["#ffb347", "#ffe3a8"],
    hill: "#c97a2b",
    image: "",
  },
  {
    id: "music",
    locked: true,
    title: "MUSIC",
    subtitle: "Songs, jams & playlists",
    stat: "24 tracks",
    scene: "music",
    sky: ["#7b5cff", "#e0b8ff"],
    hill: "#3c2a8f",
    image: "",
  },
  {
    id: "internships",
    locked: true,
    title: "INTERNSHIPS",
    subtitle: "Where I learned on the job",
    stat: "3 offices",
    scene: "city",
    sky: ["#4aa3df", "#bfe6ff"],
    hill: "#6c7a89",
    image: "",
  },
  {
    id: "blogs",
    locked: true,
    title: "BLOGS",
    subtitle: "Thoughts, rants & notes",
    stat: "15 posts",
    scene: "paper",
    sky: ["#ff7aa8", "#ffd6e5"],
    hill: "#e04f7f",
    image: "",
  },
];

/** The ride in every scene. */
export const vehicle: Vehicle = { id: "jeep", name: "RED JEEP", body: "#e3262b", trim: "#8f1216" };

/** Links shown on the landing page. */
export const links = {
  // Your public Spotify playlist (replace with the real share link).
  spotify: "https://open.spotify.com/playlist/REPLACE_WITH_YOUR_PLAYLIST_ID",
};

/** Sound is on by default; visitors can mute it with the speaker button. */
export const sound = {
  volume: 0.12, // 0..1, keep it tiny
  // Optional background music file in /public/audio, e.g. "/audio/theme.mp3".
  // "" = just the little engine hum and button blips.
  music: "",
};
