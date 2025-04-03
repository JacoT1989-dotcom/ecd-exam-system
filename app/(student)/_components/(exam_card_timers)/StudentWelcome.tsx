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

  // Adjust time for SAST (UTC+2) by subtracting 2 hours
  const adjustForSAST = (date: Date): Date => {
    const adjusted = new Date(date);
    adjusted.setHours(adjusted.getHours() - 2);
    return adjusted;
  };

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  const isExamAvailable = (subject: Subject): boolean => {
    if (!currentTime || !subject.isActive) {
      return false;
    }

    const now = currentTime.getTime();

    if (!subject.startingTime || !subject.dueTime) {
      return now >= subject.examDate.getTime();
    }

    const startTimeMs = adjustForSAST(new Date(subject.startingTime)).getTime();
    const dueTimeMs = adjustForSAST(new Date(subject.dueTime)).getTime();

    return now >= startTimeMs && now <= dueTimeMs;
  };

  const getExamTimingInfo = (
    subject: Subject,
  ): {
    timeRemaining: TimeRemaining;
    targetDate: Date;
    isCountingDown: boolean;
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

    if (!subject.startingTime || !subject.dueTime) {
      const targetDate = adjustForSAST(new Date(subject.examDate));
      const difference = targetDate.getTime() - now;
      const isAvailable = difference <= 0;

      return {
        timeRemaining: calculateTimeRemaining(targetDate),
        targetDate,
        isCountingDown: true,
      };
    }

    const startTime = adjustForSAST(new Date(subject.startingTime));
    const dueTime = adjustForSAST(new Date(subject.dueTime));

    if (now < startTime.getTime()) {
      return {
        timeRemaining: calculateTimeRemaining(startTime),
        targetDate: startTime,
        isCountingDown: true,
      };
    }

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

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    if (!currentTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: false };
    }

    const difference = targetDate.getTime() - currentTime.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: true };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isAvailable: false };
  };

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

  const formatTimeParts = (timeObj: TimeRemaining): string => {
    const formattedTime = [
      String(timeObj.hours).padStart(2, "0"),
      String(timeObj.minutes).padStart(2, "0"),
      String(timeObj.seconds).padStart(2, "0"),
    ].join(":");

    const totalHours = timeObj.hours + timeObj.days * 24;

    return timeObj.days > 0
      ? `${totalHours}:${String(timeObj.minutes).padStart(2, "0")}:${String(timeObj.seconds).padStart(2, "0")} (${timeObj.days} days)`
      : formattedTime;
  };

  const formatExamTimeWindow = (subject: Subject): string => {
    if (!subject.startingTime || !subject.dueTime) {
      return formatExamDate(subject.examDate);
    }

    const startTime = adjustForSAST(new Date(subject.startingTime));
    const dueTime = adjustForSAST(new Date(subject.dueTime));

    const month = startTime.toLocaleString("en-ZA", { month: "short" });
    const day = startTime.getDate();

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

  const formatExamDate = (date: Date): string => {
    const adjustedDate = adjustForSAST(new Date(date));
    const month = adjustedDate.toLocaleString("en-ZA", { month: "short" });
    const day = adjustedDate.getDate();
    const hour = adjustedDate.getHours();
    const minute = String(adjustedDate.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${month} ${day}, ${displayHour}:${minute} ${period}`;
  };

  const handleExamClick = (subject: Subject): void => {
    setSelectedSubject(subject);
    const isAvailable = isExamAvailable(subject);

    if (isAvailable && user) {
      setShowLanguageModal(true);
    } else {
      setShowUnavailableModal(true);
    }
  };

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

    const startTime = adjustForSAST(new Date(subject.startingTime));
    const dueTime = adjustForSAST(new Date(subject.dueTime));

    if (now > dueTime.getTime()) {
      return {
        isEnded: true,
        isAvailable: false,
        isUpcoming: false,
        statusText: "Exam Ended",
        statusClass: "bg-gray-500 text-white",
      };
    }

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
            const examTimingInfo = getExamTimingInfo(subject);
            const status = getExamStatus(subject);

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

      {showUnavailableModal && selectedSubject && (
        <UnavailableExamModal
          subject={selectedSubject}
          formatExamDate={formatExamTimeWindow}
          onClose={() => setShowUnavailableModal(false)}
        />
      )}

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
