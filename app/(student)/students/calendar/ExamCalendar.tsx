"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight, Calendar, RefreshCw } from "lucide-react";
import { useSession } from "../../SessionProvider";
import { Subject } from "../../_components/(exam_card_timers)/types";
import {
  fetchStudentSubjects,
  refreshSubjectsData,
} from "../../_components/(exam_card_timers)/fetch-subjects";
import LanguageSelectionModal from "../../_components/(exam_card_timers)/LanguageSelectionModal";
import UnavailableExamModal from "../../_components/(exam_card_timers)/UnavailableExamModal";

// Utility functions
const getColorValue = (colorClass: string): string => {
  // Extract color from Tailwind class (e.g., "bg-blue-500" -> "#3b82f6")
  const colorMap: Record<string, string> = {
    "bg-blue-500": "#3b82f6",
    "bg-purple-500": "#a855f7",
    "bg-green-500": "#22c55e",
    "bg-yellow-500": "#eab308",
    "bg-indigo-500": "#6366f1",
    "bg-pink-500": "#ec4899",
    "bg-red-500": "#ef4444",
    "bg-teal-500": "#14b8a6",
    "bg-orange-500": "#f97316",
    "bg-emerald-500": "#10b981",
    "bg-sky-500": "#0ea5e9",
    "bg-cyan-500": "#06b6d4",
    "bg-amber-500": "#f59e0b",
    "bg-lime-500": "#84cc16",
    "bg-green-600": "#16a34a",
    "bg-rose-500": "#f43f5e",
    "bg-violet-500": "#8b5cf6",
    "bg-fuchsia-500": "#d946ef",
    "bg-blue-600": "#2563eb",
    "bg-purple-600": "#9333ea",
    "bg-gray-500": "#6b7280",
  };

  return colorMap[colorClass] || "#6b7280"; // Default to gray
};

const formatMonth = (date: Date): string => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatExamDate = (date: Date | null): string => {
  if (!date) return "Not scheduled";

  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = formatTime(date);

  return `${month} ${day}, ${year} at ${time}`;
};

// Adjust for SAST (UTC+2)
const adjustForSAST = (date: Date): Date => {
  const adjusted = new Date(date);
  adjusted.setHours(adjusted.getHours() - 2);
  return adjusted;
};

