import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CaseStudy } from "@/components/work/CaseStudy";

/** Pre-render one static route per featured mission. */
export async function generateStaticParams() {
  return projects
    .filter((p) => p.tier === "featured")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.tier === "featured");
  if (!project) return {};

  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      type: "article",
      title: project.name,
      description: project.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.tagline,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.tier === "featured");
  if (!project) notFound();

  return (
    <main id="main" className="mx-auto max-w-5xl px-6 py-24 md:py-32">
      <CaseStudy project={project} />
    </main>
  );
}
