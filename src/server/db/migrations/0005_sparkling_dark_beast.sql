DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('Github', 'Google');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "todo-list-prod_verificationToken";--> statement-breakpoint
ALTER TABLE "todo-list-prod_list" DROP CONSTRAINT "todo-list-prod_list_userId_todo-list-prod_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP CONSTRAINT "undefined";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" ALTER COLUMN "provider" SET DATA TYPE provider;--> statement-breakpoint
ALTER TABLE "todo-list-prod_user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" ADD CONSTRAINT "todo-list-prod_account_providerAccountId_provider_pk" PRIMARY KEY("providerAccountId","provider");--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" ADD COLUMN "id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" ADD COLUMN "expiresAt" timestamp with time zone NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_list" ADD CONSTRAINT "todo-list-prod_list_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."todo-list-prod_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "refresh_token";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "access_token";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "token_type";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "scope";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "id_token";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "session_state";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "todo-list-prod_account" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" DROP COLUMN IF EXISTS "sessionToken";--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" DROP COLUMN IF EXISTS "expires";--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "todo-list-prod_user" DROP COLUMN IF EXISTS "emailVerified";--> statement-breakpoint
ALTER TABLE "todo-list-prod_user" DROP COLUMN IF EXISTS "image";