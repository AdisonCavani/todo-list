import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";

const tablePrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";
export const createTable = pgTableCreator(
  (name) => `todo-list-${tablePrefix}_${name}`,
);

const taskPriorityEnum = pgEnum("priority", ["P1", "P2", "P3", "P4"]);
const taskPriorityEnumSchema = z.enum(taskPriorityEnum.enumValues)._type;
export type TaskPriorityEnum = typeof taskPriorityEnumSchema;

export const tasks = createTable(
  "task",
  {
    id: text("id").primaryKey().notNull(),
    listId: text("listId")
      .references(() => lists.id, { onDelete: "cascade" })
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
      .references(() => users.id, { onDelete: "cascade" })
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
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export type UserType = InferSelectModel<typeof users>;

export const sessions = createTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expiresAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const providerEnum = pgEnum("provider", ["Github", "Google"]);

export const accounts = createTable(
  "account",
  {
    providerAccountId: text("providerAccountId").notNull(),
    provider: providerEnum("provider").notNull(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (account) => ({
    id: primaryKey({ columns: [account.providerAccountId, account.provider] }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
