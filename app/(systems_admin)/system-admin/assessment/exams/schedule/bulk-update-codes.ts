"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { z } from "zod";

// SAST is UTC+2
const SAST_OFFSET_HOURS = -2;

const updateSubjectDatesSchema = z.object({
  subjectCodes: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
  examDate: z.union([z.string().transform((val) => new Date(val)), z.date()]),
  startingTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
});

type UpdateSubjectDatesInput = z.infer<typeof updateSubjectDatesSchema>;

function localToUTC(date: Date): Date {
  const utcDate = new Date(date);
  utcDate.setHours(utcDate.getHours() - SAST_OFFSET_HOURS);
  return utcDate;
}

function utcToLocal(date: Date | null): Date | null {
  if (!date) return null;
  const localDate = new Date(date);
  localDate.setHours(localDate.getHours() + SAST_OFFSET_HOURS);
  return localDate;
}

export async function updateSubjectDates(
  input: UpdateSubjectDatesInput,
): Promise<{ success?: boolean; error?: string; updatedCount?: number }> {
  try {
    // Authentication and authorization
    const { user } = await validateRequest();
    if (!user) return { error: "Authentication required" };

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!userWithRole || userWithRole.role !== "SYSTEM_ADMINISTRATOR") {
      return { error: "Admin privileges required" };
    }

    const validatedData = updateSubjectDatesSchema.parse(input);

    // Parse time strings
    const [startHours, startMinutes] = validatedData.startingTime
      .split(":")
      .map(Number);
    const [dueHours, dueMinutes] = validatedData.dueTime.split(":").map(Number);

    // Create dates in local timezone (SAST)
    const examDateLocal = new Date(validatedData.examDate);
    examDateLocal.setHours(0, 0, 0, 0); // Set to midnight SAST

    const startingTimeLocal = new Date(examDateLocal);
    startingTimeLocal.setHours(startHours, startMinutes);

    const dueTimeLocal = new Date(examDateLocal);
    dueTimeLocal.setHours(dueHours, dueMinutes);

    // Validate same day
    if (
      startingTimeLocal.getDate() !== examDateLocal.getDate() ||
      dueTimeLocal.getDate() !== examDateLocal.getDate()
    ) {
      return { error: "Exam times must be on the same day as the exam date" };
    }

    // Validate school hours (8am-6pm SAST)
    if (startHours < 8 || startHours > 18 || dueHours < 8 || dueHours > 18) {
      return { error: "Exam times must be between 08:00 and 18:00 SAST" };
    }

    // Convert to UTC for storage
    const examDateUTC = localToUTC(examDateLocal);
    const startingTimeUTC = localToUTC(startingTimeLocal);
    const dueTimeUTC = localToUTC(dueTimeLocal);

    // Update database
    const updateResult = await prisma.subject.updateMany({
      where: {
        subjectCode: {
          in: validatedData.subjectCodes,
        },
      },
      data: {
        examDate: examDateUTC,
        startingTime: startingTimeUTC,
        dueTime: dueTimeUTC,
      },
    });

    return {
      success: true,
      updatedCount: updateResult.count,
    };
  } catch (error) {
    console.error("Update subject dates error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || "Invalid form data" };
    }
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getUniqueSubjectCodes(): Promise<{
  subjectCodes?: Array<{ code: string; title: string }>;
  error?: string;
}> {
  try {
    const { user } = await validateRequest();
    if (!user) return { error: "Authentication required" };

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!userWithRole || userWithRole.role !== "SYSTEM_ADMINISTRATOR") {
      return { error: "Admin privileges required" };
    }

    const subjects = await prisma.subject.findMany({
      distinct: ["subjectCode"],
      select: {
        subjectCode: true,
        title: true,
      },
      orderBy: {
        subjectCode: "asc",
      },
    });

    return {
      subjectCodes: subjects.map((subject) => ({
        code: subject.subjectCode,
        title: subject.title,
      })),
    };
  } catch (error) {
    console.error("Error fetching subject codes:", error);
    return { error: "Failed to fetch subject codes" };
  }
}

export async function getSubjectsWithMissingDates(): Promise<{
  subjects?: any[];
  error?: string;
}> {
  try {
    const { user } = await validateRequest();
    if (!user) return { error: "Authentication required" };

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!userWithRole || userWithRole.role !== "SYSTEM_ADMINISTRATOR") {
      return { error: "Admin privileges required" };
    }

    const subjects = await prisma.subject.findMany({
      where: {
        OR: [{ examDate: null }, { startingTime: null }, { dueTime: null }],
      },
      select: {
        id: true,
        title: true,
        subjectCode: true,
        examDate: true,
        startingTime: true,
        dueTime: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: {
        subjectCode: "asc",
      },
    });

    // Convert dates to local timezone for display
    const subjectsWithLocalDates = subjects.map((subject) => ({
      ...subject,
      examDate: utcToLocal(subject.examDate),
      startingTime: utcToLocal(subject.startingTime),
      dueTime: utcToLocal(subject.dueTime),
    }));

    return { subjects: subjectsWithLocalDates };
  } catch (error) {
    console.error("Error fetching subjects with missing dates:", error);
    return { error: "Failed to fetch subjects" };
  }
}

export async function getAllSubjectsWithDates(): Promise<{
  subjects?: any[];
  error?: string;
}> {
  try {
    const { user } = await validateRequest();
    if (!user) return { error: "Authentication required" };

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!userWithRole || userWithRole.role !== "SYSTEM_ADMINISTRATOR") {
      return { error: "Admin privileges required" };
    }

    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        title: true,
        subjectCode: true,
        examDate: true,
        startingTime: true,
        dueTime: true,
        isExamSubjectActive: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
      orderBy: [{ subjectCode: "asc" }, { examDate: "asc" }],
    });

    // Include both UTC and local dates
    const subjectsWithDates = subjects.map((subject) => ({
      ...subject,
      examDateUTC: subject.examDate,
      examDateLocal: utcToLocal(subject.examDate),
      startingTimeUTC: subject.startingTime,
      startingTimeLocal: utcToLocal(subject.startingTime),
      dueTimeUTC: subject.dueTime,
      dueTimeLocal: utcToLocal(subject.dueTime),
    }));

    return { subjects: subjectsWithDates };
  } catch (error) {
    console.error("Error fetching all subjects:", error);
    return { error: "Failed to fetch subjects" };
  }
}
