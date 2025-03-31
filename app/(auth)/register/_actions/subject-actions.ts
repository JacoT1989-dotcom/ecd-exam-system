"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { subjectSelectionSchema } from "../_validations/subject-validations";

// Define the mapping of subject codes to subject names with proper typing
type SubjectCode =
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

const subjectCodeToNameMap: Record<SubjectCode, string> = {
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

/**
 * Registers selected subjects for a user
 * CRITICAL: This function does NOT delete or modify existing subjects for other users
 */
export async function registerUserSubjects(
  subjectCodes: string[],
  userId?: string,
): Promise<{ success?: boolean; error?: string }> {
  try {
    console.log(
      `Starting subject registration for userId: ${userId}, codes:`,
      subjectCodes,
    );

    // Validate input
    const validatedData = subjectSelectionSchema.parse({
      selectedSubjects: subjectCodes,
    });

    // If userId is provided directly, use it
    // Otherwise try to get from the session
    let userIdToUse = userId;

    if (!userIdToUse) {
      // Only validate session if no userId was provided
      const { user } = await validateRequest();
      if (!user) {
        return { error: "You must be logged in to perform this action" };
      }
      userIdToUse = user.id;
    }

    console.log(`Registering subjects for user ID: ${userIdToUse}`);

    // Use a placeholder date for required date fields
    // These will need to be updated later by an admin
    const placeholderDate = new Date();
    placeholderDate.setFullYear(placeholderDate.getFullYear() + 1); // Set to next year

    // Process each subject code
    for (const code of validatedData.selectedSubjects) {
      // Type-safe way to get the subject name
      let subjectName: string;
      if (Object.keys(subjectCodeToNameMap).includes(code)) {
        subjectName = subjectCodeToNameMap[code as SubjectCode];
      } else {
        subjectName = `Unknown Subject (${code})`;
        console.warn(`Unknown subject code encountered: ${code}`);
      }

      // Check if this user already has this subject registered
      // This prevents duplicate entries for the same user/subject combination
      const existingSubject = await prisma.subject.findFirst({
        where: {
          userId: userIdToUse,
          subjectCode: code,
        },
      });

      if (existingSubject) {
        console.log(
          `Subject ${code} already exists for user ${userIdToUse}, skipping creation`,
        );
        continue;
      }

      try {
        // Create the subject for this specific user
        await prisma.subject.create({
          data: {
            title: subjectName,
            subjectCode: code,
            startingTime: placeholderDate,
            dueTime: placeholderDate,
            examDate: placeholderDate,
            isExamSubjectActive: false,
            userId: userIdToUse,
          },
        });

        console.log(
          `Created subject ${subjectName} (${code}) for user ${userIdToUse}`,
        );
      } catch (error) {
        console.error(`Error creating subject ${code}:`, error);
        // Continue to next subject instead of failing completely
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Subject registration error:", error);

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0];
      return { error: firstError || "Invalid form data" };
    }

    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Gets all available subjects that can be selected
 */
export async function getAvailableSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        title: true,
        subjectCode: true,
      },
    });

    return { subjects, success: true };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return { error: "Failed to fetch available subjects" };
  }
}
