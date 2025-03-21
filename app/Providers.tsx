"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import SessionProvider, { SessionUser } from "./SessionProvider";
import { Toaster } from "sonner";
import { Session as LuciaSession } from "lucia";

interface ProvidersProps {
  children: React.ReactNode;
  user: SessionUser | null;
  session: LuciaSession | null;
}

export default function Providers({ children, user, session }: ProvidersProps) {
  return (
    <SessionProvider value={{ user, session }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
