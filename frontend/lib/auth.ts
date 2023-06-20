// @ts-nocheck
import NextAuth from "next-auth";
import Cognito, { CognitoProfile } from "next-auth/providers/cognito";
import Google, { GoogleProfile } from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/auth",
  },

  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,

      profile(profile: CognitoProfile) {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          access_token: profile.access_token,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,

      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
          access_token: profile.id_token,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }

      // Initial sign in
      if (account) {
        token.access_token = account.id_token!;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;

        return token;
      }

      // Not yet expired
      if (Date.now() < token.expires_at * 1000) return token;

      return token; // See: https://github.com/nextauthjs/next-auth/issues/7025

      // Expired, try to update
      // return await refreshAccessToken(token);
    },
    session({ session, token }) {
      session.error = token.error;

      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.access_token = token.access_token;
      }

      return session;
    },
  },
});
