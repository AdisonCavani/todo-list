import { db } from "@server/db/sql";
import NextAuth, { type User } from "next-auth";
import Github, { type GitHubProfile } from "next-auth/providers/github";
import Google, { type GoogleProfile } from "next-auth/providers/google";
import { DrizzleAdapter } from "./drizzle-adapter";

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
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.image = user.image;
      }

      // Initial sign in
      if (account) {
        token.access_token = account.id_token!;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;

        return token;
      }

      // Not yet expired
      if (Date.now() < (token as any).expires_at * 1000) return token;

      return token; // See: https://github.com/nextauthjs/next-auth/issues/7025
    },
    session({ session, token }) {
      // TODO: refactor this
      const token2 = token as any;

      session.error = token2.error;

      if (token) {
        session.user.id = token2.id;
        session.user.firstName = token2.firstName;
        session.user.lastName = token2.lastName;
        session.user.email = token2.email;
        session.user.image = token2.image;
      }

      return session;
    },
  },
});
