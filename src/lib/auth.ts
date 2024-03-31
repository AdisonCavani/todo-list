import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createTable } from "@server/db/schema";
import { db } from "@server/db/sql";
import NextAuth, { type User } from "next-auth";
import Github, { type GitHubProfile } from "next-auth/providers/github";
import Google, { type GoogleProfile } from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth",
  },

  adapter: DrizzleAdapter(db, createTable),
  session: {
    strategy: "jwt",
  },

  providers: [
    Github({
      profile(profile: GitHubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    Google({
      profile(profile: GoogleProfile): User {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`.trim(),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
});
