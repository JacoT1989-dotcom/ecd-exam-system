"use client";
import { useEffect, useState } from "react";
import { useSession } from "../../SessionProvider";
import UnavailableExamModal from "./UnavailableExamModal";
import LanguageSelectionModal from "./LanguageSelectionModal";
import { Subject, TimeRemaining } from "./types";
import ExamCard from "./ExamCard";

const StudentWelcome = () => {
  const { user } = useSession();
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Current date to set fixed exam dates
  const baseDate = new Date();

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
      ), // Mar 9, 08:07 PM
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
      ), // Mar 12, 08:07 PM
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Life Orientation",
      code: "LIFE",
      description: "Life Orientation",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        9,
        7,
        0,
      ), // Mar 7, 09:07 PM (today)
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
      ), // Mar 8, 08:07 AM
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
      ), // Mar 10, 08:07 PM
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
      ), // Mar 14, 08:07 PM
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
      ), // Mar 11, 08:07 PM
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
      ), // Mar 13, 08:07 PM
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
    // Return default values if currentTime is not set yet
    if (!currentTime) {
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

  // Handle exam card click
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

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#3e6788] mb-2">
          {greeting}, {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-2">
          Welcome to your examination dashboard. Below you&apos;ll find all your
          upcoming exams.
        </p>
        <p className="text-sm text-gray-500">
          Exams will become available for writing when the timer reaches zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject: Subject) => {
          const timeRemaining = calculateTimeRemaining(subject.examDate);
          const timeDisplay = isClient
            ? formatTimeRemaining(timeRemaining)
            : "Loading...";
          const isAvailable = timeRemaining.isAvailable;
          const examDateDisplay = formatExamDate(subject.examDate);

          return (
            <ExamCard
              key={subject.id}
              subject={subject}
              isAvailable={isAvailable}
              timeDisplay={timeDisplay}
              examDateDisplay={examDateDisplay}
              onExamClick={handleExamClick}
            />
          );
        })}
      </div>

      {/* Unavailable Exam Modal */}
      {showUnavailableModal && selectedSubject && (
        <UnavailableExamModal
          subject={selectedSubject}
          formatExamDate={formatExamDate}
          onClose={() => setShowUnavailableModal(false)}
        />
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && selectedSubject && (
        <LanguageSelectionModal
          subject={selectedSubject}
          onClose={() => setShowLanguageModal(false)}
        />
      )}
    </div>
  );
};

export default StudentWelcome;
