"use client";

import { Subject } from "./types";

// Define the Subject interface directly in this file

interface ExamCardProps {
  subject: Subject;
  isAvailable: boolean;
  timeDisplay: string;
  examDateDisplay: string;
  onExamClick: (subject: Subject) => void;
}

const ExamCard = ({
  subject,
  isAvailable,
  timeDisplay,
  examDateDisplay,
  onExamClick,
}: ExamCardProps) => {
  return (
    <a
      href={isAvailable ? `/exam/${subject.id}` : "#"}
      onClick={(e) => {
        e.preventDefault();
        onExamClick(subject);
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
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
              Time remaining:
            </span>
            <span
              className={`text-sm font-bold ${isAvailable ? "text-green-600" : "text-blue-600"}`}
            >
              {timeDisplay}
            </span>
          </div>
        </div>

        <div className="mt-4 h-10 flex items-center justify-center">
          <div
            className={`w-full py-2 px-4 rounded font-medium text-center transition-colors duration-300 
              ${
                isAvailable
                  ? "bg-[#3e6788] hover:bg-[#2d4d66] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
          >
            {isAvailable ? "Start Exam" : "Not Yet Available"}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ExamCard;
