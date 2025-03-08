"use client";

import { Subject } from "./types";

interface UnavailableExamModalProps {
  subject: Subject;
  formatExamDate: (date: Date) => string;
  onClose: () => void;
}

const UnavailableExamModal = ({
  subject,
  formatExamDate,
  onClose,
}: UnavailableExamModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Exam Not Available
        </h3>
        <p className="text-gray-600 mb-6">
          This exam for <span className="font-semibold">{subject.name}</span> is
          not available until{" "}
          <span className="font-semibold">
            {formatExamDate(subject.examDate)}
          </span>
          .
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
