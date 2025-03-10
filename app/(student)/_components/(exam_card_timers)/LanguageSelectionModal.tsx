"use client";

import { Subject } from "./types";

interface LanguageSelectionModalProps {
  subject: Subject;
  onClose: () => void;
}

const LanguageSelectionModal = ({
  subject,
  onClose,
}: LanguageSelectionModalProps) => {
  const handleLanguageSelect = (language: "eng" | "afr") => {
    // Create URL-friendly subject name (lowercase, spaces replaced with hyphens)
    const formattedSubjectName = subject.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    // Add subject name and code to the URL as query parameters
    const examUrl = `/students/exam/subjects/${formattedSubjectName}-${language}?subjectName=${encodeURIComponent(subject.name)}&subjectCode=${encodeURIComponent(subject.code)}`;
    window.location.href = examUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className={`${subject.color} h-2 w-full`}></div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Select Language
          </h3>

          <p className="text-gray-600 mb-6">
            Please select the language in which you would like to take the{" "}
            {subject.name} exam:
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleLanguageSelect("eng")}
              className="bg-[#3e6788] hover:bg-[#2d4d66] text-white py-3 px-4 rounded font-medium transition-colors duration-300"
            >
              {subject.name} (Eng)
            </button>

            <button
              onClick={() => handleLanguageSelect("afr")}
              className="bg-[#3e6788] hover:bg-[#2d4d66] text-white py-3 px-4 rounded font-medium transition-colors duration-300"
            >
              {subject.name} (Afr)
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
