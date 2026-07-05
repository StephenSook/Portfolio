import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE = "https://stephensookra.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const featured = projects.filter((p) => p.tier === "featured");
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/work`, priority: 0.8 },
    { url: `${BASE}/lab`, priority: 0.6 },
    ...featured.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      priority: 0.7,
    })),
  ];
}
