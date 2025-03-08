"use client";

import StudentWelcome from "../_components/StudentWelcome";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Main content area */}
      <div className="container mx-auto">
        {/* Welcome component */}
        <StudentWelcome />
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
