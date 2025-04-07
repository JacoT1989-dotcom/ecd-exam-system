"use client";

import { useEffect, useState } from "react";
import ExamKanbanBoard from "./ExamKanbanBoard";
import { Suspense } from "react";

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((column) => (
          <div
            key={column}
            className="flex flex-col bg-gray-50 rounded-lg shadow-md p-3 min-h-[400px]"
          >
            <div className="bg-gray-200 h-8 rounded-t-lg mb-3"></div>
            <div className="space-y-2.5">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="bg-white rounded-lg shadow p-3 animate-pulse"
                >
                  <div className="h-1.5 bg-gray-200 w-full rounded mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-7 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Page = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This will only run on the client, after hydration
    setIsHydrated(true);
  }, []);

  return (
    <div className="py-6 min-h-screen bg-gray-100">
      {/* Use Suspense for loading states */}
      {!isHydrated ? (
        <DashboardSkeleton />
      ) : (
        <Suspense fallback={<DashboardSkeleton />}>
          <ExamKanbanBoard />
        </Suspense>
      )}

      {/* Professional footer */}
      <footer className="py-4 bg-[#3e6788] text-white mt-6 rounded-lg mx-4">
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
};

export default Page;
