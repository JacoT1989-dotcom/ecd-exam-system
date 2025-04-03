"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";

// Define all subject codes as a union type
export type SubjectCode =
  | "MATH101"
  | "PHYS101"
  | "LIFE101"
  | "GEOG101"
  | "HIST101"
  | "ENHL101"
  | "AFAL101"
  | "ECON101"
  | "BUSS101"
  | "ACCO101"
  | "CAT101"
  | "IT101"
  | "TOUR101"
  | "CONS101"
  | "AGRI101"
  | "VART101"
  | "MUSI101"
  | "DRAM101"
  | "SEHL101"
  | "ZUHL101";

// Type for the subject code and title
export interface SubjectCodeInfo {
  code: SubjectCode;
  title: string;
}

// Type for bulk updating exam dates and times
export interface BulkExamTimeUpdate {
  subjectCode: SubjectCode;
  examDate: Date;
  startingTime: Date;
  dueTime: Date;
  isExamSubjectActive: boolean;
}

/**
 * Fetches all available subject codes and their titles
 * Only accessible by administrators
 */
export async function fetchAllSubjectCodes(): Promise<{
  subjectCodes?: SubjectCodeInfo[];
  error?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "You must be logged in to access this resource" };
    }

    if (user.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      return {
        error: "You must be a system administrator to access this resource",
      };
    }

    const subjectCodesMap: Record<SubjectCode, string> = {
      MATH101: "Mathematics",
      PHYS101: "Physical Sciences",
      LIFE101: "Life Sciences",
      GEOG101: "Geography",
      HIST101: "History",
      ENHL101: "English Home Language",
      AFAL101: "Afrikaans First Additional Language",
      ECON101: "Economics",
      BUSS101: "Business Studies",
      ACCO101: "Accounting",
      CAT101: "Computer Applications Technology",
      IT101: "Information Technology",
      TOUR101: "Tourism",
      CONS101: "Consumer Studies",
      AGRI101: "Agricultural Sciences",
      VART101: "Visual Arts",
      MUSI101: "Music",
      DRAM101: "Dramatic Arts",
      SEHL101: "Sepedi Home Language",
      ZUHL101: "Zulu Home Language",
    };

    const subjectCodes: SubjectCodeInfo[] = Object.entries(subjectCodesMap).map(
      ([code, title]) => ({
        code: code as SubjectCode,
        title,
      }),
    );

    return { subjectCodes };
  } catch (error) {
    console.error("Error fetching subject codes:", error);
    return { error: "Failed to fetch subject codes. Please try again." };
  }
}

/**
 * Fetches exam settings for all subject codes at once
 * Only accessible by administrators
 */
export async function getAllSubjectExamSettings(): Promise<{
  settings?: Record<
    SubjectCode,
    {
      examDate: Date;
      startingTime: Date;
      dueTime: Date;
      isExamSubjectActive: boolean;
    }
  >;
  error?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "You must be logged in to access this resource" };
    }

    if (user.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      return {
        error: "You must be a system administrator to access this resource",
      };
    }

    const uniqueSubjectCodes = await prisma.subject.findMany({
      select: {
        subjectCode: true,
        examDate: true,
        startingTime: true,
        dueTime: true,
        isExamSubjectActive: true,
      },
      distinct: ["subjectCode"],
    });

    const settingsMap: Partial<
      Record<
        SubjectCode,
        {
          examDate: Date;
          startingTime: Date;
          dueTime: Date;
          isExamSubjectActive: boolean;
        }
      >
    > = {};

    uniqueSubjectCodes.forEach((record) => {
      settingsMap[record.subjectCode as SubjectCode] = {
        examDate: record.examDate,
        startingTime: record.startingTime,
        dueTime: record.dueTime,
        isExamSubjectActive: record.isExamSubjectActive,
      };
    });

    const subjectCodesMap = await fetchAllSubjectCodes();
    if (subjectCodesMap.subjectCodes) {
      const now = new Date();
      const defaultExamDate = new Date(now);
      defaultExamDate.setUTCHours(0, 0, 0, 0);
      defaultExamDate.setDate(now.getDate() + 30);

      const defaultStartTime = new Date(defaultExamDate);
      defaultStartTime.setUTCHours(9, 0, 0, 0);

      const defaultDueTime = new Date(defaultExamDate);
      defaultDueTime.setUTCHours(12, 0, 0, 0);

      subjectCodesMap.subjectCodes.forEach((subject) => {
        if (!settingsMap[subject.code]) {
          settingsMap[subject.code] = {
            examDate: defaultExamDate,
            startingTime: defaultStartTime,
            dueTime: defaultDueTime,
            isExamSubjectActive: false,
          };
        }
      });
    }

    return { settings: settingsMap as Record<SubjectCode, any> };
  } catch (error) {
    console.error(`Error fetching all exam settings:`, error);
    return { error: "Failed to fetch exam settings. Please try again." };
  }
}

