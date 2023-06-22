import NextAuth from "next-auth";
import CognitoProvider, { CognitoProfile } from "next-auth/providers/cognito";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth",
  },

  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

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
      if (Date.now() < (token as any).expires_at * 1000) return token;

      // TODO: refresh token
      return token;
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
        session.user.access_token = token2.access_token;
      }

      return session;
    },
  },
});
