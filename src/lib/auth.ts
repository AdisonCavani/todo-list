import { db } from "@server/db/sql";
import NextAuth, { type DefaultSession, type User } from "next-auth";
import Github, { type GitHubProfile } from "next-auth/providers/github";
import Google, { type GoogleProfile } from "next-auth/providers/google";
import { DrizzleAdapter } from "./drizzle-adapter";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
  }

  interface User {
    firstName: string;
    lastName: string;
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

  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },

  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,

      profile(profile: GitHubProfile) {
        return {
          id: profile.id.toString(),
          firstName: profile.name!.split(" ")[0]!,
          lastName: profile.name!.split(" ")[1]!,
          email: profile.email!,
          image: profile.avatar_url,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,

      profile(profile: GoogleProfile): User {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name!,
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
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.image = user.image;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
});
