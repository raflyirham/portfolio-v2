import { asc, desc, eq } from "drizzle-orm";

import { projects } from "@/db/schema";
import { db } from "@/libs/db";
import { defaultProjects, toProjectView, type ProjectView } from "@/libs/project-data";

export async function getPublishedProjects(): Promise<ProjectView[]> {
  if (!db) {
    return defaultProjects;
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
    return defaultProjects;
  }

  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));

  return rows.map(toProjectView);
}

export async function getProjectById(id: string): Promise<ProjectView | null> {
  if (!db) {
    return defaultProjects.find((project) => project.id === id) ?? null;
  }

  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  return project ? toProjectView(project) : null;
}
