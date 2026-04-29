CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "description" text,
  "image_key" text,
  "image_url" text NOT NULL,
  "repo_url" text,
  "live_url" text,
  "skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);

CREATE INDEX IF NOT EXISTS "projects_published_sort_order_idx"
  ON "projects" ("is_published", "sort_order");
