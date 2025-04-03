"use client";

import React, { createContext, useContext, useEffect } from "react";
import { Session as LuciaSession } from "lucia";

export type UserRole =
  | "USER"
  | "STUDENT"
  | "TEACHER"
  | "SCHOOL_ADMINISTRATOR"
  | "PRINCIPAL"
  | "PROVINCIAL_EDUCATION_OFFICIAL"
  | "NATIONAL_EDUCATION_DEPARTMENTOFFICIAL"
  | "EXAM_INVIGILATOR"
  | "SYSTEM_ADMINISTRATOR"
  | "TECHNICAL_SUPPORT_OFFICER"
  | "CONTENT_DEVELOPER"
  | "SECURITY_OFFICER"
  | "DATA_PROTECTION_OFFICER"
  | "QUALITY_ASSURANCE_OFFICER"
  | "EXAMINATION_BOARD_MEMBER"
  | "PARENT_GUARDIAN"
  | "SUPER_ADMINISTRATOR";

// Keep subjectCount as optional to match with User from validateRequest
export interface SessionUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  suburb: string | null;
  townCity: string;
  postcode: string;
  country: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  role: UserRole;
  subjectCount?: number; // Optional property
}

export interface SessionWithUser extends LuciaSession {
  user: SessionUser;
}

interface SessionContextValue {
  user: SessionUser | null;
  session: SessionWithUser | null;
}

// Define the props interface for SessionProvider
interface SessionProviderProps {
  children: React.ReactNode;
  value: {
    user: SessionUser | null;
    session: LuciaSession | null;
  };
}

const SessionContext = createContext<SessionContextValue | null>(null);

export default function SessionProvider({
  children,
  value,
}: SessionProviderProps) {
  // Debug log the incoming value
  useEffect(() => {
    console.log("[CLIENT] SessionProvider received user:", value.user);
    if (value.user) {
      console.log("[CLIENT] User subject count:", value.user.subjectCount);
    }
  }, [value]);

  // The user already has the subjectCount property because we added it directly
  // in the CustomerLayout component, so we don't need to modify it here
  const sessionValue: SessionContextValue = {
    user: value.user,
    session: value.session
      ? {
          ...value.session,
          user: value.user!,
        }
      : null,
  };

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
