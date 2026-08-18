ALTER TABLE "contracts" ALTER COLUMN "start_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "start_date" SET DEFAULT now();