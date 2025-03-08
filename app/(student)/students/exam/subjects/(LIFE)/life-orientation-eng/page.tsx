"use client";

import React from "react";
import { ExamTabs } from "./_components/ExamTabs";

const LifeOrientationExamPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Life Orientation Examination</h1>
        <p className="text-gray-600 mt-2">
          Complete all five sections of the examination. Your progress will be
          saved automatically.
        </p>
      </div>

      <ExamTabs />
    </div>
  );
};

export default LifeOrientationExamPage;
