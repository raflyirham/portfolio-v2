"use server";

import { and, eq, ne } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projects } from "@/db/schema";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { uploadProjectImage } from "@/libs/r2";
import { projectFormSchema } from "@/schemas/project";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user.isAdmin) {
    throw new Error("Unauthorized");
  }
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getProjectInput(formData: FormData) {
  return projectFormSchema.parse({
    title: getFormValue(formData, "title"),
    slug: getFormValue(formData, "slug"),
    description: getFormValue(formData, "description"),
    imageUrl: getFormValue(formData, "imageUrl"),
    repoUrl: getFormValue(formData, "repoUrl"),
    liveUrl: getFormValue(formData, "liveUrl"),
    skills: formData.getAll("skills").map(String),
    sortOrder: getFormValue(formData, "sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
}

function getProjectImage(formData: FormData) {
  const image = formData.get("image");

  return image instanceof File ? image : null;
}

async function assertSlugAvailable(slug: string, currentProjectId?: string) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const [existingProject] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      currentProjectId
        ? and(eq(projects.slug, slug), ne(projects.id, currentProjectId))
        : eq(projects.slug, slug)
    );

  if (existingProject) {
    throw new Error("Project slug already exists.");
  }
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const input = getProjectInput(formData);
  const uploadedImage = await uploadProjectImage(getProjectImage(formData) ?? new File([], ""));
  const imageUrl = uploadedImage?.url ?? input.imageUrl;

  if (!imageUrl) {
    throw new Error("Add an image URL or upload an image.");
  }

  await assertSlugAvailable(input.slug);

  await db.insert(projects).values({
    title: input.title,
    slug: input.slug,
    description: input.description,
    imageKey: uploadedImage?.key,
    imageUrl,
    repoUrl: input.repoUrl,
    liveUrl: input.liveUrl,
    skills: input.skills,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const input = getProjectInput(formData);
  const uploadedImage = await uploadProjectImage(getProjectImage(formData) ?? new File([], ""));
  const imageUrl = uploadedImage?.url ?? input.imageUrl;

  if (!imageUrl) {
    throw new Error("Add an image URL or upload an image.");
  }

  await assertSlugAvailable(input.slug, id);

  await db
    .update(projects)
    .set({
      title: input.title,
      slug: input.slug,
      description: input.description,
      imageKey: uploadedImage?.key,
      imageUrl,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
      skills: input.skills,
      sortOrder: input.sortOrder,
      isPublished: input.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProject(id: string) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleProjectPublished(id: string, isPublished: boolean) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  await db
    .update(projects)
    .set({
      isPublished: !isPublished,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
}
