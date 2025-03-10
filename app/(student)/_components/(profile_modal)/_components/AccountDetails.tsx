"use client";

interface AccountDetailsProps {
  username?: string;
  role?: string;
}

export function AccountDetails({ username, role }: AccountDetailsProps) {
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
    <div className="bg-gray-50 p-3 rounded-lg flex-1">
      <h3 className="text-sm font-semibold mb-2 text-gray-800">
        Account Details
      </h3>
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-lg">👤</span>
          <div>
            <p className="text-xs text-gray-500">Username</p>
            <p className="text-xs text-gray-800">{username}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-lg">🏫</span>
          <div>
            <p className="text-xs text-gray-500">Role</p>
            <p className="text-xs text-gray-800">{formatRole(role)}</p>
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
  );
}
