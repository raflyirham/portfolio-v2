import { and, asc, desc, eq } from "drizzle-orm";

import { projects } from "@/db/schema";
import { db } from "@/libs/db";
import { toProjectView, type ProjectView } from "@/libs/project-data";

export async function getPublishedProjects(): Promise<ProjectView[]> {
  if (!db) {
    return [];
  }

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.isPublished, true))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));

  return rows.map(toProjectView);
}

export async function getAdminProjects(): Promise<ProjectView[]> {
  if (!db) {
    return [];
  }

  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));

  return rows.map(toProjectView);
}

export async function getProjectById(id: string): Promise<ProjectView | null> {
  if (!db) {
    return null;
  }

  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  return project ? toProjectView(project) : null;
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectView | null> {
  if (!db) {
    return null;
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)));

  return project ? toProjectView(project) : null;
}

export async function getRelatedProjects(slug: string, limit = 3): Promise<ProjectView[]> {
  const published = await getPublishedProjects();
  const current = published.find((p) => p.slug === slug);

  if (!current) {
    return [];
  }

  const currentSkillSet = new Set(current.skills);
  const others = published.filter((p) => p.slug !== slug);

  const scored = others.map((project) => {
    let score = 0;

    for (const key of project.skills) {
      if (currentSkillSet.has(key)) {
        score += 1;
      }
    }

    return { project, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (a.project.sortOrder !== b.project.sortOrder) {
      return a.project.sortOrder - b.project.sortOrder;
    }

    return b.project.createdAt.getTime() - a.project.createdAt.getTime();
  });

  return scored.slice(0, limit).map((entry) => entry.project);
}
