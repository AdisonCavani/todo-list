CREATE INDEX IF NOT EXISTS "list_userId_idx" ON "todo-list-prod_list" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_listId_idx" ON "todo-list-prod_task" ("listId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_list" ADD CONSTRAINT "todo-list-prod_list_userId_todo-list-prod_user_id_fk" FOREIGN KEY ("userId") REFERENCES "todo-list-prod_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-list-prod_task" ADD CONSTRAINT "todo-list-prod_task_listId_todo-list-prod_list_id_fk" FOREIGN KEY ("listId") REFERENCES "todo-list-prod_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
