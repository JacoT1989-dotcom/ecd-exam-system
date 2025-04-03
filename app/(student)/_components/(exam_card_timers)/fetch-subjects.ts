"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { Subject } from "./types";
import { cache } from "react";
import { revalidatePath } from "next/cache";

// Define all subject codes
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

/**
 * Fetches subjects registered for the currently authenticated student
 * This function is secured and only returns subjects for the authenticated user
 * We'll also add a way to force revalidation when needed
 */
export const fetchStudentSubjects = cache(
  async (
    forceRefresh?: boolean,
  ): Promise<{
    subjects?: Subject[];
    error?: string;
  }> => {
    try {
      console.log("🔍 fetchStudentSubjects: Starting fetch operation");
      console.log(`🔄 Force refresh requested: ${forceRefresh ? "Yes" : "No"}`);

      // Force revalidation if needed
      if (forceRefresh) {
        console.log("🔄 Revalidating dashboard path");
        revalidatePath("/dashboard");
      }

      // Validate the session to ensure the user is authenticated
      console.log("🔐 Validating user authentication");
      const { user } = await validateRequest();

      if (!user) {
        console.log("❌ Authentication failed: No user found in session");
        return { error: "You must be logged in to view your subjects" };
      }

      console.log(`✅ User authenticated: ${user.id} (${user.email})`);

      // Fetch the subjects from the database for this specific user
      console.log(`📚 Fetching subjects for user: ${user.id}`);
      const subjectRecords = await prisma.subject.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          subjectCode: true,
          examDate: true,
          startingTime: true,
          dueTime: true,
          isExamSubjectActive: true,
        },
      });

      console.log(`📊 Found ${subjectRecords.length} subject records`);

      // Log each subject's details
      subjectRecords.forEach((record, index) => {
        console.log(
          `📝 Subject ${index + 1}: ${record.title} (${record.subjectCode})`,
        );
        console.log(`   - ID: ${record.id}`);
        console.log(`   - Exam Date: ${record.examDate}`);
        console.log(`   - Start Time: ${record.startingTime}`);
        console.log(`   - Due Time: ${record.dueTime}`);
        console.log(`   - Active: ${record.isExamSubjectActive}`);
      });

      // Map the database records to the expected Subject type
      console.log("🔄 Transforming database records to Subject objects");
      const subjects = subjectRecords.map((record, index): Subject => {
        // Complete color mapping for all subject codes
        const colorMap: Record<string, string> = {
          MATH101: "bg-blue-500", // Mathematics - Blue
          PHYS101: "bg-purple-500", // Physical Sciences - Purple
          LIFE101: "bg-green-500", // Life Sciences - Green
          GEOG101: "bg-yellow-500", // Geography - Yellow
          HIST101: "bg-indigo-500", // History - Indigo
          ENHL101: "bg-pink-500", // English Home Language - Pink
          AFAL101: "bg-red-500", // Afrikaans First Additional Language - Red
          ECON101: "bg-teal-500", // Economics - Teal
          BUSS101: "bg-orange-500", // Business Studies - Orange
          ACCO101: "bg-emerald-500", // Accounting - Emerald
          CAT101: "bg-sky-500", // Computer Applications Technology - Sky
          IT101: "bg-cyan-500", // Information Technology - Cyan
          TOUR101: "bg-amber-500", // Tourism - Amber
          CONS101: "bg-lime-500", // Consumer Studies - Lime
          AGRI101: "bg-green-600", // Agricultural Sciences - Dark Green
          VART101: "bg-rose-500", // Visual Arts - Rose
          MUSI101: "bg-violet-500", // Music - Violet
          DRAM101: "bg-fuchsia-500", // Dramatic Arts - Fuchsia
          SEHL101: "bg-blue-600", // Sepedi Home Language - Dark Blue
          ZUHL101: "bg-purple-600", // Zulu Home Language - Dark Purple
        };

        // Default color if no mapping exists
        const defaultColor = "bg-gray-500";

        // Generate a consistent numeric ID from the string ID
        function hashCode(str: string): number {
          let hash = 0;
          if (str.length === 0) return hash;

          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
          }

          return Math.abs(hash); // Return positive number
        }

        // Create subject object with all time fields
        const subject = {
          id: hashCode(record.id), // Convert UUID to consistent numeric ID
          name: record.title,
          code: record.subjectCode,
          description: `${record.title} Examination`,
          examDate: record.examDate,
          startingTime: record.startingTime, // Include start time
          dueTime: record.dueTime, // Include due time
          isActive: record.isExamSubjectActive, // Include active status
          color:
            colorMap[record.subjectCode as keyof typeof colorMap] ||
            defaultColor,
        };

        console.log(`🎨 Transformed Subject ${index + 1}:`);
        console.log(`   - ID: ${subject.id} (hashed from ${record.id})`);
        console.log(`   - Name: ${subject.name}`);
        console.log(`   - Code: ${subject.code}`);
        console.log(`   - Exam Date: ${subject.examDate}`);
        console.log(`   - Start Time: ${subject.startingTime}`);
        console.log(`   - Due Time: ${subject.dueTime}`);
        console.log(`   - Active: ${subject.isActive}`);
        console.log(`   - Color: ${subject.color}`);

        return subject;
      });

      console.log(`✅ Successfully transformed ${subjects.length} subjects`);
      return { subjects };
    } catch (error) {
      console.error("❌ Error fetching student subjects:", error);
      return { error: "Failed to fetch your subjects. Please try again." };
    }
  },
);

// Add a utility function to force refresh data
export async function refreshSubjectsData() {
  console.log("🔄 refreshSubjectsData: Forcing data refresh");
  return fetchStudentSubjects(true);
}
