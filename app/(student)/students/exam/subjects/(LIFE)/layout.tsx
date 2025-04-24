"use client";
import React, { useState, useEffect, createContext } from "react";
import { useSearchParams } from "next/navigation";
import ScientificCalculator from "@/app/(student)/students/calculator/Calculator";
import { fetchLife101SubjectDetails } from "./Life-Sciences-eng/actions";
import ExamTimer from "./Life-Sciences-eng/_components/ExamTimer";
import ExamToolbar from "./Life-Sciences-eng/_exam-modals/ExamToolbar";
import WritingPad from "./Life-Sciences-eng/_components/WritingPad";

// Define the context interface
interface ExamProgressContextType {
  progressData: {
    overall: { completed: number; total: number };
    sections: Array<{ name: string; completed: number; total: number }>;
  };
  updateProgress: (data: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  examTitle: string;
  examGrade: number;
  setExamGrade: (grade: number) => void;
}

// Create a context to share exam progress state
export const ExamProgressContext = createContext<ExamProgressContextType>({
  progressData: {
    overall: { completed: 0, total: 50 },
    sections: [
      { name: "Section 1", completed: 0, total: 10 },
      { name: "Section 2", completed: 0, total: 10 },
      { name: "Section 3", completed: 0, total: 10 },
      { name: "Section 4", completed: 0, total: 10 },
      { name: "Section 5", completed: 0, total: 10 },
    ],
  },
  updateProgress: () => {},
  activeTab: "section1",
  setActiveTab: () => {},
  examTitle: "Life Orientation Exam",
  examGrade: 12,
  setExamGrade: () => {},
});

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName") || "";
  const subjectCode = searchParams.get("subjectCode") || "";

  // State for calculator modal
  const [showCalculator, setShowCalculator] = useState(false);
  // State for writing pad modal
  const [showWritingPad, setShowWritingPad] = useState(false);
  // State for subject details
  const [subjectDetails, setSubjectDetails] = useState<any>(null);
  const [examId, setExamId] = useState<string | null>(null);
  // Track sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Set a default exam title that is never editable
  const examTitle =
    subjectName && subjectCode
      ? `${subjectName} ${subjectCode} Exam`
      : "Life Orientation Exam";

  // State for exam grade (still editable)
  const [examGrade, setExamGrade] = useState(12);

