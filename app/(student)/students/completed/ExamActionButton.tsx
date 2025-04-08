"use client";

import { Subject } from "../../_components/(exam_card_timers)/types";
import { isExamAvailable } from "./exam-utils";

interface ExamActionButtonProps {
  subject: Subject;
  completedExams: number[];
  currentTime: Date;
  isClient: boolean;
  onClick: (subject: Subject) => void;
}

const ExamActionButton = ({
  subject,
  completedExams,
  currentTime,
  isClient,
  onClick,
}: ExamActionButtonProps) => {
  // Check if exam is available (within time window and active)
  const available = isExamAvailable(subject, currentTime, isClient);

  // Check if exam is completed
  const isCompleted = completedExams.includes(subject.id);

  // Check if exam is expired
  let isExpired = false;
  if (subject.dueTime) {
    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);
    isExpired = currentTime > dueTime;
  }

  // Check if the exam is within its time window (in progress)
  let isWithinTimeWindow = false;
  if (subject.startingTime && subject.dueTime) {
    const startTime = new Date(subject.startingTime);
    startTime.setHours(startTime.getHours() - 2);

    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);

    isWithinTimeWindow = currentTime >= startTime && currentTime <= dueTime;
  }

  // Determine button text and style based on exam state
  let buttonText: string;
  let buttonClass: string;
  let isButtonDisabled = true;

  // For exams in progress (within time window)
  if (isWithinTimeWindow) {
    // Even if marked inactive in the database, show "Start Exam" for in-progress exams
    buttonText = "Start Exam";
    buttonClass = "bg-[#3e6788] hover:bg-[#2d4d66] text-white";
    isButtonDisabled = false;
  }
  // For expired exams
  else if (isExpired || isCompleted) {
    buttonText = "Expired";
    buttonClass = "bg-gray-200 text-gray-500";
  }
  // For unscheduled exams
  else if (!subject.isScheduled || !subject.examDate) {
    buttonText = "Not Scheduled";
    buttonClass = "bg-gray-200 text-gray-500";
  }
  // For inactive exams
  else if (subject.isActive === false) {
    buttonText = "Inactive";
    buttonClass = "bg-gray-200 text-gray-500";
  }
  // For upcoming exams
  else {
    buttonText = "Upcoming";
    buttonClass = "bg-gray-200 text-gray-500";
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        // For exams in progress, we want to open the language modal
        // even if the exam is marked as inactive
        if (isWithinTimeWindow || !isButtonDisabled) {
          onClick(subject);
        }
      }}
      disabled={isButtonDisabled}
      className={`w-full py-2 px-4 rounded text-sm font-medium text-center ${buttonClass}`}
    >
      {buttonText}
    </button>
  );
};

export default ExamActionButton;
