import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users, type UserType } from "@server/db/schema";
import { db } from "@server/db/sql";
import { Lucia } from "lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<UserType, "id">;
  }
}

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    // This sets cookies with super long expiration
    // Since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
    };
  },
});

export default lucia;
