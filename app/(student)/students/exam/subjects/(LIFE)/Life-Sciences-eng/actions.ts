"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import {
  CreateLifeOrientationExamResponse,
  LifeOrientationExamFormType,
} from "./types";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { lifeOrientationExamFormSchema } from "./validations";

/**
 * Server action to create a new Life Orientation Exam
 * This action is restricted to students only
 */
export async function createLifeOrientationExam(
  formData: LifeOrientationExamFormType,
): Promise<CreateLifeOrientationExamResponse> {
  try {
    // Get current session to verify user is authenticated
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        error: "You must be logged in to create an exam.",
      };
    }

    // Validate session and get user
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Invalid session
      cookies().delete(lucia.sessionCookieName);
      return {
        error: "Session expired. Please log in again.",
      };
    }

    // Check if user is a student
    if (user.role !== UserRole.STUDENT) {
      return {
        error: "Only students can create life orientation exams.",
      };
    }

    // Validate form data
    const validatedData = lifeOrientationExamFormSchema.safeParse({
      ...formData,
      userId: user.id,
    });

    if (!validatedData.success) {
      // Return validation errors
      return {
        error: "Invalid form data. Please check your answers and try again.",
      };
    }

    // Create the exam in the database
    const newExam = await prisma.lifeOrientationExam.create({
      data: validatedData.data,
    });

    // Revalidate the path to update UI
    revalidatePath("/students/exams");

    return {
      success: true,
      examId: newExam.id,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Create Life Orientation Exam error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Server action to fetch a Life Orientation Exam by ID
 * This action is restricted to students only
 */
export async function getLifeOrientationExam(examId: string) {
  try {
    // Get current session to verify user is authenticated
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        error: "You must be logged in to view an exam.",
      };
    }

    // Validate session and get user
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Invalid session
      cookies().delete(lucia.sessionCookieName);
      return {
        error: "Session expired. Please log in again.",
      };
    }

    // Check if user is a student
    if (user.role !== UserRole.STUDENT) {
      return {
        error: "Only students can view life orientation exams.",
      };
    }

    // Fetch the exam from the database
    const exam = await prisma.lifeOrientationExam.findUnique({
      where: {
        id: examId,
        userId: user.id, // Ensure the exam belongs to the requesting user
      },
    });

    if (!exam) {
      return {
        error: "Exam not found or you don't have permission to view it.",
      };
    }

    return {
      success: true,
      exam,
    };
  } catch (error) {
    console.error("Get Life Orientation Exam error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
