"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { SessionUser } from "../../SessionProvider";

type ProfileModalProps = {
  user: SessionUser | null;
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <div className="relative">
          {/* Cover/Background Image - reduced height */}
          <div className="h-56 w-full relative bg-gradient-to-r from-cyan-500 to-blue-600">
            {user?.backgroundUrl && (
              <Image
                src={user.backgroundUrl}
                alt="Profile background"
                fill
                className="object-cover"
              />
            )}

            {/* Close button */}
            <button
              onClick={onClose}
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
              <div className="bg-white p-1 rounded-full shadow-md w-24 h-24">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-3xl font-bold">
                      {user?.firstName?.charAt(0) || ""}
                      {user?.lastName?.charAt(0) || ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit button on avatar - smaller */}
              <button className="absolute bottom-1 right-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-1 shadow-md border-2 border-white">
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
              </button>
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

            {/* Action buttons - smaller */}
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium">
                Edit Personal Info
              </button>
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
