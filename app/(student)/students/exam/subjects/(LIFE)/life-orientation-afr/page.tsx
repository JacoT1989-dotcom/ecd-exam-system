"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExamTabs } from "./_components/ExamTabs";
import ExamTimer from "./_components/ExamTimer";
import ScientificCalculator from "@/app/(student)/students/calculator/Calculator";
import WritingPad from "./_components/WritingPad"; // Import the WritingPad component

// Define a type for the translation dictionary
type SubjectDictionary = {
  [key: string]: string;
};

// Translation mapping for common subjects
const subjectTranslations: SubjectDictionary = {
  "Life Orientation": "Lewensoriëntering",
  Mathematics: "Wiskunde",
  "Physical Sciences": "Fisiese Wetenskappe",
  English: "Engels",
  Afrikaans: "Afrikaans",
  History: "Geskiedenis",
  Geography: "Geografie",
  "Life Sciences": "Lewenswetenskappe",
  // Add more subject translations as needed
};

const LewensorienteringEksamenPage = () => {
  // Get URL parameters using the English parameter names that are working
  const searchParams = useSearchParams();
  const subjectNameEng = searchParams.get("subjectName") || "";
  const vakKode = searchParams.get("subjectCode") || "";

  // Translate the subject name to Afrikaans if a translation exists
  const vakNaam = subjectTranslations[subjectNameEng] || subjectNameEng;

  // State for calculator modal
  const [showCalculator, setShowCalculator] = useState(false);
  // State for writing pad modal
  const [showWritingPad, setShowWritingPad] = useState(false);

  // Toggle calculator modal
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  // Toggle writing pad modal
  const toggleWritingPad = () => {
    setShowWritingPad(!showWritingPad);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 ">
        <h1 className="text-3xl font-bold text-center">
          {vakNaam ? `${vakNaam} Eksamen` : "Lewensoriëntering Eksamen"}
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Voltooi al vyf afdelings van die eksamen. Jou vordering sal outomaties
          gestoor word.
        </p>

        {/* Remove conditional rendering to always show the buttons */}
        <div className="flex flex-col items-center">
          <ExamTimer />
          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleCalculator}
              className="px-6 py-2 bg-[#3e6788] text-white rounded-md shadow-md hover:bg-[#2c4a63] focus:outline-none focus:ring-2 focus:ring-[#3e6788] focus:ring-opacity-50 transition-colors"
            >
              Sakrekenaar
            </button>
            <button
              onClick={toggleWritingPad}
              className="px-6 py-2 bg-[#3e6788] text-white rounded-md shadow-md hover:bg-[#2c4a63] focus:outline-none focus:ring-2 focus:ring-[#3e6788] focus:ring-opacity-50 transition-colors"
            >
              Skryfblok
            </button>
          </div>
        </div>
      </div>

      <ExamTabs subjectName={vakNaam} subjectCode={vakKode} />

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#2c4a63] rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex justify-end items-center bg-[#3e6788] text-white p-4 rounded-t-lg">
              <button
                onClick={toggleCalculator}
                className="text-white bg-[#2c4a63] hover:bg-[#1c3952] rounded-md p-2 focus:outline-none"
              >
                Maak toe
              </button>
            </div>
            <div className="p-5">
              <ScientificCalculator />
            </div>
          </div>
        </div>
      )}

      {/* Writing Pad Modal */}
      {showWritingPad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex justify-end items-center bg-[#3e6788] text-white p-4 rounded-t-lg">
              <button
                onClick={toggleWritingPad}
                className="text-white bg-[#2c4a63] hover:bg-[#1c3952] rounded-md p-2 focus:outline-none"
              >
                Maak toe
              </button>
            </div>
            <div className="p-5 bg-white">
              <WritingPad height={500} placeholder="Skryf of skets iets..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LewensorienteringEksamenPage;
