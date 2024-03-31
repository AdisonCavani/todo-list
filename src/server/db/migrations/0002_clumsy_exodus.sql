ALTER TABLE "todo-list-prod_accounts" RENAME COLUMN "expires_in" TO "expires_at";--> statement-breakpoint
DROP INDEX IF EXISTS "accounts__provider__providerAccountId__idx";--> statement-breakpoint
DROP INDEX IF EXISTS "accounts__userId__idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sessions__sessionToken__idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sessions__userId__idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users__email__idx";--> statement-breakpoint
DROP INDEX IF EXISTS "verification_tokens__token__idx";--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "provider_account_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ALTER COLUMN "token_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_lists" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_lists" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_sessions" ADD PRIMARY KEY ("session_token");--> statement-breakpoint
ALTER TABLE "todo-list-prod_sessions" ALTER COLUMN "session_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_tasks" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_tasks" ALTER COLUMN "list_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_users" ALTER COLUMN "first_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_users" ALTER COLUMN "last_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_users" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'todo-list-prod_verification_tokens'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "todo-list-prod_verification_tokens" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "todo-list-prod_verification_tokens" ALTER COLUMN "identifier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_verification_tokens" ALTER COLUMN "token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ADD CONSTRAINT "todo-list-prod_accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "todo-list-prod_verification_tokens" ADD CONSTRAINT "todo-list-prod_verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" ADD COLUMN "session_state" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_accounts" ADD CONSTRAINT "todo-list-prod_accounts_user_id_todo-list-prod_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo-list-prod_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_sessions" ADD CONSTRAINT "todo-list-prod_sessions_user_id_todo-list-prod_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo-list-prod_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "todo-list-prod_accounts" DROP COLUMN IF EXISTS "refresh_token_expires_in";--> statement-breakpoint
ALTER TABLE "todo-list-prod_sessions" DROP COLUMN IF EXISTS "id";