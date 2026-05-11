"use server";

import { and, eq, max, ne } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projects } from "@/db/schema";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { sanitizeProjectLongDescriptionHtml } from "@/libs/project-html";
import { uploadProjectImage, uploadProjectPreviewImage } from "@/libs/r2";
import { getSkills } from "@/libs/skills";
import { MAX_PROJECT_PREVIEWS, projectFormSchema } from "@/schemas/project";

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
    longDescriptionHtml: getFormValue(formData, "longDescriptionHtml"),
    previewUrlsRetained: getFormValue(formData, "previewUrlsRetained"),
    imageUrl: getFormValue(formData, "imageUrl"),
    repoUrl: getFormValue(formData, "repoUrl"),
    liveUrl: getFormValue(formData, "liveUrl"),
    skills: formData.getAll("skills").map(String),
    isPublished: formData.get("isPublished") === "on",
  });
}

function getProjectImage(formData: FormData) {
  const image = formData.get("image");

  return image instanceof File ? image : null;
}

function getPreviewImageFiles(formData: FormData): File[] {
  const items = formData.getAll("previewImages");

  return items.filter((item): item is File => item instanceof File && item.size > 0);
}

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

function normalizeProjectMutationError(error: unknown): Error {
  if (error instanceof Error) {
    if (error.message === "Image must be 4MB or smaller.") {
      return new Error(
        "Image upload failed: each image must be 4MB or smaller. Please resize or compress the image and try again."
      );
    }

    if (error.message === "Image must be a JPG, PNG, or WebP file.") {
      return new Error("Image upload failed: only JPG, PNG, or WebP files are allowed.");
    }

    return error;
  }

  return new Error("Something went wrong while saving the project. Please try again.");
}

async function buildPreviewUrlList(
  formData: FormData,
  retainedUrls: string[]
): Promise<string[]> {
  const files = getPreviewImageFiles(formData);
  const uploaded: string[] = [];

  for (const file of files) {
    if (retainedUrls.length + uploaded.length >= MAX_PROJECT_PREVIEWS) {
      break;
    }

    const result = await uploadProjectPreviewImage(file);

    if (result) {
      uploaded.push(result.url);
    }
  }

  return [...retainedUrls, ...uploaded].slice(0, MAX_PROJECT_PREVIEWS);
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

async function assertValidSkills(selectedSkills: string[]) {
  const availableSkills = await getSkills();
  const skillSet = new Set(availableSkills.map((skill) => skill.key));
  const invalidSkill = selectedSkills.find((skill) => !skillSet.has(skill));

  if (invalidSkill) {
    throw new Error(`Unknown skill key: ${invalidSkill}`);
  }
}

async function nextProjectSortOrder(): Promise<number> {
  if (!db) {
    return 0;
  }

  const [row] = await db.select({ maxOrder: max(projects.sortOrder) }).from(projects);

  return (row?.maxOrder ?? -1) + 1;
}

function revalidateProjectPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

export async function createProject(formData: FormData) {
  try {
    await requireAdmin();

    if (!db) {
      throw new Error("Database is not configured.");
    }

    const input = getProjectInput(formData);
    await assertValidSkills(input.skills);
    const uploadedImage = await uploadProjectImage(getProjectImage(formData) ?? new File([], ""));
    const imageUrl = uploadedImage?.url ?? input.imageUrl;

    if (!imageUrl) {
      throw new Error("Add a thumbnail URL or upload a thumbnail image.");
    }

    await assertSlugAvailable(input.slug);

    const longDescriptionHtml = sanitizeProjectLongDescriptionHtml(input.longDescriptionHtml);
    const previewUrls = await buildPreviewUrlList(formData, input.previewUrlsRetained);
    const sortOrder = await nextProjectSortOrder();

    await db.insert(projects).values({
      title: input.title,
      slug: input.slug,
      description: input.description,
      longDescriptionHtml,
      previewUrls,
      imageKey: uploadedImage?.key ?? null,
      imageUrl,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
      skills: input.skills,
      sortOrder,
      isPublished: input.isPublished,
    });

    revalidateProjectPaths(input.slug);
    redirect("/admin");
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    throw normalizeProjectMutationError(error);
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requireAdmin();

    if (!db) {
      throw new Error("Database is not configured.");
    }

    const [existing] = await db.select().from(projects).where(eq(projects.id, id));

    if (!existing) {
      throw new Error("Project not found.");
    }

    const input = getProjectInput(formData);
    await assertValidSkills(input.skills);
    const uploadedImage = await uploadProjectImage(getProjectImage(formData) ?? new File([], ""));
    const imageUrl = uploadedImage?.url ?? input.imageUrl;

    if (!imageUrl) {
      throw new Error("Add a thumbnail URL or upload a thumbnail image.");
    }

    await assertSlugAvailable(input.slug, id);

    const longDescriptionHtml = sanitizeProjectLongDescriptionHtml(input.longDescriptionHtml);
    const previewUrls = await buildPreviewUrlList(formData, input.previewUrlsRetained);

    await db
      .update(projects)
      .set({
        title: input.title,
        slug: input.slug,
        description: input.description,
        longDescriptionHtml,
        previewUrls,
        imageKey: uploadedImage ? uploadedImage.key : existing.imageKey,
        imageUrl,
        repoUrl: input.repoUrl,
        liveUrl: input.liveUrl,
        skills: input.skills,
        sortOrder: existing.sortOrder,
        isPublished: input.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));

    if (existing.slug !== input.slug) {
      revalidatePath(`/projects/${existing.slug}`);
    }

    revalidateProjectPaths(input.slug);
    redirect("/admin");
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    throw normalizeProjectMutationError(error);
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const [row] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.id, id));

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/projects");

  if (row) {
    revalidatePath(`/projects/${row.slug}`);
  }
}

export async function toggleProjectPublished(id: string, isPublished: boolean) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const [row] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.id, id));

  await db
    .update(projects)
    .set({
      isPublished: !isPublished,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/projects");

  if (row) {
    revalidatePath(`/projects/${row.slug}`);
  }
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  if (!orderedIds.length) {
    return;
  }

  const updatedAt = new Date();

  for (let index = 0; index < orderedIds.length; index++) {
    const projectId = orderedIds[index];

    if (!projectId) {
      continue;
    }

    await db
      .update(projects)
      .set({
        sortOrder: index,
        updatedAt,
      })
      .where(eq(projects.id, projectId));
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
