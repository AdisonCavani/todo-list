import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "@auth/core/types" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    access_token: string;
  }

  interface Session {
    user: User;
    error?: "RefreshAccessTokenError";
  }
}
