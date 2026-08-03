import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectMedia } from "@/components/ProjectMedia";
import { SiteFooter } from "@/components/SiteFooter";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Studio Romann" };
  return {
    title: `${project.title} — Studio Romann`,
    description: project.about,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="page">
      <ProjectHeader project={project} />
      <ProjectMedia project={project} />
      <div className="page-inner" style={{ paddingTop: 0 }}>
        <SiteFooter />
      </div>
    </main>
  );
}
