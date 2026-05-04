ALTER TABLE "projects" ADD COLUMN "long_description_html" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "preview_urls" jsonb DEFAULT '[]'::jsonb NOT NULL;