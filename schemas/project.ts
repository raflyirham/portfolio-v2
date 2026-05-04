import { z } from "zod";

export const MAX_PROJECT_PREVIEWS = 12;

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(z.string().url().nullable());

function parsePreviewUrlsRetained(raw: string | undefined): string[] {
  const text = raw?.trim() ? raw.trim() : "[]";

  try {
    const parsed: unknown = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const urls: string[] = [];

    for (const item of parsed) {
      if (typeof item !== "string") {
        continue;
      }

      const check = z.string().url().safeParse(item);

      if (check.success) {
        urls.push(check.data);
      }

      if (urls.length >= MAX_PROJECT_PREVIEWS) {
        break;
      }
    }

    return urls;
  } catch {
    return [];
  }
}

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
  longDescriptionHtml: z
    .string()
    .max(100_000)
    .optional()
    .transform((value) => (value?.trim() ? value : null)),
  previewUrlsRetained: z
    .string()
    .optional()
    .transform((raw) => parsePreviewUrlsRetained(raw)),
  imageUrl: optionalUrlSchema,
  repoUrl: optionalUrlSchema,
  liveUrl: optionalUrlSchema,
  skills: z.array(z.string().trim().min(1)).min(1, "Select at least one skill"),
  isPublished: z.coerce.boolean(),
});

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
