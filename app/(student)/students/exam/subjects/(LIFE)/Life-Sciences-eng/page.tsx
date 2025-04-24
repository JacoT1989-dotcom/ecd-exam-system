"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { ExamTabs } from "./_components/ExamTabs";
import InnerLayout from "../layout";

const LifeOrientationExamPage = () => {
  // Get URL parameters
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName") || "";
  const subjectCode = searchParams.get("subjectCode") || "";

  return (
    <InnerLayout>
      <ExamTabs subjectName={subjectName} subjectCode={subjectCode} />
    </InnerLayout>
  );
};

export default LifeOrientationExamPage;
