"use client";

import { Subject } from "./types";

interface UnavailableExamModalProps {
  subject: Subject;
  formatExamDate: (subject: Subject) => string; // Updated to accept Subject
  onClose: () => void;
}

const UnavailableExamModal = ({
  subject,
  formatExamDate,
  onClose,
}: UnavailableExamModalProps) => {
  // Determine the appropriate message based on the exam status
  const getExamStatusMessage = () => {
    const now = new Date();
    const nowUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    );

    // Check if exam has specific start/due times
    if (subject.startingTime && subject.dueTime) {
      const startTime = new Date(subject.startingTime);
      const dueTime = new Date(subject.dueTime);

      const startUTC = Date.UTC(
        startTime.getUTCFullYear(),
        startTime.getUTCMonth(),
        startTime.getUTCDate(),
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        startTime.getUTCSeconds(),
      );

      const dueUTC = Date.UTC(
        dueTime.getUTCFullYear(),
        dueTime.getUTCMonth(),
        dueTime.getUTCDate(),
        dueTime.getUTCHours(),
        dueTime.getUTCMinutes(),
        dueTime.getUTCSeconds(),
      );

      if (nowUTC > dueUTC) {
        return (
          <>
            This exam for <span className="font-semibold">{subject.name}</span>{" "}
            has ended. It was available from{" "}
            <span className="font-semibold">{formatExamDate(subject)}</span>.
          </>
        );
      }

      if (nowUTC < startUTC) {
        return (
          <>
            This exam for <span className="font-semibold">{subject.name}</span>{" "}
            is not available until{" "}
            <span className="font-semibold">{formatExamDate(subject)}</span>.
          </>
        );
      }
    }

    // Default message if no specific times or other conditions
    return (
      <>
        This exam for <span className="font-semibold">{subject.name}</span> is
        not available at this time. The scheduled time is{" "}
        <span className="font-semibold">{formatExamDate(subject)}</span>.
      </>
    );
  };

  // Check if the exam is inactive
  const isInactive = subject.isActive === false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {isInactive ? "Exam Not Active" : "Exam Not Available"}
        </h3>
        <p className="text-gray-600 mb-6">
          {isInactive ? (
            <>
              This exam for{" "}
              <span className="font-semibold">{subject.name}</span> is not
              active yet. Please contact your administrator if you believe this
              is incorrect.
            </>
          ) : (
            getExamStatusMessage()
          )}
          <br />
          <br />
          Please log in again at the correct time to access this exam.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#3e6788] hover:bg-[#2d4d66] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnavailableExamModal;
