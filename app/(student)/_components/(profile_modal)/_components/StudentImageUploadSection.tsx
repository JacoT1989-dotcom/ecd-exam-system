"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { updateImages } from "../_backend/student-actions";
import Image from "next/image";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteStudentImage } from "../_backend/delete-image";

interface StudentImageUploadSectionProps {
  userData: {
    displayName: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    backgroundUrl?: string | null;
  };
  onSuccess?: () => void;
}

export function StudentImageUploadSection({
  userData,
  onSuccess,
}: StudentImageUploadSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isDeletingBackground, setIsDeletingBackground] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData.avatarUrl || null,
  );
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    userData.backgroundUrl || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Update state when userData changes (like after a refresh)
  useEffect(() => {
    setAvatarPreview(userData.avatarUrl || null);
    setBackgroundPreview(userData.backgroundUrl || null);
  }, [userData.avatarUrl, userData.backgroundUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be less than 5MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP formats are supported");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Background image must be less than 10MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP formats are supported");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setBackgroundFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no changes, do nothing
    if (!avatarFile && !backgroundFile) {
      toast.info("No images selected for upload");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (avatarFile) formData.append("avatarImage", avatarFile);
      if (backgroundFile) formData.append("backgroundImage", backgroundFile);

      const result = await updateImages(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Images updated successfully");

        // Reset the file inputs but keep the previews
        setAvatarFile(null);
        setBackgroundFile(null);

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Failed to update images");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAvatarPreview = () => {
    setAvatarPreview(userData.avatarUrl || null);
    setAvatarFile(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const removeBackgroundPreview = () => {
    setBackgroundPreview(userData.backgroundUrl || null);
    setBackgroundFile(null);
    if (backgroundInputRef.current) backgroundInputRef.current.value = "";
  };

  // Delete image handlers
  const handleDeleteAvatar = async () => {
    setIsDeletingAvatar(true);
    try {
      const result = await deleteStudentImage({ imageType: "avatar" });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile avatar deleted successfully");
        // Clear preview but don't disable upload controls
        setAvatarPreview(null);
        setAvatarFile(null);

        // Call the callback function to refresh parent component
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Failed to delete avatar image");
      console.error(error);
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const handleDeleteBackground = async () => {
    setIsDeletingBackground(true);
    try {
      const result = await deleteStudentImage({ imageType: "background" });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Background image deleted successfully");
        // Clear preview but don't disable upload controls
        setBackgroundPreview(null);
        setBackgroundFile(null);

        // Call the callback function to refresh parent component
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Failed to delete background image");
      console.error(error);
    } finally {
      setIsDeletingBackground(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
  };

  return (
    <Card className="w-full overflow-hidden border border-gray-200 bg-white shadow-lg">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-cyan-600" />
          <CardTitle className="text-xl font-semibold">
            Profile Images
          </CardTitle>
        </div>
        <CardDescription>
          Upload your profile avatar and background images
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Profile Avatar</h3>
              <p className="text-xs text-gray-500">
                Max size: 5MB (JPEG, PNG, WebP)
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-2 ring-gray-200 ring-offset-2 ring-offset-background">
                <AvatarImage src={avatarPreview || ""} />
                <AvatarFallback className="bg-cyan-100 text-cyan-800 text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isSubmitting || isDeletingAvatar}
                    className="flex gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {avatarFile
                      ? "Change"
                      : avatarPreview
                        ? "Replace"
                        : "Select"}{" "}
                    Avatar
                  </Button>

                  {/* Remove from previews/cancel upload button */}
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeAvatarPreview}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Delete from server button - only show if there's an existing image on server */}
                  {avatarPreview && !avatarFile && userData.avatarUrl && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting || isDeletingAvatar}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isDeletingAvatar ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete profile avatar?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The image will be
                            removed from your profile.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAvatar}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                <Input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isSubmitting || isDeletingAvatar}
                />

                <p className="text-xs text-gray-500">
                  Recommended size: 500x500px. Will be cropped to a circle.
                </p>
              </div>
            </div>
          </div>

          {/* Background Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Profile Background</h3>
              <p className="text-xs text-gray-500">
                Max size: 10MB (JPEG, PNG, WebP)
              </p>
            </div>

            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-full bg-gray-100">
              {backgroundPreview ? (
                <Image
                  src={backgroundPreview}
                  alt="Background preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => backgroundInputRef.current?.click()}
                disabled={isSubmitting || isDeletingBackground}
                className="flex gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                {backgroundFile
                  ? "Change"
                  : backgroundPreview
                    ? "Replace"
                    : "Select"}{" "}
                Background
              </Button>

              {/* Remove from previews/cancel upload button */}
              {backgroundFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeBackgroundPreview}
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              {/* Delete from server button - only show if there's an existing image on server */}
              {backgroundPreview &&
                !backgroundFile &&
                userData.backgroundUrl && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting || isDeletingBackground}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isDeletingBackground ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete background image?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The image will be
                          removed from your profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteBackground}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

              <Input
                ref={backgroundInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBackgroundChange}
                className="hidden"
                disabled={isSubmitting || isDeletingBackground}
              />
            </div>

            <p className="text-xs text-gray-500">
              Recommended size: 1500x500px. A high-quality landscape image works
              best.
            </p>
          </div>

          <CardFooter className="flex justify-end px-0 pt-4">
            <Button
              type="submit"
              size="sm"
              disabled={
                isSubmitting ||
                isDeletingAvatar ||
                isDeletingBackground ||
                (!avatarFile && !backgroundFile)
              }
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
