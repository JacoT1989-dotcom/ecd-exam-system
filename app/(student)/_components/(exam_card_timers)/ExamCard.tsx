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

  // Create the correct URL path format
  const examUrl = user ? `/students/exam/subjects` : "#";

  // Determine time display color based on status
  const getTimeDisplayColor = () => {
    if (isEnded) return "text-gray-500";
    if (correctedStatus.isAvailable) return "text-green-600";
    return "text-blue-600";
  };

  useEffect(() => {
    // Check if the timeDisplay indicates an exam is in progress ("Ends in...")
    const isExamActive = timeDisplay.startsWith("Ends in");

    // If timeDisplay shows "Ends in" but status is not available, correct it
    if (isExamActive && !isAvailable) {
      setCorrectedStatus({
        statusText: "Start Exam",
        statusClass: "bg-[#3e6788] hover:bg-[#2d4d66] text-white",
        isAvailable: true,
      });
    } else {
      setCorrectedStatus({
        statusText,
        statusClass,
        isAvailable,
      });
    }
  }, [timeDisplay, statusText, statusClass, isAvailable]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full ${isEnded ? "opacity-75" : ""}`}
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
                : isEnded
                  ? "Status:"
                  : "Time until start:"}
            </span>
            <span className={`text-sm font-bold ${getTimeDisplayColor()}`}>
              {timeDisplay}
            </span>
          </div>

          {/* Add status indicator */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                correctedStatus.isAvailable
                  ? "bg-green-100 text-green-800"
                  : isEnded
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {correctedStatus.isAvailable
                ? "Active"
                : isEnded
                  ? "Ended"
                  : "Upcoming"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          {/* Use our ExamActionButtons component with corrected status */}
          <ExamActionButtons
            subject={subject}
            isAvailable={correctedStatus.isAvailable}
            isEnded={isEnded}
            statusText={correctedStatus.statusText}
            statusClass={correctedStatus.statusClass}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
