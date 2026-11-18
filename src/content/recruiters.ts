/*
  ==========================================================
   RECRUITER DASHBOARD  (/recruiters)
  ==========================================================
   Everything here is MADE-UP placeholder data. Replace it with yours.
   Leave a link as "" to hide its button.
*/

export const profile = {
  name: "Pranav",
  headline: "Engineering student · builds hardware, software and the odd personal website",
  location: "Pune, India",
  status: "Open to internships for Summer 2027", // shown as a green badge
  photo: "", // e.g. "/photos/headshot.jpg"; "" = initials
  summary:
    "Third-year engineering student who likes taking ideas from a whiteboard sketch to something people can use. Comfortable across embedded systems, networks and web development, and happiest on small teams that ship.",
  links: {
    email: "pranav@example.com",
    linkedin: "https://www.linkedin.com/in/your-handle",
    github: "https://github.com/your-handle",
    resume: "", // e.g. "/pranav-resume.pdf" (put the PDF in /public)
  },
};

export const stats = [
  { label: "CGPA", value: "8.7 / 10" },
  { label: "Projects shipped", value: "8" },
  { label: "Internships", value: "2" },
  { label: "Hackathon wins", value: "3" },
];

export const experience = [
  {
    role: "Software Engineering Intern",
    org: "Acme Robotics",
    where: "Bengaluru",
    when: "May 2026 – Jul 2026",
    points: [
      "Built a telemetry dashboard used by 40+ field engineers.",
      "Cut firmware OTA update time by 35% with delta packages.",
    ],
  },
  {
    role: "Research Intern",
    org: "Networks Lab, College",
    where: "Pune",
    when: "Dec 2025 – Feb 2026",
    points: [
      "Simulated congestion-control variants in ns-3 and compared fairness.",
      "Co-wrote a workshop paper draft on the results.",
    ],
  },
];

export const projects = [
  {
    name: "Analog Sizing Platform",
    blurb: "Web tool that suggests transistor sizes for common analog blocks from target specs.",
    tags: ["Python", "FastAPI", "React"],
    link: "",
  },
  {
    name: "This website",
    blurb: "A scroll-driven, game-styled personal site where a jeep drives through my treks.",
    tags: ["Next.js", "TypeScript", "Tailwind", "SVG"],
    link: "/",
  },
  {
    name: "SoftOffice",
    blurb: "Lightweight office-suite clone with real-time collaborative editing.",
    tags: ["TypeScript", "WebSockets", "CRDTs"],
    link: "",
  },
];

export const skills = [
  { group: "Languages", items: ["C/C++", "Python", "TypeScript", "Verilog"] },
  { group: "Web", items: ["React", "Next.js", "Node.js", "Tailwind"] },
  { group: "Systems", items: ["Linux", "Networking", "Embedded (STM32, ESP32)", "Git"] },
  { group: "Tools", items: ["MATLAB", "LTspice", "Figma", "Docker"] },
];

export const education = [
  { school: "Your College Name", degree: "B.Tech, Electronics & Computer Engineering", when: "2023 – 2027", note: "CGPA 8.7 / 10" },
  { school: "Your School Name", degree: "Class XII (PCM)", when: "2023", note: "94%" },
];

export const achievements = [
  "Winner, Smart City Hackathon 2025 (team of 4)",
  "Top 5%, national coding contest",
  "Led a 30-person college trekking club for a year",
];
