"use client";

import type { auth } from "@lib/auth";
import { createContext, type PropsWithChildren } from "react";

type AuthData = Awaited<ReturnType<typeof auth>>;

export const AuthContext = createContext<AuthData>({
  session: null,
  user: null,
});

function AuthProvider({ children, ...props }: PropsWithChildren<AuthData>) {
  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
