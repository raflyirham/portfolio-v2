import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiExternalLink } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

import ProjectCard from "@/components/project-card";
import SkillCard from "@/components/skill-card";
import { sanitizeProjectLongDescriptionHtml } from "@/libs/project-html";
import { getPublishedProjectBySlug, getRelatedProjects } from "@/libs/projects";
import { getSkillIconNode, getSkills } from "@/libs/skills";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: "Project | Portfolio" };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, skills] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getSkills(),
  ]);

  if (!project) {
    notFound();
  }

  const related = await getRelatedProjects(slug);
  const skillMap = new Map(skills.map((skill) => [skill.key, skill]));
  const safeHtml = sanitizeProjectLongDescriptionHtml(project.longDescriptionHtml);

  return (
    <main className="min-h-dvh bg-[#0b0b0d] px-6 py-16 font-satoshi text-gray-200 md:px-10 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <Link
          href="/#projects"
          className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          ← Back to projects
        </Link>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#202024] bg-[#131316]">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48rem"
          />
        </div>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h1 className="font-clashDisplay text-3xl font-medium text-white md:text-4xl">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-base leading-relaxed text-gray-300 md:text-lg">
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Live demo
                <FiExternalLink size={16} />
              </Link>
            )}
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-900"
              >
                Repository
                <SiGithub size={20} />
              </Link>
            )}
          </div>
        </div>

        {project.skills.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skillKey) => {
                const skillConfig = skillMap.get(skillKey);

                return (
                  <SkillCard
                    key={skillKey}
                    skill={skillConfig?.label ?? skillKey}
                    icon={getSkillIconNode(skillConfig?.iconKey ?? "")}
                    size="small"
                  />
                );
              })}
            </div>
          </div>
        )}

        {project.previewUrls.length > 0 && (
          <div>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
              Previews
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.previewUrls.map((url) => (
                <div
                  key={url}
                  className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#202024] bg-[#131316]"
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 24rem" />
                </div>
              ))}
            </div>
          </div>
        )}

        {safeHtml && (
          <div>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
              About this project
            </h2>
            <div
              className="project-long-desc text-left text-base leading-relaxed text-gray-200"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        )}

        {related.length > 0 && (
          <section className="border-t border-[#202024] pt-12">
            <h2 className="mb-6 text-center font-clashDisplay text-2xl font-medium text-white md:text-left">
              Related projects
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedProject) => (
                <ProjectCard
                  key={relatedProject.id}
                  slug={relatedProject.slug}
                  shortDescription={relatedProject.description ?? undefined}
                  image={relatedProject.imageUrl}
                  title={relatedProject.title}
                  liveLink={relatedProject.liveUrl ?? undefined}
                  repoLink={relatedProject.repoUrl ?? ""}
                  skills={relatedProject.skills.map((skill) => {
                    const skillConfig = skillMap.get(skill);

                    return (
                      <SkillCard
                        key={skill}
                        skill={skillConfig?.label ?? skill}
                        icon={getSkillIconNode(skillConfig?.iconKey ?? "")}
                        size="small"
                      />
                    );
                  })}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
