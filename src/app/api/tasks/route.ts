import { auth } from "@lib/auth";
import { updateTaskRequestValidator } from "@lib/types";
import { tasks, type TaskType } from "@server/db/schema";
import { db } from "@server/db/sql";
import { and, eq } from "drizzle-orm";
import { ZodError } from "zod";

async function PATCH(request: Request) {
  const session = await auth();

  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const task = updateTaskRequestValidator.parse(await request.json());

    await db
      .update(tasks)
      .set(task)
      .where(and(eq(tasks.id, task.id)));

    const response: TaskType = {
      ...task,
      description: task.description ?? null,
      dueDate: task.dueDate ?? null,
      isCompleted: task.isCompleted ?? false,
      isImportant: task.isImportant ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response(JSON.stringify(error.errors), {
        status: 400,
      });

    return new Response("Internal server error", { status: 500 });
  }
}

export { PATCH };
