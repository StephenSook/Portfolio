import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { JsonLd } from "@/components/providers/JsonLd";

// Editorial serif display face for the big statement headings.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

// Clean modern body / UI sans.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Monospace for HUD micro-labels and readouts.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://stephensookra.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Stephen Sookra · Software Engineer",
    template: "%s · Stephen Sookra",
  },
  description:
    "Stephen Sookra is a Computer Science student at Kennesaw State University building AI and full-stack systems. 7 top-3 finishes across 6 hackathon events (15+ entered).",
  keywords: [
    "Stephen Sookra",
    "Software Engineer",
    "AI Engineer",
    "Machine Learning",
    "Full Stack Developer",
    "Kennesaw State University",
    "Portfolio",
  ],
  authors: [{ name: "Stephen Sookra", url: SITE_URL }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Stephen Sookra · Software Engineer",
    description:
      "Building intelligent systems that matter. AI and full-stack engineer. 7 top-3 hackathon finishes across 6 events.",
    siteName: "Stephen Sookra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephen Sookra · Software Engineer",
    description:
      "Building intelligent systems that matter. AI and full-stack engineer. 7 top-3 hackathon finishes across 6 events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
