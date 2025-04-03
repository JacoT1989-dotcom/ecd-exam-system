"use client";
import { useEffect, useState } from "react";
import { useSession } from "../../SessionProvider";
import LanguageSelectionModal from "../../_components/(exam_card_timers)/LanguageSelectionModal";
import UnavailableExamModal from "../../_components/(exam_card_timers)/UnavailableExamModal";

// Define types locally in this file
interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  examDate: Date;
  color: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAvailable: boolean;
}

const ExamKanbanBoard = () => {
  const { user } = useSession();
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [completedExams, setCompletedExams] = useState<number[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    // Initially, no exams are completed
    setCompletedExams([]);
  }, []);

  // Current date to set fixed exam dates
  const baseDate = new Date();

  // Force the Life Orientation date to be in the past to make it available
  const lifeOrientationDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() - 1, // yesterday
    9,
    7,
    0,
  );

  // Dummy subject data with FIXED exam dates
  const subjects: Subject[] = [
    {
      id: 1,
      name: "Mathematics",
      code: "MTH301",
      description: "Advanced Calculus and Linear Algebra",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 2,
        8,
        7,
        0,
      ),
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Physics",
      code: "PHY201",
      description: "Classical Mechanics and Electromagnetism",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 5,
        8,
        7,
        0,
      ),
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Life Orientation",
      code: "LIFE",
      description: "Life Orientation",
      examDate: lifeOrientationDate, // Make it already available
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Biology",
      code: "BIO101",
      description: "Introduction to Molecular Biology",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 1,
        8,
        7,
        0,
      ),
      color: "bg-yellow-500",
    },
    {
      id: 5,
      name: "Chemistry",
      code: "CHM202",
      description: "Organic Chemistry",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 3,
        8,
        7,
        0,
      ),
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "History",
      code: "HIS305",
      description: "Modern World History",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 7,
        8,
        7,
        0,
      ),
      color: "bg-indigo-500",
    },
    {
      id: 7,
      name: "Literature",
      code: "LIT201",
      description: "Contemporary Fiction Analysis",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 4,
        8,
        7,
        0,
      ),
      color: "bg-pink-500",
    },
    {
      id: 8,
      name: "Economics",
      code: "ECO301",
      description: "Macroeconomics and Financial Markets",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 6,
        8,
        7,
        0,
      ),
      color: "bg-teal-500",
    },
  ];

  // Update current time every second to keep timers accurate - but only after initial render
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, [isClient]);

  // Function to calculate remaining time until exam
  const calculateTimeRemaining = (examDate: Date): TimeRemaining => {
    // If not on client yet, return a default state to prevent hydration errors
    if (!isClient) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: false };
    }

    const difference = examDate.getTime() - currentTime.getTime();

    // Return zeros if the exam date is in the past
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: true };
    }

    // Calculate time units
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    // Calculate remaining units (traditional countdown style)
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isAvailable: false };
  };

  // Format time remaining as HH:MM:SS with days in brackets
  const formatTimeRemaining = (timeObj: TimeRemaining): string => {
    if (!isClient) {
      return "Loading..."; // Only show a placeholder during server rendering
    }

    if (timeObj.isAvailable) {
      return "Available now";
    }

    // Format as HH:MM:SS for display
    const formattedTime = [
      String(timeObj.hours).padStart(2, "0"),
      String(timeObj.minutes).padStart(2, "0"),
      String(timeObj.seconds).padStart(2, "0"),
    ].join(":");

    // Calculate total hours including days
    const totalHours = timeObj.hours + timeObj.days * 24;

    // Add days in brackets if there are any
    return timeObj.days > 0
      ? `${totalHours}:${String(timeObj.minutes).padStart(2, "0")}:${String(timeObj.seconds).padStart(2, "0")} (${timeObj.days} days)`
      : formattedTime;
  };

  // Format exam date for display
  const formatExamDate = (date: Date): string => {
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${month} ${day}, ${displayHour}:${minute} ${period}`;
  };

  // Handle clicking on an exam card
  const handleExamClick = (subject: Subject): void => {
    const timeRemaining = calculateTimeRemaining(subject.examDate);
    setSelectedSubject(subject);

    if (timeRemaining.isAvailable && user) {
      // Show language selection modal for available exams
      setShowLanguageModal(true);
    } else {
      // Show unavailable modal for unavailable exams
      setShowUnavailableModal(true);
    }
  };

  // Function to organize subjects into kanban columns
  const organizeSubjects = () => {
    const notAvailable: Subject[] = [];
    const inProgress: Subject[] = [];
    const completed: Subject[] = [];

    subjects.forEach((subject) => {
      const timeRemaining = calculateTimeRemaining(subject.examDate);

      if (completedExams.includes(subject.id)) {
        completed.push(subject);
      } else if (timeRemaining.isAvailable) {
        inProgress.push(subject);
      } else {
        notAvailable.push(subject);
      }
    });

    // Sort not available by closest exam date first
    notAvailable.sort((a, b) => a.examDate.getTime() - b.examDate.getTime());

    return { notAvailable, inProgress, completed };
  };

  const { notAvailable, inProgress, completed } = organizeSubjects();

  // Render an exam card
  const renderExamCard = (subject: Subject) => {
    const timeRemaining = calculateTimeRemaining(subject.examDate);
    const isAvailable =
      timeRemaining.isAvailable && !completedExams.includes(subject.id);
    const isCompleted = completedExams.includes(subject.id);
    const timeDisplay = isCompleted
      ? "Completed"
      : formatTimeRemaining(timeRemaining);
    const examDateDisplay = formatExamDate(subject.examDate);

    return (
      <div
        key={subject.id}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
        onClick={() => handleExamClick(subject)}
      >
        <div className={`${subject.color} h-1.5 w-full`}></div>
        <div className="p-3 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {subject.name}
            </h3>
            <span className="text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">
              {subject.code}
            </span>
          </div>

          <p className="text-gray-600 text-xs mb-2 line-clamp-1">
            {subject.description}
          </p>

          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-xs mb-2">
            <span className="font-medium text-gray-500">Exam time:</span>
            <span className="font-medium text-right">{examDateDisplay}</span>

            <span className="font-medium text-gray-500">Status:</span>
            <span
              className={`font-bold text-right ${isCompleted ? "text-gray-600" : isAvailable ? "text-green-600" : "text-blue-600"}`}
            >
              {timeDisplay}
            </span>
          </div>

          <div className="h-7 flex items-center justify-center">
            {isCompleted ? (
              <div className="w-full py-1 px-2 rounded text-xs font-medium text-center bg-gray-200 text-gray-700">
                Exam Completed
              </div>
            ) : isAvailable ? (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click from triggering
                  handleExamClick(subject);
                }}
                className="w-full py-1 px-2 rounded text-xs font-medium text-center bg-[#3e6788] hover:bg-[#2d4d66] text-white transition-colors duration-300"
              >
                Start Exam
              </button>
            ) : (
              <div className="w-full py-1 px-2 rounded text-xs font-medium text-center bg-gray-100 text-gray-400">
                Not Yet Available
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render a Kanban column
  const renderColumn = (
    title: string,
    subjects: Subject[],
    bgColor: string,
  ) => (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-md p-3 min-h-[400px]">
      <div
        className={`${bgColor} text-white text-base font-bold py-1.5 px-3 rounded-t-lg mb-3 shadow-sm`}
      >
        {title} ({subjects.length})
      </div>
      <div className="flex-grow space-y-2.5 overflow-y-auto">
        {subjects.map((subject) => renderExamCard(subject))}
        {subjects.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No exams in this category
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#3e6788] mb-2">
          {greeting}, {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-2">
          Welcome to your examination dashboard. Below you&apos;ll find all your
          exams organized by status.
        </p>
        <p className="text-sm text-gray-500">
          Exams will move to &quot;In Progress&quot; when the timer reaches zero
          and can be started.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderColumn("Not Available Yet", notAvailable, "bg-blue-600")}
        {renderColumn("In Progress", inProgress, "bg-green-600")}
        {renderColumn("Completed", completed, "bg-gray-600")}
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && selectedSubject && (
        <LanguageSelectionModal
          subject={selectedSubject}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Unavailable Exam Modal */}
      {/* {showUnavailableModal && selectedSubject && (
        <UnavailableExamModal
          subject={selectedSubject}
          formatExamDate={formatExamTimeWindow}
          onClose={() => setShowUnavailableModal(false)}
        />
      )} */}
    </div>
  );
};

export default ExamKanbanBoard;
