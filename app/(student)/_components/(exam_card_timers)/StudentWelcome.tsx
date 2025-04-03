"use client";
import { useEffect, useState } from "react";
import { useSession } from "../../SessionProvider";
import UnavailableExamModal from "./UnavailableExamModal";
import LanguageSelectionModal from "./LanguageSelectionModal";
import { Subject, TimeRemaining } from "./types";
import ExamCard from "./ExamCard";

interface StudentWelcomeProps {
  subjects: Subject[];
  fetchError?: string;
}

const StudentWelcome = ({ subjects, fetchError }: StudentWelcomeProps) => {
  const { user } = useSession();
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Initial setup - runs only once
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Update current time every second to keep timers accurate
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // Function to determine if an exam is currently available
  const isExamAvailable = (subject: Subject): boolean => {
    if (!currentTime || !subject.isActive) {
      return false;
    }

    const now = currentTime.getTime();

    // If no specific times are set, fall back to using exam date
    if (!subject.startingTime || !subject.dueTime) {
      return now >= subject.examDate.getTime();
    }

    // Get times as timestamps for comparison
    const startTimeMs = new Date(subject.startingTime).getTime();
    const dueTimeMs = new Date(subject.dueTime).getTime();

    // Exam is available if current time is between start and due times
    return now >= startTimeMs && now <= dueTimeMs;
  };

  // Function to get the time until a subject's exam
  const getExamTimingInfo = (
    subject: Subject,
  ): {
    timeRemaining: TimeRemaining;
    targetDate: Date;
    isCountingDown: boolean; // true if counting down to start, false if counting down to end
  } => {
    if (!currentTime) {
      return {
        timeRemaining: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isAvailable: false,
        },
        targetDate: new Date(),
        isCountingDown: true,
      };
    }

    const now = currentTime.getTime();

    // Default to exam date if no specific times
    if (!subject.startingTime || !subject.dueTime) {
      const targetDate = new Date(subject.examDate);
      const difference = targetDate.getTime() - now;
      const isAvailable = difference <= 0;

      return {
        timeRemaining: calculateTimeRemaining(targetDate),
        targetDate,
        isCountingDown: true,
      };
    }

    // Get times as Date objects for calculation
    const startTime = new Date(subject.startingTime);
    const dueTime = new Date(subject.dueTime);

    // If before start time, count down to start time
    if (now < startTime.getTime()) {
      return {
        timeRemaining: calculateTimeRemaining(startTime),
        targetDate: startTime,
        isCountingDown: true,
      };
    }

    // If between start and due time, count down to due time
    if (now <= dueTime.getTime()) {
      return {
        timeRemaining: {
          ...calculateTimeRemaining(dueTime),
          isAvailable: true,
        },
        targetDate: dueTime,
        isCountingDown: false,
      };
    }

    // If after due time, exam is over
    return {
      timeRemaining: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isAvailable: false,
      },
      targetDate: dueTime,
      isCountingDown: false,
    };
  };

  // Function to calculate remaining time until target date
  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    if (!currentTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: false };
    }

    // Direct time comparison without UTC conversion
    const difference = targetDate.getTime() - currentTime.getTime();

    // Return zeros if the target date is in the past
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: true };
    }

    // Calculate time units
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    // Calculate remaining units
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isAvailable: false };
  };

  // Format time remaining as HH:MM:SS with days in brackets
  const formatTimeRemaining = (
    timeObj: TimeRemaining,
    isCountingDown: boolean,
    isEnded: boolean,
  ): string => {
    if (isEnded) {
      return "Exam ended";
    }

    if (timeObj.isAvailable) {
      return isCountingDown
        ? "Available now"
        : "Ends in " + formatTimeParts(timeObj);
    }

    return "Starts in " + formatTimeParts(timeObj);
  };

  // Helper to format time parts consistently
  const formatTimeParts = (timeObj: TimeRemaining): string => {
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

  // Format exam time window for display (startTime - dueTime)
  const formatExamTimeWindow = (subject: Subject): string => {
    if (!subject.startingTime || !subject.dueTime) {
      return formatExamDate(subject.examDate);
    }

    const startTime = new Date(subject.startingTime);
    const dueTime = new Date(subject.dueTime);

    // Get month and day from the database dates
    const month = startTime.toLocaleString("en-ZA", { month: "short" });
    const day = startTime.getDate(); // Use local date, not UTC

    // Get hours and minutes
    const startHour = startTime.getHours();
    const startMinute = String(startTime.getMinutes()).padStart(2, "0");
    const startPeriod = startHour >= 12 ? "PM" : "AM";
    const displayStartHour = startHour % 12 || 12;

    const dueHour = dueTime.getHours();
    const dueMinute = String(dueTime.getMinutes()).padStart(2, "0");
    const duePeriod = dueHour >= 12 ? "PM" : "AM";
    const displayDueHour = dueHour % 12 || 12;

    return `${month} ${day}, ${displayStartHour}:${startMinute} ${startPeriod} - ${displayDueHour}:${dueMinute} ${duePeriod}`;
  };

  // Format exam date for display
  const formatExamDate = (date: Date): string => {
    const month = date.toLocaleString("en-ZA", { month: "short" });
    const day = date.getDate(); // Use local date, not UTC
    const hour = date.getHours(); // Use local hours
    const minute = String(date.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${month} ${day}, ${displayHour}:${minute} ${period}`;
  };

  // Handle exam card click
  const handleExamClick = (subject: Subject): void => {
    setSelectedSubject(subject);

    // Check proper availability based on start/due times
    const isAvailable = isExamAvailable(subject);

    if (isAvailable && user) {
      // Show language selection modal for available exams
      setShowLanguageModal(true);
    } else {
      // Show unavailable modal for unavailable exams
      setShowUnavailableModal(true);
    }
  };

  // Get exam status for UI display and interaction
  const getExamStatus = (
    subject: Subject,
  ): {
    isEnded: boolean;
    isAvailable: boolean;
    isUpcoming: boolean;
    statusText: string;
    statusClass: string;
  } => {
    if (!currentTime || !subject.isActive) {
      return {
        isEnded: false,
        isAvailable: false,
        isUpcoming: true,
        statusText:
          subject.isActive === false ? "Inactive" : "Not Available Yet",
        statusClass: "bg-gray-100 text-gray-400",
      };
    }

    const now = currentTime.getTime();

    // Fall back to exam date if specific times not available
    if (!subject.startingTime || !subject.dueTime) {
      const isAvailable = now >= subject.examDate.getTime() && subject.isActive;
      return {
        isEnded: false,
        isAvailable,
        isUpcoming: !isAvailable,
        statusText: isAvailable ? "Start Exam" : "Not Available Yet",
        statusClass: isAvailable
          ? "bg-[#3e6788] hover:bg-[#2d4d66] text-white"
          : "bg-gray-100 text-gray-400",
      };
    }

    // Get start and due times
    const startTime = new Date(subject.startingTime);
    const dueTime = new Date(subject.dueTime);

    // Exam has ended
    if (now > dueTime.getTime()) {
      return {
        isEnded: true,
        isAvailable: false,
        isUpcoming: false,
        statusText: "Exam Ended",
        statusClass: "bg-gray-500 text-white",
      };
    }

    // Exam is active now
    if (
      now >= startTime.getTime() &&
      now <= dueTime.getTime() &&
      subject.isActive
    ) {
      return {
        isEnded: false,
        isAvailable: true,
        isUpcoming: false,
        statusText: "Start Exam",
        statusClass: "bg-[#3e6788] hover:bg-[#2d4d66] text-white",
      };
    }

    // Exam is upcoming
    return {
      isEnded: false,
      isAvailable: false,
      isUpcoming: true,
      statusText: "Not Available Yet",
      statusClass: "bg-gray-100 text-gray-400",
    };
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
          Exams will become available for writing when the scheduled start time
          is reached.
        </p>
      </div>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{fetchError}</p>
        </div>
      )}

      {subjects.length === 0 && !fetchError ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>
            You don&apos;t have any registered subjects yet. Please contact your
            administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject: Subject) => {
            // Get detailed timing info for the exam
            const examTimingInfo = getExamTimingInfo(subject);
            const status = getExamStatus(subject);

            // Format display strings
            const timeDisplay = isClient
              ? formatTimeRemaining(
                  examTimingInfo.timeRemaining,
                  examTimingInfo.isCountingDown,
                  status.isEnded,
                )
              : "Loading...";
            const examDateDisplay = formatExamTimeWindow(subject);

            return (
              <ExamCard
                key={subject.id}
                subject={subject}
                isAvailable={status.isAvailable}
                isEnded={status.isEnded}
                statusText={status.statusText}
                statusClass={status.statusClass}
                timeDisplay={timeDisplay}
                examDateDisplay={examDateDisplay}
                onExamClick={handleExamClick}
              />
            );
          })}
        </div>
      )}

      {/* Unavailable Exam Modal */}
      {showUnavailableModal && selectedSubject && (
        <UnavailableExamModal
          subject={selectedSubject}
          formatExamDate={formatExamTimeWindow}
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
