"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ExamTabs } from "./_components/ExamTabs";
import ExamTimer from "./_components/ExamTimer";

const LifeOrientationExamPage = () => {
  // Get URL parameters
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName") || "";
  const subjectCode = searchParams.get("subjectCode") || "";

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 ">
        <h1 className="text-3xl font-bold text-center">
          {subjectName
            ? `${subjectName} Examination`
            : "Life Orientation Examination"}
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Complete all five sections of the examination. Your progress will be
          saved automatically.
        </p>

        {subjectName && <ExamTimer />}
      </div>

      <ExamTabs subjectName={subjectName} subjectCode={subjectCode} />
    </div>
  );
};

export default LifeOrientationExamPage;
