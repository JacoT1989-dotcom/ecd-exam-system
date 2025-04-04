"use client";

import { useSession } from "@/app/(student)/SessionProvider";

export function AcademicInfo() {
  // Get user data from session
  const { user } = useSession();

  // Use the subjectCount from user data if available, otherwise default to 0
  const subjectCount = user?.subjectCount ?? 0;

  return (
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
            <p className="text-xs text-gray-800">{subjectCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
