"use client";
import React from "react";
import { LucideCalculator, LucidePencil } from "lucide-react";

interface ExamToolbarProps {
  toggleCalculator: () => void;
  toggleWritingPad: () => void;
}

/**
 * ExamToolbar component that provides calculator and writing pad buttons
 * for both English and Afrikaans exams
 */
const ExamToolbar: React.FC<ExamToolbarProps> = ({
  toggleCalculator,
  toggleWritingPad,
}) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-3 mt-4">
        <button
          onClick={toggleCalculator}
          className="flex items-center gap-2 px-6 py-2 bg-[#3e6788] text-white rounded-md shadow-md hover:bg-[#2c4a63] focus:outline-none focus:ring-2 focus:ring-[#3e6788] focus:ring-opacity-50 transition-colors"
        >
          <LucideCalculator className="h-4 w-4" />
          <span>Calculator</span>
        </button>
        <button
          onClick={toggleWritingPad}
          className="flex items-center gap-2 px-6 py-2 bg-[#3e6788] text-white rounded-md shadow-md hover:bg-[#2c4a63] focus:outline-none focus:ring-2 focus:ring-[#3e6788] focus:ring-opacity-50 transition-colors"
        >
          <LucidePencil className="h-4 w-4" />
          <span>Writing Pad</span>
        </button>
      </div>
    </div>
  );
};

export default ExamToolbar;
