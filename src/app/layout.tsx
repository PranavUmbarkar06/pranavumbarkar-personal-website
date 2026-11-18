import type { Metadata, Viewport } from "next";
import { Comic_Neue, Lilita_One } from "next/font/google";
import "./globals.css";

const lilita = Lilita_One({
  variable: "--font-lilita",
  weight: "400",
  subsets: ["latin"],
});

const comic = Comic_Neue({
  variable: "--font-comic",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pranav · Stage Select",
  description: "Pick a world: treks, projects, music, internships and blogs.",
};

export const viewport: Viewport = {
  themeColor: "#0f151d",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lilita.variable} ${comic.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