  // State for exam progress
  const [progressData, setProgressData] = useState({
    overall: { completed: 0, total: 50 },
    sections: [
      { name: "Section 1", completed: 0, total: 10 },
      { name: "Section 2", completed: 0, total: 10 },
      { name: "Section 3", completed: 0, total: 10 },
      { name: "Section 4", completed: 0, total: 10 },
      { name: "Section 5", completed: 0, total: 10 },
    ],
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState("section1");

  // Function to update progress data
  const updateProgress = (data: any) => {
    setProgressData(data);
  };

  // Call the server action when the layout loads
  useEffect(() => {
    const loadSubjectDetails = async () => {
      try {
        const result = await fetchLife101SubjectDetails();
        if (result.success && result.subject) {
          setSubjectDetails(result.subject);
          if (result.examId) {
            setExamId(result.examId);
          }
        }
      } catch (error) {
        console.error("Error calling fetchLife101SubjectDetails:", error);
      }
    };

    loadSubjectDetails();
  }, []);

  // Check sidebar state from localStorage and listen for custom events
  useEffect(() => {
    // Initial check from localStorage
    const storedState = localStorage.getItem("sidebarCollapsed");
    setIsSidebarCollapsed(storedState === "true");

    // Define a custom event handler for immediate sidebar state changes
    const handleSidebarChange = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.isCollapsed);
    };

    // Add event listener for our custom event
    window.addEventListener(
      "sidebarStateChanged",
      handleSidebarChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "sidebarStateChanged",
        handleSidebarChange as EventListener,
      );
    };
  }, []);

  // Toggle calculator modal
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  // Toggle writing pad modal
  const toggleWritingPad = () => {
    setShowWritingPad(!showWritingPad);
  };

  useEffect(() => {
    // Add a class to the main-content element to create space for our fixed header
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.classList.add("exam-page-padding");
    }

    // Add custom style for exam page padding (increased to accommodate progress bars)
    const style = document.createElement("style");
    style.innerHTML = `
        .exam-page-padding {
          padding-top: 330px !important;
        }
      `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      if (mainContent) {
        mainContent.classList.remove("exam-page-padding");
      }
      document.head.removeChild(style);
    };
  }, []);

  // Calculate the sidebar width based on collapsed state
  const sidebarWidth = isSidebarCollapsed ? "64px" : "320px";

  return (
    <ExamProgressContext.Provider
      value={{
        progressData,
        updateProgress,
        activeTab,
        setActiveTab,
        examTitle,
        examGrade,
        setExamGrade,
      }}
    >
      {/* Fixed Header - that respects the parent layout's navbar and sidebar */}
      <div
        className="fixed z-40 bg-gray-100 shadow-md p-6 transition-all duration-300 ease-in-out"
        style={{
          top: "64px", // Height of the navbar
          left: sidebarWidth, // Width of the sidebar (responsive)
          right: "0",
          width: `calc(100% - ${sidebarWidth})`,
        }}
      >
        {/* Timer and exam info section - 2 columns */}
        <div className="flex justify-center items-center gap-20 mb-4">
          {/* Left column - Title and Form Fields */}
          <div className="flex flex-col w-[520px]">
            {" "}
            {/* Fixed width container */}
            <h1 className="text-2xl font-bold mb-4 w-full text-center">
              Life Orientation Exam (LIFE101)
            </h1>
            <div className="flex justify-center items-center gap-4 w-full mt-5">
              <div className="w-64">
                <label
                  htmlFor="examTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Exam Title
                </label>
                <input
                  id="examTitle"
                  type="text"
                  value={examTitle}
                  className="w-full rounded-md border border-input px-3 py-2 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="w-32">
                <label
                  htmlFor="examGrade"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Grade
                </label>
                <select
                  id="examGrade"
                  value={examGrade}
                  onChange={(e) => setExamGrade(parseInt(e.target.value))}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value={12}>Grade 12</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right column - Timer and tools */}
          <div className="flex flex-col items-center">
            <ExamTimer
              subjectDetails={subjectDetails}
              examId={examId}
              fetchSubjectDetails={fetchLife101SubjectDetails}
            />
            <ExamToolbar
              toggleCalculator={toggleCalculator}
              toggleWritingPad={toggleWritingPad}
            />
          </div>
        </div>

        {/* Exam Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-4">
          <h3 className="font-medium mb-4">Exam Progress</h3>
          <div className="space-y-4">
            {/* Section breakdown with button styling */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {progressData.sections.map((section, index) => {
                const sectionId = `section${index + 1}`;
                const isActive = activeTab === sectionId;
                // Determine progress bar color based on completion count
                const progressBarColor =
                  section.completed >= 5 ? "bg-green-500" : "bg-red-500";

                return (
                  <button
                    key={section.name}
                    className={`text-center p-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-[#3e6788] text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      // Directly call the setActiveTab function in the context
                      if (setActiveTab) {
                        setActiveTab(sectionId);
                      }
                    }}
                  >
                    <p
                      className={`text-sm font-medium mb-1 ${isActive ? "text-white" : "text-gray-700"}`}
                    >
                      {section.name}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className={`${progressBarColor} h-1.5 rounded-full`}
                        style={{
                          width: `${Math.round((section.completed / section.total) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p
                      className={`text-xs ${isActive ? "text-gray-100" : "text-gray-500"}`}
                    >
                      {section.completed}/{section.total}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - will be pushed down by our padding in the useEffect */}
      <div className="container mx-auto pb-6 pt-4">{children}</div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#2c4a63] rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex justify-end items-center bg-[#3e6788] text-white p-4 rounded-t-lg">
              <button
                onClick={toggleCalculator}
                className="text-white bg-[#2c4a63] hover:bg-[#1c3952] rounded-md p-2 focus:outline-none"
              >
                Close
              </button>
            </div>
            <div className="p-5">
              <ScientificCalculator />
            </div>
          </div>
        </div>
      )}

      {/* Writing Pad Modal */}
      {showWritingPad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex justify-end items-center bg-[#3e6788] text-white p-4 rounded-t-lg">
              <button
                onClick={toggleWritingPad}
                className="text-white bg-[#2c4a63] hover:bg-[#1c3952] rounded-md p-2 focus:outline-none"
              >
                Close
              </button>
            </div>
            <div className="p-5 bg-white">
              <WritingPad
                height={500}
                placeholder="Write or sketch something..."
              />
            </div>
          </div>
        </div>
      )}
    </ExamProgressContext.Provider>
  );
}
