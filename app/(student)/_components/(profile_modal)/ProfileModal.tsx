"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { SessionUser } from "../../SessionProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateImages } from "./_backend/student-actions";
import { Input } from "@/components/ui/input";
import { deleteStudentImage } from "./_backend/delete-image";

type ProfileModalProps = {
  user: SessionUser | null;
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<"avatar" | "background" | null>(
    null,
  );
  const router = useRouter();

  // Local state to track current images (in case they're deleted during this session)
  const [currentAvatar, setCurrentAvatar] = useState<string | null | undefined>(
    user?.avatarUrl,
  );
  const [currentBackground, setCurrentBackground] = useState<
    string | null | undefined
  >(user?.backgroundUrl);

  // Update local state when user data changes
  useEffect(() => {
    setCurrentAvatar(user?.avatarUrl);
    setCurrentBackground(user?.backgroundUrl);
  }, [user?.avatarUrl, user?.backgroundUrl]);

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleBackgroundClick = () => {
    if (backgroundInputRef.current) {
      backgroundInputRef.current.click();
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSize = type === "avatar" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    const sizeLabel = type === "avatar" ? "5MB" : "10MB";

    if (file.size > maxSize) {
      toast.error(
        `${type === "avatar" ? "Avatar" : "Background"} image must be less than ${sizeLabel}`,
      );
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP formats are supported");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (type === "avatar") {
        formData.append("avatarImage", file);
      } else {
        formData.append("backgroundImage", file);
      }

      const result = await updateImages(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `${type === "avatar" ? "Profile picture" : "Background image"} updated successfully`,
        );

        // Update local state to match new uploaded image
        if (type === "avatar" && result.avatarUrl) {
          setCurrentAvatar(result.avatarUrl);
        }
        if (type === "background" && result.backgroundUrl) {
          setCurrentBackground(result.backgroundUrl);
        }

        // Force refresh to show updated images
        router.refresh();
      }
    } catch (error) {
      toast.error(`Failed to update ${type} image`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete image handler
  const handleDeleteImage = async (type: "avatar" | "background") => {
    if (!confirm(`Are you sure you want to delete your ${type} image?`)) {
      return;
    }

    setIsDeleting(type);
    try {
      const result = await deleteStudentImage({ imageType: type });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `${type === "avatar" ? "Profile picture" : "Background image"} deleted successfully`,
        );

        // Update local state to reflect deletion
        if (type === "avatar") {
          setCurrentAvatar(null);
        } else {
          setCurrentBackground(null);
        }

        // Force refresh to show updated images
        router.refresh();
      }
    } catch (error) {
      toast.error(`Failed to delete ${type} image`);
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle closing the modal by button click
  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal content - absolute positioning for perfect centering */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* Hidden file inputs */}
        <Input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e, "avatar")}
        />
        <Input
          ref={backgroundInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e, "background")}
        />

        {/* Header with background and avatar */}
        <div className="relative">
          {/* Cover/Background Image - reduced height */}
          <div
            className={`h-56 w-full relative bg-gradient-to-r from-cyan-500 to-blue-600 ${!isUploading && isDeleting !== "background" && "cursor-pointer"}`}
            onClick={
              !isUploading && isDeleting !== "background"
                ? handleBackgroundClick
                : undefined
            }
            title="Click to change background image"
          >
            {currentBackground && (
              <Image
                src={currentBackground}
                alt="Profile background"
                fill
                className="object-cover"
              />
            )}

            {/* Controls for background */}
            <div className="absolute bottom-2 right-2 flex">
              {/* Edit button */}
              <div
                className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 transition-colors mr-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBackgroundClick();
                }}
                title="Edit background image"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Delete button - only show if there's a background image */}
              {currentBackground && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage("background");
                  }}
                  disabled={isUploading || isDeleting !== null}
                  className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 transition-colors cursor-pointer"
                  title="Delete background image"
                >
                  {isDeleting === "background" ? (
                    <svg
                      className="w-4 h-4 animate-spin text-gray-800"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-red-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleCloseButtonClick}
              className="absolute top-2 right-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-1.5 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Avatar - positioned to overlap the background but smaller */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <div
                className={`bg-white p-1 rounded-full shadow-md w-24 h-24 ${!isUploading && isDeleting !== "avatar" && "cursor-pointer"}`}
                onClick={
                  !isUploading && isDeleting !== "avatar"
                    ? handleAvatarClick
                    : undefined
                }
                title="Click to change profile picture"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  {currentAvatar ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={currentAvatar}
                        alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-3xl font-bold rounded-full">
                      {user?.firstName?.charAt(0) || ""}
                      {user?.lastName?.charAt(0) || ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Controls for avatar */}
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                {/* Edit button on avatar - smaller */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAvatarClick();
                  }}
                  disabled={isUploading || isDeleting !== null}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-1 shadow-md border-2 border-white"
                  title="Change profile picture"
                >
                  {isUploading ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>

                {/* Delete button - only show if there's an avatar image */}
                {currentAvatar && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage("avatar");
                    }}
                    disabled={isUploading || isDeleting !== null}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md border-2 border-white"
                    title="Delete profile picture"
                  >
                    {isDeleting === "avatar" ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User information with extra space for avatar */}
        <div className="pt-14 px-6 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.displayName ||
                  `${user?.firstName || ""} ${user?.lastName || ""}`}
              </h2>
              <p className="text-gray-500 text-sm">@{user?.username}</p>
              <p className="text-xs text-gray-600 font-medium">
                {formatRole(user?.role)}
              </p>
            </div>
          </div>

          {/* Profile content */}
          <div className="space-y-3">
            {/* Contact and Account Info in flex layout */}
            <div className="flex gap-3">
              {/* Contact Information */}
              <div className="bg-gray-50 p-3 rounded-lg flex-1">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">📧</span>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-xs text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-xs text-gray-800">
                        {formatAddress(user)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 p-3 rounded-lg flex-1">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Account Details
                </h3>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">👤</span>
                    <div>
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-xs text-gray-800">{user?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🏫</span>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-xs text-gray-800">
                        {formatRole(user?.role)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🔑</span>
                    <div>
                      <p className="text-xs text-gray-500">Account</p>
                      <p className="text-xs text-gray-800">Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">
                Academic Information
              </h3>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">📚</span>
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p className="text-xs text-gray-800">12</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">🎓</span>
                  <div>
                    <p className="text-xs text-gray-500">Subjects</p>
                    <p className="text-xs text-gray-800">8</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">🏆</span>
                  <div>
                    <p className="text-xs text-gray-500">Achievements</p>
                    <p className="text-xs text-gray-800">Honor Roll</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">📊</span>
                  <div>
                    <p className="text-xs text-gray-500">Avg. Grade</p>
                    <p className="text-xs text-gray-800">A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format address
const formatAddress = (user: SessionUser | null) => {
  if (!user) return "";

  const parts = [
    user.streetAddress,
    user.suburb,
    user.townCity,
    user.postcode,
    user.country,
  ].filter(Boolean);

  return parts.join(", ");
};

// Helper function to format role in a more readable way
const formatRole = (role?: string) => {
  if (!role) return "";

  // Convert SNAKE_CASE to Title Case
  return role
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default ProfileModal;
