ALTER TABLE "cars" ADD COLUMN "brand" varchar(50);--> statement-breakpoint
ALTER TABLE "cars" ADD COLUMN "model" varchar(50);--> statement-breakpoint
ALTER TABLE "cars" ADD COLUMN "color" varchar(50);--> statement-breakpoint
ALTER TABLE "cars" ADD COLUMN "notes" varchar(500);--> statement-breakpoint
ALTER TABLE "cars" ADD COLUMN "updated_at" timestamp DEFAULT now();