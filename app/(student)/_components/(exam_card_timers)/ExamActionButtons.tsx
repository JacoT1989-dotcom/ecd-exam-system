"use client";

import { useState } from "react";
import { Subject } from "./types";
import { useSession } from "../../SessionProvider";
import UnavailableExamModal from "./UnavailableExamModal";
import LanguageSelectionModal from "./LanguageSelectionModal";

interface ExamActionButtonsProps {
  subject: Subject;
  isAvailable: boolean;
  isEnded: boolean;
  statusText: string;
  statusClass: string;
  onRefresh?: () => void;
}

const ExamActionButtons = ({
  subject,
  isAvailable,
  isEnded,
  statusText,
  statusClass,
  onRefresh,
}: ExamActionButtonsProps) => {
  const { user } = useSession();
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatExamTimeWindow = (subject: Subject): string => {
    // For unscheduled exams
    if (!subject.isScheduled) {
      return "Not scheduled yet";
    }

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

  const formatExamDate = (date: Date | null): string => {
    if (!date) return "Not scheduled yet";

    const adjustedDate = adjustForSAST(new Date(date));
    const month = adjustedDate.toLocaleString("en-ZA", { month: "short" });
    const day = adjustedDate.getDate();
    const hour = adjustedDate.getHours();
    const minute = String(adjustedDate.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${month} ${day}, ${displayHour}:${minute} ${period}`;
  };

  // Adjust time for SAST (UTC+2) by subtracting 2 hours from UTC
  const adjustForSAST = (date: Date): Date => {
    const adjusted = new Date(date);
    adjusted.setHours(adjusted.getHours() - 2);
    return adjusted;
  };

  const handleExamClick = () => {
    // Check if exam is actually available based on times
    const isActuallyAvailable = checkExamAvailability(subject);

    if ((isAvailable || isActuallyAvailable) && user) {
      setShowLanguageModal(true);
    } else {
      setShowUnavailableModal(false);
    }
  };

  // Function to double-check exam availability based on current time
  const checkExamAvailability = (subject: Subject): boolean => {
    // If no dates are set, exam cannot be available
    if (!subject.startingTime || !subject.dueTime || !subject.isScheduled) {
      return false;
    }

    const now = new Date();
    const startTime = adjustForSAST(new Date(subject.startingTime));
    const dueTime = adjustForSAST(new Date(subject.dueTime));

    // Check if current time is between start and due time
    return now >= startTime && now <= dueTime;
  };

  return (
    <>
      <div className="w-full">
        {/* Main action button */}
        <button
          onClick={handleExamClick}
          disabled={loading}
          className={`w-full py-2 px-4 rounded font-medium text-center transition-colors duration-300 ${statusClass} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Loading..." : statusText}
        </button>
      </div>

      {showUnavailableModal && (
        <UnavailableExamModal
          subject={subject}
          formatExamDate={formatExamTimeWindow}
          onClose={() => setShowUnavailableModal(false)}
        />
      )}

      {showLanguageModal && (
        <LanguageSelectionModal
          subject={subject}
          onClose={() => setShowLanguageModal(false)}
        />
      )}
    </>
  );
};

export default ExamActionButtons;
