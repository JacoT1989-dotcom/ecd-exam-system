"use client";

import { Subject } from "./types";
import { useSession } from "../../SessionProvider";
import ExamActionButtons from "./ExamActionButtons";
import { useEffect, useState } from "react";

interface ExamCardProps {
  subject: Subject;
  isAvailable: boolean;
  isEnded?: boolean;
  timeDisplay: string;
  examDateDisplay: string;
  statusText: string;
  statusClass: string;
  onExamClick: (subject: Subject) => void;
}

const ExamCard = ({
  subject,
  isAvailable,
  isEnded = false,
  timeDisplay,
  examDateDisplay,
  statusText,
  statusClass,
  onExamClick,
}: ExamCardProps) => {
  const { user } = useSession();
  const [correctedStatus, setCorrectedStatus] = useState({
    statusText,
    statusClass,
    isAvailable,
  });
  const [expired, setExpired] = useState(false);

  // Create the correct URL path format
  const examUrl = user ? `/students/exam/subjects` : "#";

  // Check if exam is not scheduled
  const isNotScheduled = examDateDisplay === "Not scheduled yet";

  // Determine time display color based on status
  const getTimeDisplayColor = () => {
    if (isNotScheduled) return "text-gray-500";
    if (expired || (timeDisplay === "Starts in 00:00:00" && !isNotScheduled))
      return "text-red-500";
    if (isEnded) return "text-gray-500";
    if (correctedStatus.isAvailable) return "text-green-600";
    return "text-blue-600";
  };

  useEffect(() => {
    // Check if the current time is past the exam due time or if timeDisplay shows 00:00:00
    const isExamTime =
      timeDisplay === "Starts in 00:00:00" || timeDisplay.includes("00:00:00");
    const shouldBeExpired = (isEnded || isExamTime) && !isNotScheduled;
    setExpired(shouldBeExpired);

    // Check if the timeDisplay indicates an exam is in progress ("Ends in...")
    const isExamActive = timeDisplay.startsWith("Ends in");

    // If exam is not scheduled, show Not Scheduled status
    if (isNotScheduled) {
      setCorrectedStatus({
        statusText: "Not Scheduled",
        statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
        isAvailable: false,
      });
    }
    // If timeDisplay shows "Ends in" but status is not available, correct it
    else if (isExamActive && !isAvailable) {
      setCorrectedStatus({
        statusText: "Start Exam",
        statusClass: "bg-[#3e6788] hover:bg-[#2d4d66] text-white",
        isAvailable: true,
      });
    } else if (shouldBeExpired) {
      setCorrectedStatus({
        statusText: "Expired",
        statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
        isAvailable: false,
      });
    } else {
      setCorrectedStatus({
        statusText,
        statusClass,
        isAvailable,
      });
    }
  }, [
    timeDisplay,
    statusText,
    statusClass,
    isAvailable,
    isEnded,
    isNotScheduled,
    examDateDisplay,
  ]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full ${(isEnded || expired) && !isNotScheduled ? "opacity-75" : ""}`}
    >
      <div className={`${subject.color} h-2 w-full`}></div>
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {subject.name}
          </h3>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
            {subject.code}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {subject.description}
        </p>

        <div className="flex flex-col space-y-2 flex-grow">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Exam time:
            </span>
            <span className="text-sm font-medium">{examDateDisplay}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              {correctedStatus.isAvailable
                ? "Time remaining:"
                : isNotScheduled
                  ? "Status:"
                  : expired
                    ? "Status:"
                    : isEnded
                      ? "Status:"
                      : "Time until start:"}
            </span>
            <span className={`text-sm font-bold ${getTimeDisplayColor()}`}>
              {isNotScheduled
                ? "Not scheduled"
                : expired ||
                    (timeDisplay === "Starts in 00:00:00" && !isNotScheduled)
                  ? "Expired"
                  : timeDisplay}
            </span>
          </div>

          {/* Add status indicator - always show but with correct styling */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            {isNotScheduled ? (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                Not Scheduled
              </span>
            ) : expired || timeDisplay === "Starts in 00:00:00" ? (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                Expired
              </span>
            ) : correctedStatus.isAvailable ? (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                Active
              </span>
            ) : isEnded ? (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                Ended
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Upcoming
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          {isNotScheduled ? (
            <button
              className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Not Scheduled
            </button>
          ) : expired || timeDisplay === "Starts in 00:00:00" ? (
            <button
              className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Expired
            </button>
          ) : (
            <ExamActionButtons
              subject={subject}
              isAvailable={!expired && correctedStatus.isAvailable}
              isEnded={isEnded || expired}
              statusText={correctedStatus.statusText}
              statusClass={correctedStatus.statusClass}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
