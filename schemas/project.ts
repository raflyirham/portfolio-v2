import { z } from "zod";

import { projectSkillKeys } from "@/libs/project-data";

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(z.string().url().nullable());

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
  imageUrl: optionalUrlSchema,
  repoUrl: optionalUrlSchema,
  liveUrl: optionalUrlSchema,
  skills: z
    .array(z.enum(projectSkillKeys as [string, ...string[]]))
    .min(1, "Select at least one skill"),
  sortOrder: z.coerce.number().int().min(0),
  isPublished: z.coerce.boolean(),
});

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
