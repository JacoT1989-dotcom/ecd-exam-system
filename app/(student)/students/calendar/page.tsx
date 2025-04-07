"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import ExamCalendar from "./ExamCalendar";

// Loading skeleton for the calendar
function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto max-w-6xl animate-pulse">
      <div className="bg-gray-300 h-24 p-5"></div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-gray-300 w-40 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-300 w-24 rounded"></div>
            <div className="h-10 bg-gray-300 w-20 rounded"></div>
            <div className="h-10 bg-gray-300 w-24 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded"></div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {Array(35)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-28 bg-gray-300 rounded"></div>
            ))}
        </div>
      </div>
    </div>
  );
}

const CalendarPage = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This will only run on the client, after hydration
    setIsHydrated(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Main calendar area */}
      {!isHydrated ? (
        <CalendarSkeleton />
      ) : (
        <Suspense fallback={<CalendarSkeleton />}>
          <ExamCalendar />
        </Suspense>
      )}

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
};

export default CalendarPage;
