"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";

// Validation schema for exam center form
const examCenterSchema = z.object({
  examinationNumber: z.string().min(1, "Examination number is required"),
  year: z.coerce.number().int().min(2000, "Valid year is required"),
  province: z.string().min(1, "Province is required"),
  centerName: z.string().min(1, "Examination center name is required"),
});

type ExamCenterFormValues = z.infer<typeof examCenterSchema>;

/**
 * Creates a new exam center or updates if it already exists
 */
export async function createOrUpdateExamCenter(
  formData: ExamCenterFormValues,
  userId?: string,
): Promise<{ success?: boolean; error?: string }> {
  try {
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

    // Rest of your function remains the same...
    const validatedData = examCenterSchema.parse(formData);

    // Check if the examination number already exists
    const existingCenter = await prisma.examCenter.findUnique({
      where: { examinationNumber: validatedData.examinationNumber },
    });

    if (existingCenter) {
      return {
        error: "An exam center with this examination number already exists",
      };
    }

    // Create a new exam center with the user ID
    await prisma.examCenter.create({
      data: {
        examinationNumber: validatedData.examinationNumber,
        year: validatedData.year,
        province: validatedData.province,
        centerName: validatedData.centerName,
        userId: userIdToUse, // Use the ID we determined above
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Exam center update error:", error);

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0];
      return { error: firstError || "Invalid form data" };
    }

    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Retrieves the current user's exam center details
 */
export async function getUserExamCenter() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Not authenticated" };
    }

    const examCenter = await prisma.examCenter.findFirst({
      where: { userId: user.id },
    });

    return {
      examCenter: examCenter || null,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching exam center:", error);
    return { error: "Failed to fetch exam center details" };
  }
}

/**
 * Removes a user's exam center
 */
export async function removeUserExamCenter() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Find the exam center associated with this user
    const examCenter = await prisma.examCenter.findFirst({
      where: { userId: user.id },
    });

    if (!examCenter) {
      return { error: "No exam center found for this user" };
    }

    // Delete the exam center
    await prisma.examCenter.delete({
      where: { id: examCenter.id },
    });

    revalidatePath("/student/profile");
    return { success: true };
  } catch (error) {
    console.error("Error removing exam center:", error);
    return { error: "Failed to remove exam center" };
  }
}

/**
 * Gets all provinces for dropdown selection
 */
export async function getProvinces() {
  // You could fetch this from a database table
  // For now, returning a static list of South African provinces
  return [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ];
}