const ExamCalendar = () => {
  // State variables
  const { user } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedExam, setSelectedExam] = useState<Subject | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch subjects on component mount
  useEffect(() => {
    const loadSubjects = async () => {
      setIsLoading(true);
      try {
        const result = await fetchStudentSubjects();
        if (result.subjects) {
          setSubjects(result.subjects);
        }
        if (result.error) {
          setFetchError(result.error);
        }
      } catch (error) {
        setFetchError("Failed to load subjects. Please try again.");
        console.error("Error loading subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Calendar utility functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Handle exam selection and modal display
  const handleExamClick = (subject: Subject, event?: React.MouseEvent) => {
    // Prevent event propagation if event is provided
    if (event) {
      event.stopPropagation();
    }

    setSelectedExam(subject);

    // Check if exam is available
    const isAvailable = isExamAvailable(subject);

    if (isAvailable && user) {
      setShowLanguageModal(true);
    } else {
      setShowModal(true);
    }
  };

  // Check if an exam is available
  const isExamAvailable = (subject: Subject): boolean => {
    if (!subject.isActive) {
      return false;
    }

    // If exam is not scheduled, it can't be available
    if (!subject.isScheduled) {
      return false;
    }

    const now = new Date().getTime();

    if (!subject.startingTime || !subject.dueTime) {
      // If examDate is null, the exam can't be available
      return subject.examDate ? now >= subject.examDate.getTime() : false;
    }

    const startTimeMs = adjustForSAST(new Date(subject.startingTime)).getTime();
    const dueTimeMs = adjustForSAST(new Date(subject.dueTime)).getTime();

    return now >= startTimeMs && now <= dueTimeMs;
  };

  // Refresh subjects data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshSubjectsData();
      if (result.subjects) {
        setSubjects(result.subjects);
      }
      if (result.error) {
        setFetchError(result.error);
      }
    } catch (error) {
      setFetchError("Failed to refresh subjects. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format exam date for display in modal
  const formatModalExamDate = (subject: Subject): string => {
    // For unscheduled exams
    if (!subject.isScheduled) {
      return "Not scheduled yet";
    }

    if (!subject.startingTime || !subject.dueTime) {
      return formatExamDate(subject.examDate);
    }

    const startTime = adjustForSAST(new Date(subject.startingTime));
    const dueTime = adjustForSAST(new Date(subject.dueTime));

    const month = startTime.toLocaleString("en-ZA", { month: "long" });
    const day = startTime.getDate();
    const year = startTime.getFullYear();

    const startHour = startTime.getHours();
    const startMinute = String(startTime.getMinutes()).padStart(2, "0");
    const startPeriod = startHour >= 12 ? "PM" : "AM";
    const displayStartHour = startHour % 12 || 12;

    const dueHour = dueTime.getHours();
    const dueMinute = String(dueTime.getMinutes()).padStart(2, "0");
    const duePeriod = dueHour >= 12 ? "PM" : "AM";
    const displayDueHour = dueHour % 12 || 12;

    return `${month} ${day}, ${year} - ${displayStartHour}:${startMinute} ${startPeriod} to ${displayDueHour}:${dueMinute} ${duePeriod}`;
  };

  // Function to get the date in short format for display in upcoming exams
  const getShortDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Build calendar days
  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-28 border p-1 bg-gray-50"></div>,
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();

      // Check if this date has exams
      const examsOnDay = subjects.filter((subject) => {
        if (!subject.examDate) return false;

        const examDate = new Date(subject.examDate);
        return (
          examDate.getFullYear() === date.getFullYear() &&
          examDate.getMonth() === date.getMonth() &&
          examDate.getDate() === date.getDate()
        );
      });

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-28 border p-1.5 ${isToday ? "bg-cyan-50 border-[#3e6788]" : "hover:bg-gray-50"}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span
              className={`font-semibold text-sm ${isToday ? "text-[#3e6788] bg-cyan-100 w-6 h-6 flex items-center justify-center rounded-full" : ""}`}
            >
              {day}
            </span>
            {examsOnDay.length > 0 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {examsOnDay.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
            {examsOnDay.map((exam) => (
              <div
                key={exam.id}
                className="text-xs p-1.5 rounded text-white truncate cursor-pointer hover:opacity-90 transition-opacity flex items-center"
                style={{ backgroundColor: getColorValue(exam.color) }}
                onClick={(e) => handleExamClick(exam, e)}
              >
                <span className="truncate">{exam.name}</span>
              </div>
            ))}
          </div>
        </div>,
      );
    }

    return days;
  };

  // Loading state
  if (isLoading) {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto max-w-6xl">
      {/* Calendar Header */}
      <div className="bg-[#3e6788] text-white p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 hidden sm:block" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Exam Calendar</h1>
              <p className="text-xs md:text-sm mt-1 text-white/80">
                View your upcoming exams and manage your study schedule
              </p>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-[#3e6788] rounded hover:bg-gray-100 transition duration-150 flex items-center text-sm font-medium disabled:opacity-70"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-3 bg-red-100 border-b border-red-300">
          <p className="text-red-700 text-sm">{fetchError}</p>
        </div>
      )}

      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg md:text-xl font-bold text-[#3e6788]">
            {formatMonth(currentDate)}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center text-sm transition duration-150"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-[#3e6788] text-white rounded hover:bg-[#2d4d66] text-sm transition duration-150"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center text-sm transition duration-150"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs md:text-sm font-medium text-gray-700 border-b border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">{buildCalendarDays()}</div>
      </div>

      {/* Upcoming Exams Section */}
      <div className="p-4 border-t bg-gray-50">
        <h3 className="font-bold text-[#3e6788] mb-3 text-md md:text-lg">
          Upcoming Exams
        </h3>
        {subjects.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No exams scheduled at this time.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects
              .filter((subject) => {
                if (!subject.examDate) return false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const examDate = new Date(subject.examDate);
                examDate.setHours(0, 0, 0, 0);
                return examDate >= today;
              })
              .sort((a, b) => {
                if (!a.examDate || !b.examDate) return 0;
                return (
                  new Date(a.examDate).getTime() -
                  new Date(b.examDate).getTime()
                );
              })
              .slice(0, 8) // Limit to 8 upcoming exams
              .map((subject) => (
                <div
                  key={subject.id}
                  className="p-3 rounded cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 text-white"
                  style={{ backgroundColor: getColorValue(subject.color) }}
                  onClick={(e) => handleExamClick(subject, e)}
                >
                  <div className="font-semibold">{subject.name}</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                      {subject.code}
                    </div>
                    <div className="text-xs">
                      {subject.examDate
                        ? getShortDate(subject.examDate)
                        : "Not scheduled"}
                    </div>
                  </div>
                  {subject.examDate && (
                    <div className="text-xs font-medium mt-1.5 text-white/90">
                      {formatTime(subject.examDate)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Exam Details Modal */}
      {showModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b bg-[#3e6788] text-white rounded-t-lg">
              <h3 className="text-lg font-bold">Exam Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div
                className="w-full p-4 mb-4 rounded-lg text-white"
                style={{ backgroundColor: getColorValue(selectedExam.color) }}
              >
                <div className="text-2xl font-bold">{selectedExam.name}</div>
                <div className="text-sm mt-1 flex items-center bg-white/20 w-fit px-2 py-0.5 rounded">
                  {selectedExam.code}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Description</div>
                <div className="font-medium">{selectedExam.description}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                <div className="font-medium">
                  {formatModalExamDate(selectedExam)}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="font-medium flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      !selectedExam.isScheduled
                        ? "bg-gray-400"
                        : isExamAvailable(selectedExam)
                          ? "bg-green-500"
                          : selectedExam.examDate &&
                              new Date() > new Date(selectedExam.examDate)
                            ? "bg-red-500"
                            : "bg-blue-500"
                    }`}
                  ></span>
                  {!selectedExam.isScheduled
                    ? "Not scheduled yet"
                    : isExamAvailable(selectedExam)
                      ? "Available now"
                      : selectedExam.examDate &&
                          new Date() > new Date(selectedExam.examDate)
                        ? "Expired"
                        : "Upcoming"}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                {isExamAvailable(selectedExam) && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowLanguageModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Start Exam
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#3e6788] text-white rounded hover:bg-[#2d4d66] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && selectedExam && (
        <LanguageSelectionModal
          subject={selectedExam}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Unavailable Exam Modal */}
      {showUnavailableModal && selectedExam && (
        <UnavailableExamModal
          subject={selectedExam}
          formatExamDate={formatModalExamDate}
          onClose={() => setShowUnavailableModal(false)}
        />
      )}
    </div>
  );
};

export default ExamCalendar;
