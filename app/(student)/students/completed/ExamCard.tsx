"use client";

import { Subject } from "../../_components/(exam_card_timers)/types";
import {
  formatExamTimeWindow,
  formatTimeRemaining,
  getExamStatus,
} from "./exam-utils";

interface ExamCardProps {
  subject: Subject;
  completedExams: number[];
  currentTime: Date;
  isClient: boolean;
  onExamClick: (subject: Subject) => void;
}

const ExamCard = ({
  subject,
  completedExams,
  currentTime,
  isClient,
  onExamClick,
}: ExamCardProps) => {
  const status = getExamStatus(subject, completedExams, currentTime);
  const isCompleted = completedExams.includes(subject.id);
  const timeDisplay = formatTimeRemaining(subject, currentTime, isClient);
  const examDateDisplay = formatExamTimeWindow(subject);

  // Check if the exam is within its time window with time correction
  let isWithinTimeWindow = false;
  if (subject.startingTime && subject.dueTime) {
    const startTime = new Date(subject.startingTime);
    startTime.setHours(startTime.getHours() - 2);

    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);

    isWithinTimeWindow = currentTime >= startTime && currentTime <= dueTime;
  }

  // Determine button text based on multiple conditions
  let buttonText = status.statusText;
  let buttonClass = status.statusClass;
  let isButtonDisabled = !status.isAvailable;

  // Override button text and style for specific cases
  if (subject.isActive === false) {
    buttonText = "Inactive";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    isButtonDisabled = true;
  } else if (!subject.isScheduled) {
    buttonText = "Not Scheduled";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    isButtonDisabled = true;
  } else if (timeDisplay === "Expired" || timeDisplay.includes("Expired")) {
    buttonText = "Expired";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    isButtonDisabled = true;
  }

  // For exams in progress but that haven't been activated yet
  if (isWithinTimeWindow && subject.isActive === false) {
    buttonText = "Inactive";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    isButtonDisabled = true;
  }

  return (
    <div
      key={subject.id}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
      onClick={() => onExamClick(subject)}
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

          {/* For upcoming or active exams, show time until start/remaining */}
          <span className="font-medium text-gray-500">Status:</span>
          <span
            className={`font-bold text-right ${
              isCompleted
                ? "text-gray-600"
                : status.isAvailable
                  ? "text-green-600"
                  : "text-blue-600"
            }`}
          >
            {timeDisplay}
          </span>
        </div>

        <div className="h-7 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isButtonDisabled) {
                onExamClick(subject);
              }
            }}
            disabled={isButtonDisabled}
            className={`w-full py-1 px-2 rounded text-xs font-medium text-center ${buttonClass}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
