ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "has_business" boolean DEFAULT false NOT NULL;