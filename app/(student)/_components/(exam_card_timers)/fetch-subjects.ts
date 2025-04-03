"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { Subject } from "./types";
import { cache } from "react";
import { revalidatePath } from "next/cache";

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

export const fetchStudentSubjects = cache(
  async (
    forceRefresh?: boolean,
  ): Promise<{
    subjects?: Subject[];
    error?: string;
  }> => {
    try {
      if (forceRefresh) {
        revalidatePath("/dashboard");
      }

      const { user } = await validateRequest();

      if (!user) {
        return { error: "You must be logged in to view your subjects" };
      }

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

      const colorMap: Record<string, string> = {
        MATH101: "bg-blue-500",
        PHYS101: "bg-purple-500",
        LIFE101: "bg-green-500",
        GEOG101: "bg-yellow-500",
        HIST101: "bg-indigo-500",
        ENHL101: "bg-pink-500",
        AFAL101: "bg-red-500",
        ECON101: "bg-teal-500",
        BUSS101: "bg-orange-500",
        ACCO101: "bg-emerald-500",
        CAT101: "bg-sky-500",
        IT101: "bg-cyan-500",
        TOUR101: "bg-amber-500",
        CONS101: "bg-lime-500",
        AGRI101: "bg-green-600",
        VART101: "bg-rose-500",
        MUSI101: "bg-violet-500",
        DRAM101: "bg-fuchsia-500",
        SEHL101: "bg-blue-600",
        ZUHL101: "bg-purple-600",
      };

      const defaultColor = "bg-gray-500";

      function hashCode(str: string): number {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return Math.abs(hash);
      }

      const subjects = subjectRecords.map((record): Subject => {
        return {
          id: hashCode(record.id),
          name: record.title,
          code: record.subjectCode,
          description: `${record.title} Examination`,
          examDate: record.examDate ?? new Date(), // Provide default date if null
          startingTime: record.startingTime ?? new Date(), // Provide default time if null
          dueTime: record.dueTime ?? new Date(), // Provide default time if null
          isActive: record.isExamSubjectActive,
          color:
            colorMap[record.subjectCode as keyof typeof colorMap] ||
            defaultColor,
        };
      });

      return { subjects };
    } catch (error) {
      return { error: "Failed to fetch your subjects. Please try again." };
    }
  },
);

export async function refreshSubjectsData() {
  return fetchStudentSubjects(true);
}
