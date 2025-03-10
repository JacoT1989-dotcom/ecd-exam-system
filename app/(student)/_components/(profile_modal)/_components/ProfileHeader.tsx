"use client";

import { useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface ProfileHeaderProps {
  currentAvatar: string | null | undefined;
  currentBackground: string | null | undefined;
  isUploading: boolean;
  isDeleting: "avatar" | "background" | null;
  firstName?: string;
  lastName?: string;
  handleAvatarClick: () => void;
  handleBackgroundClick: () => void;
  handleDeleteImage: (type: "avatar" | "background") => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background",
  ) => void;
  handleCloseButtonClick: (e: React.MouseEvent) => void;
}

export function ProfileHeader({
  currentAvatar,
  currentBackground,
  isUploading,
  isDeleting,
  firstName,
  lastName,
  handleAvatarClick,
  handleBackgroundClick,
  handleDeleteImage,
  handleFileChange,
  handleCloseButtonClick,
}: ProfileHeaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
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

      {/* Cover/Background Image */}
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
                    alt={`${firstName || ""} ${lastName || ""}`}
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-3xl font-bold rounded-full">
                  {firstName?.charAt(0) || ""}
                  {lastName?.charAt(0) || ""}
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
  );
}
