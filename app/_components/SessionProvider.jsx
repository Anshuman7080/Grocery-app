"use client";

import { SessionProvider as AuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}