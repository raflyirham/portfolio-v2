import {
  ExpressOriginal,
  LaravelOriginal,
  MongodbOriginal,
  NextjsOriginal,
  NodejsOriginal,
  PostgresqlOriginal,
  PrismaOriginal,
  PythonOriginal,
  ReactOriginal,
  TailwindcssOriginal,
  TypescriptOriginal,
} from "devicons-react";
import { asc } from "drizzle-orm";
import { createElement } from "react";

import { skills, type Skill } from "@/db/schema";
import { db } from "@/libs/db";

export interface SkillView {
  id: string;
  key: string;
  label: string;
  iconKey: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultSkills: Array<Pick<SkillView, "key" | "label" | "iconKey" | "sortOrder">> = [
  { key: "laravel", label: "Laravel", iconKey: "laravel", sortOrder: 0 },
  { key: "nextjs", label: "Next.js", iconKey: "nextjs", sortOrder: 1 },
  { key: "react", label: "React.js", iconKey: "react", sortOrder: 2 },
  { key: "tailwind", label: "Tailwind CSS", iconKey: "tailwind", sortOrder: 3 },
  { key: "typescript", label: "TypeScript", iconKey: "typescript", sortOrder: 4 },
  { key: "postgresql", label: "PostgreSQL", iconKey: "postgresql", sortOrder: 5 },
  { key: "prisma", label: "Prisma", iconKey: "prisma", sortOrder: 6 },
  { key: "nodejs", label: "Node.js", iconKey: "nodejs", sortOrder: 7 },
  { key: "express", label: "Express.js", iconKey: "express", sortOrder: 8 },
  { key: "mongodb", label: "MongoDB", iconKey: "mongodb", sortOrder: 9 },
  { key: "python", label: "Python", iconKey: "python", sortOrder: 10 },
];

export const iconOptions = [
  { key: "express", label: "Express.js" },
  { key: "laravel", label: "Laravel" },
  { key: "mongodb", label: "MongoDB" },
  { key: "nextjs", label: "Next.js" },
  { key: "nodejs", label: "Node.js" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "prisma", label: "Prisma" },
  { key: "python", label: "Python" },
  { key: "react", label: "React.js" },
  { key: "tailwind", label: "Tailwind CSS" },
  { key: "typescript", label: "TypeScript" },
] as const;

export const iconKeys = iconOptions.map(({ key }) => key);

const iconComponentMap = {
  express: ExpressOriginal,
  laravel: LaravelOriginal,
  mongodb: MongodbOriginal,
  nextjs: NextjsOriginal,
  nodejs: NodejsOriginal,
  postgresql: PostgresqlOriginal,
  prisma: PrismaOriginal,
  python: PythonOriginal,
  react: ReactOriginal,
  tailwind: TailwindcssOriginal,
  typescript: TypescriptOriginal,
} as const;

function toSkillView(skill: Skill): SkillView {
  return {
    id: skill.id,
    key: skill.key,
    label: skill.label,
    iconKey: skill.iconKey,
    sortOrder: skill.sortOrder,
    createdAt: skill.createdAt,
    updatedAt: skill.updatedAt,
  };
}

async function ensureDefaultSkillsSeeded() {
  if (!db) {
    return;
  }

  const existing = await db.select({ id: skills.id }).from(skills).limit(1);

  if (existing.length > 0) {
    return;
  }

  await db.insert(skills).values(defaultSkills);
}

export async function getSkills(): Promise<SkillView[]> {
  if (!db) {
    return defaultSkills.map((skill, index) => ({
      id: `default-${skill.key}`,
      key: skill.key,
      label: skill.label,
      iconKey: skill.iconKey,
      sortOrder: skill.sortOrder,
      createdAt: new Date(index),
      updatedAt: new Date(index),
    }));
  }

  await ensureDefaultSkillsSeeded();

  const rows = await db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.label));
  return rows.map(toSkillView);
}

export function getSkillIconNode(iconKey: string, size = 20) {
  const Icon = iconComponentMap[iconKey as keyof typeof iconComponentMap];
  if (!Icon) {
    return null;
  }

  return createElement(Icon, { size });
}
