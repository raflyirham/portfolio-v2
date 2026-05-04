CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"icon_key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX "skills_label_idx" ON "skills" USING btree ("label");--> statement-breakpoint
CREATE INDEX "skills_sort_order_idx" ON "skills" USING btree ("sort_order");