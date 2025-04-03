// This file should be saved as app/dashboard/page.tsx
import { fetchStudentSubjects } from "../_components/(exam_card_timers)/fetch-subjects";
import StudentWelcome from "../_components/(exam_card_timers)/StudentWelcome";
import { Suspense } from "react";

// Loading skeleton component (Client Component)
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// This is a Server Component that fetches data
async function StudentWelcomeWrapper() {
  // Fetch subjects from the server
  const { subjects, error } = await fetchStudentSubjects();

  // Pass data to the client component
  return <StudentWelcome subjects={subjects || []} fetchError={error} />;
}

// The main page component (Server Component)
export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Main content area */}
      <div className="container mx-auto">
        {/* Use Suspense for loading states */}
        <Suspense fallback={<DashboardSkeleton />}>
          <StudentWelcomeWrapper />
        </Suspense>
      </div>

      {/* Professional footer */}
      <footer className="py-4 bg-[#3e6788] text-white mt-6 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <p className="text-sm">
                © {new Date().getFullYear()} Department of Education. All
                rights reserved.
              </p>
            </div>
            <div className="text-sm">
              <span className="mx-2">Privacy Policy</span>
              <span className="mx-2">|</span>
              <span className="mx-2">Terms of Service</span>
              <span className="mx-2">|</span>
              <span className="mx-2">Help</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
