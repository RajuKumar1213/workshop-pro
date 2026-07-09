CREATE TABLE "product_master_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_master_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_masters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_masters_category_unique" UNIQUE("category")
);
--> statement-breakpoint
ALTER TABLE "product_master_images" ADD CONSTRAINT "product_master_images_product_master_id_product_masters_id_fk" FOREIGN KEY ("product_master_id") REFERENCES "public"."product_masters"("id") ON DELETE cascade ON UPDATE no action;