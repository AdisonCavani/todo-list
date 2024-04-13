import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const tablePrefix = process.env.NODE_ENV === "production" ? "prod" : "dev2";
export const createTable = pgTableCreator(
  (name) => `todo-list-${tablePrefix}_${name}`,
);

export const taskPriorityEnum = pgEnum("priority", ["P1", "P2", "P3", "P4"]);

export const tasks = createTable(
  "task",
  {
    id: text("id").primaryKey().notNull(),
    listId: text("listId")
      .references(() => lists.id)
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: timestamp("dueDate"),
    isCompleted: boolean("isCompleted").notNull(),
    isImportant: boolean("isImportant").notNull(),
    priority: taskPriorityEnum("priority").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (task) => ({
    listIdIdx: index("task_listId_idx").on(task.listId),
  }),
);

export const tasksRelations = relations(tasks, ({ one }) => ({
  list: one(lists, { fields: [tasks.listId], references: [lists.id] }),
}));

export type TaskType = InferSelectModel<typeof tasks>;

export const lists = createTable(
  "list",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (list) => ({
    userIdIdx: index("list_userId_idx").on(list.userId),
  }),
);

export const listsRelations = relations(lists, ({ one }) => ({
  user: one(users, { fields: [lists.userId], references: [users.id] }),
}));

export type ListType = InferSelectModel<typeof lists>;

export const users = createTable("user", {
  id: text("id").primaryKey(),
});

export type UserType = InferSelectModel<typeof users>;

export const sessions = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
