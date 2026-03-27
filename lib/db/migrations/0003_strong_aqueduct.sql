ALTER TYPE "public"."role" ADD VALUE 'unverified';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'unverified';