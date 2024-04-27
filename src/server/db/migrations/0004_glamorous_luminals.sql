ALTER TABLE "todo-list-prod_account" DROP CONSTRAINT "todo-list-prod_account_userId_todo-list-prod_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-list-prod_session" DROP CONSTRAINT "todo-list-prod_session_userId_todo-list-prod_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-list-prod_task" DROP CONSTRAINT "todo-list-prod_task_listId_todo-list-prod_list_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-list-prod_user" ALTER COLUMN "emailVerified" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_account" ADD CONSTRAINT "todo-list-prod_account_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "todo-list-prod_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_session" ADD CONSTRAINT "todo-list-prod_session_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "todo-list-prod_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_task" ADD CONSTRAINT "todo-list-prod_task_listId_todo-list-prod_list_id_fk" FOREIGN KEY ("listId") REFERENCES "todo-list-prod_list"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
