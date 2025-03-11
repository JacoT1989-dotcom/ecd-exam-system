// utils/handwriting.ts
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

/**
 * Saves handwriting data to Vercel Blob and records it in the database
 */
export async function saveHandwritingEntry({
  imageData,
  recognizedText,
  points,
  userId,
}: {
  imageData: Blob | File;
  recognizedText?: string;
  points: Point[];
  userId?: string;
}) {
  try {
    // Upload the handwriting image to Vercel Blob
    const timestamp = Date.now();
    const filename = `handwriting_${timestamp}.png`;
    const path = userId
      ? `handwriting/${userId}/${filename}`
      : `handwriting/anonymous/${filename}`;

    const blob = await put(path, imageData, {
      access: "public",
      addRandomSuffix: true,
    });

    if (!blob.url) {
      throw new Error("Failed to upload handwriting image");
    }

    // Store the entry in the database
    const entry = await prisma.handwritingEntry.create({
      data: {
        imageUrl: blob.url,
        recognizedText: recognizedText || null,
        userId: userId || null,
        // Remove the points field from here as it's not in the schema
      },
    });

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error("Error saving handwriting entry:", error);
    throw error;
  }
}
