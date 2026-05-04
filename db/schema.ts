import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    longDescriptionHtml: text("long_description_html"),
    previewUrls: jsonb("preview_urls")
      .$type<string[]>()
      .notNull()
      .default([]),
    imageKey: text("image_key"),
    imageUrl: text("image_url").notNull(),
    repoUrl: text("repo_url"),
    liveUrl: text("live_url"),
    skills: jsonb("skills").$type<string[]>().notNull().default([]),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    publishedSortOrderIdx: index("projects_published_sort_order_idx").on(
      table.isPublished,
      table.sortOrder
    ),
  })
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull().unique(),
    label: text("label").notNull(),
    iconKey: text("icon_key").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    labelIdx: index("skills_label_idx").on(table.label),
    sortOrderIdx: index("skills_sort_order_idx").on(table.sortOrder),
  })
);

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
