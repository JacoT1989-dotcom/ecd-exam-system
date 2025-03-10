// upload.ts
import { put } from "@vercel/blob";
import { ImageUploadResult } from "./student-types";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_BACKGROUND_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadImage(
  file: File,
  pathPrefix: string,
): Promise<ImageUploadResult> {
  try {
    if (!file || !file.size) {
      throw new Error("No file provided");
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are supported.`,
      );
    }

    // Validate file size based on image type (avatar or background)
    const isAvatar = pathPrefix.includes("avatar");
    const maxSize = isAvatar ? MAX_AVATAR_SIZE : MAX_BACKGROUND_SIZE;

    if (file.size > maxSize) {
      throw new Error(
        `File size must be less than ${isAvatar ? "5MB" : "10MB"}`,
      );
    }

    const timestamp = Date.now();
    const path = `${pathPrefix}/${timestamp}_${file.name}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: true,
    });

    if (!blob.url) {
      throw new Error("Failed to upload file");
    }

    return {
      url: blob.url,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
