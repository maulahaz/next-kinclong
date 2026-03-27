ALTER TABLE "users" ALTER COLUMN "password_hash" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;