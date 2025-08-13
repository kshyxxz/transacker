CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"sub_type" text NOT NULL,
	"index" integer,
	"rate" real,
	"amount" real NOT NULL,
	"profit" real,
	"quantity" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
