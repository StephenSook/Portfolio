import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stephen Sookra — Software Engineer",
  description:
    "Portfolio of Stephen Sookra — Computer Science student at Kennesaw State University specializing in AI and Machine Learning. 5× hackathon competitor building intelligent systems that matter.",
  keywords: [
    "Stephen Sookra",
    "AI Engineer",
    "Machine Learning",
    "Portfolio",
    "Software Engineer",
    "Kennesaw State University",
  ],
  openGraph: {
    title: "Stephen Sookra — Software Engineer",
    description:
      "Building intelligent systems that matter. AI/ML student, 4× hackathon competitor, full-stack builder.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#060e1a] text-[#e8f0fe]`}
      >
        {children}
      </body>
    </html>
  );
}
