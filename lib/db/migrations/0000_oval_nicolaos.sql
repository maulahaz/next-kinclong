CREATE TYPE "public"."car_type" AS ENUM('small', 'big');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'staff', 'customer');--> statement-breakpoint
CREATE TYPE "public"."wash_status" AS ENUM('pending', 'done', 'acknowledged');--> statement-breakpoint
CREATE TYPE "public"."wash_type" AS ENUM('inside', 'outside');--> statement-breakpoint
CREATE TABLE "cars" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"type" "car_type" NOT NULL,
	"plate_number" varchar(50) NOT NULL,
	"image_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"car_id" integer NOT NULL,
	"package_id" integer,
	"package_type" varchar(100) NOT NULL,
	"total_washes" integer NOT NULL,
	"completed_washes" integer DEFAULT 0 NOT NULL,
	"status" "contract_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"address" varchar(500),
	"points" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"image_url" varchar(500),
	"id_card_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(500),
	"duration" integer NOT NULL,
	"price" integer NOT NULL,
	"includes" json NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_name" varchar(255) DEFAULT 'Kinclong' NOT NULL,
	"company_name" varchar(255) DEFAULT 'Kinclong Car Wash' NOT NULL,
	"company_logo" varchar(500),
	"company_icon" varchar(500),
	"company_address" varchar(500),
	"phone" varchar(50),
	"email" varchar(255),
	"currency" varchar(10) DEFAULT 'IDR' NOT NULL,
	"timezone" varchar(50) DEFAULT 'Asia/Jakarta' NOT NULL,
	"social_media" json,
	"others" json,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"phone" varchar(50) NOT NULL,
	"address" varchar(500),
	"position" varchar(100),
	"salary" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"image_url" varchar(500),
	"id_card_url" varchar(500),
	"hire_date" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"password_hash" varchar(255) DEFAULT 'pass-123',
	"role" "role" DEFAULT 'customer' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "washes" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract_id" integer NOT NULL,
	"type" "wash_type" NOT NULL,
	"status" "wash_status" DEFAULT 'pending' NOT NULL,
	"image_url" varchar(500),
	"completed_by" integer,
	"acknowledged_by_customer" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washes" ADD CONSTRAINT "washes_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washes" ADD CONSTRAINT "washes_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;