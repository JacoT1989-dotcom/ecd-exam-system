import React from "react";
import { Suspense } from "react";
import {
  getAllSubjectsWithDates,
  getSubjectsWithMissingDates,
  getUniqueSubjectCodes,
} from "./bulk-update-codes";
import SubjectSchedulingDashboard from "./SubjectSchedulingDashboard";

export const dynamic = "force-dynamic";

async function AdminSubjectsPage() {
  // Fetch data for the page
  const subjectCodesResult = await getUniqueSubjectCodes();
  const allSubjectsResult = await getAllSubjectsWithDates();
  const missingDatesResult = await getSubjectsWithMissingDates();

  // Handle any errors
  if (
    subjectCodesResult.error ||
    allSubjectsResult.error ||
    missingDatesResult.error
  ) {
    return (
      <div className="container mx-auto py-10">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {subjectCodesResult.error ||
              allSubjectsResult.error ||
              missingDatesResult.error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Exam Schedule Administration
      </h1>

      <SubjectSchedulingDashboard
        uniqueSubjectCodes={subjectCodesResult.subjectCodes || []}
        allSubjects={allSubjectsResult.subjects || []}
        subjectsWithMissingDates={missingDatesResult.subjects || []}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-10">Loading...</div>}
    >
      <AdminSubjectsPage />
    </Suspense>
  );
}
