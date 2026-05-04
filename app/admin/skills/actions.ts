"use server";

import { and, eq, ne, or } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { skills } from "@/db/schema";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { skillFormSchema } from "@/schemas/skill";

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

function getSkillInput(formData: FormData) {
  return skillFormSchema.parse({
    key: getFormValue(formData, "key"),
    label: getFormValue(formData, "label"),
    iconKey: getFormValue(formData, "iconKey"),
    sortOrder: getFormValue(formData, "sortOrder"),
  });
}

async function assertSkillUnique(inputKey: string, inputLabel: string, currentId?: string) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const [conflict] = await db
    .select({ id: skills.id, key: skills.key, label: skills.label })
    .from(skills)
    .where(
      currentId
        ? and(ne(skills.id, currentId), or(eq(skills.key, inputKey), eq(skills.label, inputLabel)))
        : or(eq(skills.key, inputKey), eq(skills.label, inputLabel))
    );

  if (conflict) {
    throw new Error("Skill key and label must be unique.");
  }
}

export async function createSkill(formData: FormData) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const input = getSkillInput(formData);
  await assertSkillUnique(input.key, input.label);

  await db.insert(skills).values({
    key: input.key,
    label: input.label,
    iconKey: input.iconKey,
    sortOrder: input.sortOrder,
  });

  revalidatePath("/admin/skills");
  revalidatePath("/admin/projects/new");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  const input = getSkillInput(formData);
  await assertSkillUnique(input.key, input.label, id);

  await db
    .update(skills)
    .set({
      key: input.key,
      label: input.label,
      iconKey: input.iconKey,
      sortOrder: input.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, id));

  revalidatePath("/admin/skills");
  revalidatePath("/admin/projects/new");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  if (!db) {
    throw new Error("Database is not configured.");
  }

  await db.delete(skills).where(eq(skills.id, id));

  revalidatePath("/admin/skills");
  revalidatePath("/admin/projects/new");
  revalidatePath("/admin");
  revalidatePath("/");
}
