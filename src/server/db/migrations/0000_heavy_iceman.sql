DO $$ BEGIN
 CREATE TYPE "priority" AS ENUM('P1', 'P2', 'P3', 'P4');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "todo-list-prod_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_list" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_task" (
	"id" text PRIMARY KEY NOT NULL,
	"listId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"dueDate" timestamp,
	"isCompleted" boolean NOT NULL,
	"isImportant" boolean NOT NULL,
	"priority" "priority" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-list-prod_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "todo-list-prod_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "todo-list-prod_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "todo-list-prod_session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_account" ADD CONSTRAINT "todo-list-prod_account_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "todo-list-prod_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_session" ADD CONSTRAINT "todo-list-prod_session_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "todo-list-prod_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
