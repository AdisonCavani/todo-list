import { users } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "@auth/core/adapters" {
  interface AdapterUser extends InferSelectModel<typeof users> {
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  interface Session {
    user: User;
    error?: "RefreshAccessTokenError";
  }
}
