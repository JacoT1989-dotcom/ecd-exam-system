"use client";

import { useRef, useEffect, useState } from "react";
import { SessionUser } from "../../SessionProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateImages } from "./_backend/student-actions";
import { deleteStudentImage } from "./_backend/delete-image";
import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileInfo } from "./_components/ProfileInfo";
import { ContactInfo } from "./_components/ContactInfo";
import { AccountDetails } from "./_components/AccountDetails";
import { AcademicInfo } from "./_components/AcademicInfo";

type ProfileModalProps = {
  user: SessionUser | null;
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
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
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp";
    fileInput.onchange = (e) =>
      handleFileChange(
        e as unknown as React.ChangeEvent<HTMLInputElement>,
        "avatar",
      );
    fileInput.click();
  };

  const handleBackgroundClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp";
    fileInput.onchange = (e) =>
      handleFileChange(
        e as unknown as React.ChangeEvent<HTMLInputElement>,
        "background",
      );
    fileInput.click();
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
        {/* Header with background and avatar */}
        <ProfileHeader
          currentAvatar={currentAvatar}
          currentBackground={currentBackground}
          isUploading={isUploading}
          isDeleting={isDeleting}
          firstName={user?.firstName}
          lastName={user?.lastName}
          handleAvatarClick={handleAvatarClick}
          handleBackgroundClick={handleBackgroundClick}
          handleDeleteImage={handleDeleteImage}
          handleFileChange={handleFileChange}
          handleCloseButtonClick={handleCloseButtonClick}
        />

        {/* User information with extra space for avatar */}
        <div className="pt-14 px-6 pb-6">
          <ProfileInfo
            displayName={user?.displayName}
            firstName={user?.firstName}
            lastName={user?.lastName}
            username={user?.username}
            role={user?.role}
          />

          {/* Profile content */}
          <div className="space-y-3">
            {/* Contact and Account Info in flex layout */}
            <div className="flex gap-3">
              <ContactInfo
                email={user?.email}
                streetAddress={user?.streetAddress}
                suburb={user?.suburb}
                townCity={user?.townCity}
                postcode={user?.postcode}
                country={user?.country}
              />

              <AccountDetails username={user?.username} role={user?.role} />
            </div>

            {/* Academic Information */}
            <AcademicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
