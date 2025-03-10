"use client";

interface ProfileInfoProps {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}

export function ProfileInfo({
  displayName,
  firstName,
  lastName,
  username,
  role,
}: ProfileInfoProps) {
  // Helper function to format role in a more readable way
  const formatRole = (role?: string) => {
    if (!role) return "";

    // Convert SNAKE_CASE to Title Case
    return role
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {displayName || `${firstName || ""} ${lastName || ""}`}
        </h2>
        <p className="text-gray-500 text-sm">@{username}</p>
        <p className="text-xs text-gray-600 font-medium">{formatRole(role)}</p>
      </div>
    </div>
  );
}
