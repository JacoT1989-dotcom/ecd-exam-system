"use client";

// Wait for client-side hydration before rendering
import { useEffect, useState } from "react";
import ExamKanbanBoard from "./ExamKanbanBoard";

const Page = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This will only run on the client, after hydration
    setIsHydrated(true);
  }, []);

  return (
    <div className="py-6">
      {/* Only show a loading indicator until client-side hydration is complete */}
      {!isHydrated ? (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          Loading exam dashboard...
        </div>
      ) : (
        <ExamKanbanBoard />
      )}
    </div>
  );
};

export default Page;
