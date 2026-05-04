import type { Project } from "@/db/schema";

export interface ProjectView {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  longDescriptionHtml: string | null;
  previewUrls: string[];
  imageKey: string | null;
  imageUrl: string;
  repoUrl: string | null;
  liveUrl: string | null;
  skills: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toProjectView = (project: Project): ProjectView => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  description: project.description,
  longDescriptionHtml: project.longDescriptionHtml,
  previewUrls: project.previewUrls ?? [],
  imageKey: project.imageKey,
  imageUrl: project.imageUrl,
  repoUrl: project.repoUrl,
  liveUrl: project.liveUrl,
  skills: project.skills,
  sortOrder: project.sortOrder,
  isPublished: project.isPublished,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});
