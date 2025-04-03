// app/system-admin/assessment/exams/schedule/page.tsx
import { Suspense } from "react";
import { fetchAllSubjectCodes, getAllSubjectExamSettings } from "./exam-timers";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import { UserRole } from "@prisma/client";
import SubjectsTable from "./SubjectsTable";
import { type SubjectCode } from "./exam-timers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This is a server component, so it can be async
export default async function SubjectsSchedulePage() {
  // Server-side authentication check
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login?callbackUrl=/system-admin/assessment/exams/schedule");
  }

  if (user.role !== UserRole.SYSTEM_ADMINISTRATOR) {
    redirect("/dashboard");
  }

  try {
    // Fetch subject codes and settings in parallel
    const [subjectCodesResult, settingsResult] = await Promise.all([
      fetchAllSubjectCodes(),
      getAllSubjectExamSettings(),
    ]);

    if (subjectCodesResult.error || settingsResult.error) {
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{subjectCodesResult.error || settingsResult.error}</p>
          </div>
        </div>
      );
    }

    // Create default settings if none exist to avoid the type error
    const settings =
      settingsResult.settings ||
      ({} as Record<
        SubjectCode,
        {
          examDate: Date;
          startingTime: Date;
          dueTime: Date;
          isExamSubjectActive: boolean;
        }
      >);
    const subjectCodes = subjectCodesResult.subjectCodes || [];

    // Create default values for any missing subject codes
    const now = new Date();
    const defaultExamDate = new Date(now);
    defaultExamDate.setDate(now.getDate() + 30);

    const defaultStartTime = new Date(defaultExamDate);
    defaultStartTime.setHours(9, 0, 0, 0);

    const defaultDueTime = new Date(defaultExamDate);
    defaultDueTime.setHours(12, 0, 0, 0);

    // Ensure we have settings for all subject codes
    const completeSettings: Record<
      SubjectCode,
      {
        examDate: Date;
        startingTime: Date;
        dueTime: Date;
        isExamSubjectActive: boolean;
      }
    > = {} as Record<
      SubjectCode,
      {
        examDate: Date;
        startingTime: Date;
        dueTime: Date;
        isExamSubjectActive: boolean;
      }
    >;

    if (subjectCodes) {
      subjectCodes.forEach((subject) => {
        completeSettings[subject.code] = settings[subject.code] || {
          examDate: defaultExamDate,
          startingTime: defaultStartTime,
          dueTime: defaultDueTime,
          isExamSubjectActive: false,
        };
      });
    }

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#3e6788] mb-6">
          Subject Exam Settings Management
        </h1>

        <div className="mb-6">
          <p className="text-gray-600">
            Manage exam dates and times for all subjects. Changes will apply to
            all students who have these subjects registered.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <SubjectsTable
            subjectCodes={subjectCodes}
            initialSettings={completeSettings}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error in SubjectsSchedulePage:", error);
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>An unexpected error occurred. Please try again later.</p>
        </div>
      </div>
    );
  }
}
