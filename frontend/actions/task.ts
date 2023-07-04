"use server";

import { tasks, type TaskType } from "@db/schema";
import { db } from "@db/sql";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";

async function createTaskAction(
  title: string,
  dueDate: Date | null,
  priority: "P1" | "P2" | "P3" | "P4"
) {
  await db.insert(tasks).values({
    id: v4(),
    title: title,
    dueDate: dueDate,
    isCompleted: false,
    isImportant: false,
    priority: priority,
    userId: "1234",
  });

  revalidatePath("/app");
}

async function toggleTaskCompletionAction({ id, isCompleted }: TaskType) {
  await db
    .update(tasks)
    .set({
      isCompleted: !isCompleted,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/app");
}

async function toggleTaskImportanceAction({ id, isImportant }: TaskType) {
  await db
    .update(tasks)
    .set({
      isImportant: !isImportant,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/app");
}

async function updateTaskAction(task: TaskType) {
  const { title, description, dueDate, priority } = task;

  await db
    .update(tasks)
    .set({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
    })
    .where(eq(tasks.id, task.id));

  revalidatePath("/app");
}

async function deleteTaskAction(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));

  revalidatePath("/app");
}

export {
  createTaskAction,
  toggleTaskCompletionAction,
  toggleTaskImportanceAction,
  updateTaskAction,
  deleteTaskAction,
};