const bulkUpdateSchema = z.array(
  z.object({
    subjectCode: z.string(),
    examDate: z.date(),
    startingTime: z.date(),
    dueTime: z.date(),
    isExamSubjectActive: z.boolean(),
  }),
);

/**
 * Bulk updates exam dates and times for multiple subjects
 * Only accessible by administrators
 */
export async function bulkUpdateExamTimes(
  updates: BulkExamTimeUpdate[],
): Promise<{
  success?: boolean;
  updatedCount?: number;
  error?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "You must be logged in to perform this action" };
    }

    if (user.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      return {
        error: "You must be a system administrator to perform this action",
      };
    }

    const validatedData = bulkUpdateSchema.safeParse(updates);
    if (!validatedData.success) {
      return { error: "Invalid data format for updates" };
    }

    const result = await prisma.$transaction(async (tx) => {
      let updatedCount = 0;

      for (const update of updates) {
        // Convert to UTC dates
        const utcExamDate = new Date(update.examDate);
        utcExamDate.setUTCHours(0, 0, 0, 0);

        const utcStartTime = new Date(update.startingTime);
        const utcDueTime = new Date(update.dueTime);

        if (utcDueTime <= utcStartTime) {
          throw new Error(
            `Due time must be after starting time for ${update.subjectCode}`,
          );
        }

        const updateResult = await tx.subject.updateMany({
          where: {
            subjectCode: update.subjectCode,
          },
          data: {
            examDate: utcExamDate,
            startingTime: utcStartTime,
            dueTime: utcDueTime,
            isExamSubjectActive: update.isExamSubjectActive,
            updatedAt: new Date(),
          },
        });

        updatedCount += updateResult.count;
      }

      return updatedCount;
    });

    revalidatePath("/admin/subjects");
    revalidatePath("/dashboard");

    return { success: true, updatedCount: result };
  } catch (error) {
    console.error("Error updating exam times:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update exam times. Please try again.";
    return { error: errorMessage };
  }
}

/**
 * Updates a single subject's exam times
 * Only accessible by administrators
 */
export async function updateSubjectExamTime(
  subjectCode: SubjectCode,
  examDate: Date,
  startingTime: Date,
  dueTime: Date,
  isExamSubjectActive: boolean,
): Promise<{
  success?: boolean;
  updatedCount?: number;
  error?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "You must be logged in to perform this action" };
    }

    if (user.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      return {
        error: "You must be a system administrator to perform this action",
      };
    }

    // Convert to UTC dates
    const utcExamDate = new Date(examDate);
    utcExamDate.setUTCHours(0, 0, 0, 0);

    const utcStartTime = new Date(startingTime);
    const utcDueTime = new Date(dueTime);

    if (utcDueTime <= utcStartTime) {
      return { error: "Due time must be after starting time" };
    }

    const updateResult = await prisma.subject.updateMany({
      where: {
        subjectCode,
      },
      data: {
        examDate: utcExamDate,
        startingTime: utcStartTime,
        dueTime: utcDueTime,
        isExamSubjectActive,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/subjects");
    revalidatePath("/dashboard");

    return { success: true, updatedCount: updateResult.count };
  } catch (error) {
    console.error(`Error updating exam time for ${subjectCode}:`, error);
    return { error: "Failed to update exam time. Please try again." };
  }
}
