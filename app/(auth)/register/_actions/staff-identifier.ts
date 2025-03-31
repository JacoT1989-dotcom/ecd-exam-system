"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import {
  StaffIdentifierFormValues,
  staffIdentifierSchema,
} from "../_validations/staff-identifier-validation";
import { z } from "zod";

/**
 * Creates a new staff identifier
 */
export async function createStaffIdentifier(
  formData: StaffIdentifierFormValues,
  userId?: string,
): Promise<{ success?: boolean; error?: string; staffIdentifier?: any }> {
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

    // Validate the form data
    const validatedData = staffIdentifierSchema.parse(formData);

    // Check if the government number already exists
    const existingIdentifier = await prisma.staffIdentifier.findFirst({
      where: {
        govNumber: BigInt(validatedData.govNumber),
      },
    });

    if (existingIdentifier) {
      return {
        error: "A staff identifier with this government number already exists",
      };
    }

    // Create a new staff identifier
    const newStaffIdentifier = await prisma.staffIdentifier.create({
      data: {
        staffTitle: validatedData.staffTitle,
        govNumber: BigInt(validatedData.govNumber),
        userId: userIdToUse,
      },
    });

    return {
      success: true,
      staffIdentifier: {
        ...newStaffIdentifier,
        govNumber: newStaffIdentifier.govNumber.toString(),
      },
    };
  } catch (error) {
    console.error("Staff identifier creation error:", error);

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0];
      return { error: firstError || "Invalid form data" };
    }

    return { error: "Something went wrong. Please try again." };
  }
}
