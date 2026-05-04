import { z } from "zod";

import { iconKeys } from "@/libs/skills";

export const skillFormSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Key is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens"
    ),
  label: z.string().trim().min(1, "Label is required"),
  iconKey: z.enum(iconKeys as [string, ...string[]]),
  sortOrder: z.coerce.number().int().min(0),
});

export type SkillFormSchema = z.infer<typeof skillFormSchema>;
