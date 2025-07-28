CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user_id" uuid NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memo_tags" (
	"memo_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"category_id" uuid,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_user_id_idx" ON "categories" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_name_idx" ON "categories" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memo_tags_memo_id_idx" ON "memo_tags" ("memo_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memo_tags_tag_id_idx" ON "memo_tags" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memo_tags_unique_idx" ON "memo_tags" ("memo_id","tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memos_user_id_idx" ON "memos" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memos_category_id_idx" ON "memos" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memos_title_idx" ON "memos" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memos_created_at_idx" ON "memos" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memos_archived_idx" ON "memos" ("is_archived");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_user_id_idx" ON "tags" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_name_idx" ON "tags" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memo_tags" ADD CONSTRAINT "memo_tags_memo_id_memos_id_fk" FOREIGN KEY ("memo_id") REFERENCES "memos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memo_tags" ADD CONSTRAINT "memo_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memos" ADD CONSTRAINT "memos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memos" ADD CONSTRAINT "memos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
