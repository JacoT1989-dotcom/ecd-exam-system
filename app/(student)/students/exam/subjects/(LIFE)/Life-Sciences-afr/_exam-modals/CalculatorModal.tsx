"use client";
import ScientificCalculator from "@/app/(student)/students/calculator/Calculator";
import React from "react";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative  rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 flex justify-end items-center bg-[#3e6788] text-white p-4 rounded-t-lg">
          <button
            onClick={onClose}
            className="text-white bg-[#2c4a63] hover:bg-[#1c3952] rounded-md p-2 focus:outline-none"
          >
            Close
          </button>
        </div>
        <div className="p-5">
          <ScientificCalculator />
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
