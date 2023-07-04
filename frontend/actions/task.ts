"use server";

import { tasks, type TaskType } from "@db/schema";
import { db } from "@db/sql";
import { authOptions } from "@lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";

async function createTaskAction(
  title: string,
  dueDate: Date | null,
  priority: "P1" | "P2" | "P3" | "P4"
) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Unauthorized");

  await db.insert(tasks).values({
    id: v4(),
    title: title,
    dueDate: dueDate,
    isCompleted: false,
    isImportant: false,
    priority: priority,
    userId: session.user.id,
  });

  revalidatePath("/app");
}

async function toggleTaskCompletionAction({
  id,
  userId,
  isCompleted,
}: TaskType) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Unauthorized");

  if (userId !== session.user.id)
    throw new Error("Unauthorized - action not allowed");

  await db
    .update(tasks)
    .set({
      isCompleted: !isCompleted,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/app");
}

async function toggleTaskImportanceAction({
  id,
  userId,
  isImportant,
}: TaskType) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Unauthorized");

  if (userId !== session.user.id)
    throw new Error("Unauthorized - action not allowed");

  await db
    .update(tasks)
    .set({
      isImportant: !isImportant,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/app");
}

async function updateTaskAction(task: TaskType) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Unauthorized");

  if (task.userId !== session.user.id)
    throw new Error("Unauthorized - action not allowed");

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
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Unauthorized");

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

  revalidatePath("/app");
}

export {
  createTaskAction,
  toggleTaskCompletionAction,
  toggleTaskImportanceAction,
  updateTaskAction,
  deleteTaskAction,
};
