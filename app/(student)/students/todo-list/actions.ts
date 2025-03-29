"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { z } from "zod";

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

// Schema for validating handwriting data
// Update recognizedText to allow null values
const saveHandwritingSchema = z.object({
  recognizedText: z.string().nullable().optional(),
  points: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      pressure: z.number().optional(),
    }),
  ),
});

/**
 * Saves handwriting data to Vercel Blob and records it in the database
 */
export async function saveHandwriting(formData: FormData) {
  try {
    // Authenticate user (optional - if you want to associate with a user)
    const session = await validateRequest();
    const userId = session?.user?.id;

    // Get canvas image from FormData
    const canvasImage = formData.get("canvasImage") as File;
    if (!canvasImage || !canvasImage.size) {
      return {
        error: "No handwriting image provided",
      };
    }

    // Get JSON data from FormData
    const pointsJson = formData.get("points") as string;
    const recognizedText = formData.get("recognizedText") as string | null;

    if (!pointsJson) {
      return {
        error: "No handwriting points data provided",
      };
    }

    // Parse and validate points data
    const points = JSON.parse(pointsJson);
    const validatedData = saveHandwritingSchema.parse({
      recognizedText,
      points,
    });

    // Upload the handwriting image to Vercel Blob
    const timestamp = Date.now();
    const filename = `handwriting_${timestamp}.png`;
    const path = userId
      ? `handwriting/${userId}/${filename}`
      : `handwriting/anonymous/${filename}`;

    const blob = await put(path, canvasImage, {
      access: "public",
      addRandomSuffix: true,
    });

    if (!blob.url) {
      return {
        error: "Failed to upload handwriting image",
      };
    }

    // Store the entry in the database
    const entry = await prisma.handwritingEntry.create({
      data: {
        imageUrl: blob.url,
        recognizedText: validatedData.recognizedText || null,
        userId: userId || null,
        // Removed points field as it doesn't exist in the schema
      },
    });

    return {
      success: true,
      imageUrl: blob.url,
      entryId: entry.id,
    };
  } catch (error) {
    console.error("Error saving handwriting entry:", error);
    return {
      error: "Failed to save handwriting. Please try again.",
    };
  }
}

/**
 * Retrieves a single handwriting entry by ID
 */
export async function getHandwritingEntry(id: string) {
  try {
    const entry = await prisma.handwritingEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return {
        error: "Handwriting entry not found",
      };
    }

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error("Error retrieving handwriting entry:", error);
    return {
      error: "Failed to retrieve handwriting entry",
    };
  }
}

/**
 * Retrieves all handwriting entries for a user
 */
export async function getUserHandwritingEntries() {
  try {
    // Authenticate user
    const session = await validateRequest();

    if (!session || !session.user) {
      return {
        error: "Not authenticated",
      };
    }

    const userId = session.user.id;

    const entries = await prisma.handwritingEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // asc = oldest first
    });

    return {
      success: true,
      entries,
    };
  } catch (error) {
    console.error("Error retrieving handwriting entries:", error);
    return {
      error: "Failed to retrieve handwriting entries",
    };
  }
}

/**
 * Deletes a handwriting entry
 */
export async function deleteHandwritingEntry(id: string) {
  try {
    // Authenticate user
    const session = await validateRequest();

    if (!session || !session.user) {
      return {
        error: "Not authenticated",
      };
    }

    const userId = session.user.id;

    // Find the entry to verify ownership
    const entry = await prisma.handwritingEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return {
        error: "Handwriting entry not found",
      };
    }

    // Verify ownership (if entry is associated with a user)
    if (entry.userId && entry.userId !== userId) {
      return {
        error: "You don't have permission to delete this entry",
      };
    }

    // Delete the entry
    await prisma.handwritingEntry.delete({
      where: { id },
    });

    // Note: This doesn't delete the actual image file from Vercel Blob
    // In a production environment, you might want to add logic to delete
    // the file from your blob storage as well

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting handwriting entry:", error);
    return {
      error: "Failed to delete handwriting entry",
    };
  }
}

/**
 * Updates the recognized text for a handwriting entry
 */
export async function updateRecognizedText(id: string, text: string) {
  try {
    // Authenticate user
    const session = await validateRequest();

    if (!session || !session.user) {
      return {
        error: "Not authenticated",
      };
    }

    const userId = session.user.id;

    // Find the entry to verify ownership
    const entry = await prisma.handwritingEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return {
        error: "Handwriting entry not found",
      };
    }

    // Verify ownership (if entry is associated with a user)
    if (entry.userId && entry.userId !== userId) {
      return {
        error: "You don't have permission to update this entry",
      };
    }

    // Update the entry
    await prisma.handwritingEntry.update({
      where: { id },
      data: { recognizedText: text },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating recognized text:", error);
    return {
      error: "Failed to update recognized text",
    };
  }
}
