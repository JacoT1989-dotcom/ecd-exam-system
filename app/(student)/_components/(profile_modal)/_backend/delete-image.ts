"use server";

import prisma from "@/lib/prisma";
import { UpdateStatus } from "./student-types";
import { validateRequest } from "@/auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";

// Schema for validating the image deletion request
const deleteImageSchema = z.object({
  imageType: z.enum(["avatar", "background"]),
});

type DeleteImageValues = z.infer<typeof deleteImageSchema>;

// Delete an image (avatar or background) from a student's profile
export async function deleteStudentImage(
  formData: DeleteImageValues,
): Promise<UpdateStatus> {
  try {
    // Reuse the same validation logic as other student actions
    const session = await validateRequest();

    if (!session || !session.user) {
      return {
        error: "Not authenticated",
      };
    }

    if (session.user.role !== UserRole.STUDENT) {
      return {
        error: "Access denied. Students only.",
      };
    }

    const userId = session.user.id;
    const validatedData = deleteImageSchema.parse(formData);

    // Determine which field to update based on the imageType
    const updateData =
      validatedData.imageType === "avatar"
        ? { avatarUrl: null }
        : { backgroundUrl: null };

    // Update the user record to set the image URL to null
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Note: This doesn't delete the actual image file from storage
    // In a production environment, you might want to add logic to delete
    // the file from your blob storage as well

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting student image:", error);
    return {
      error: "Failed to delete image. Please try again.",
    };
  }
}
