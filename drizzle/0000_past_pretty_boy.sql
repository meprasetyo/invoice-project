-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "module" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_name" varchar(255),
	"is_installed" smallint DEFAULT 0,
	"uri_path" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp,
	"is_deleted" smallint DEFAULT 0,
	"deleted_at" timestamp
);

*/