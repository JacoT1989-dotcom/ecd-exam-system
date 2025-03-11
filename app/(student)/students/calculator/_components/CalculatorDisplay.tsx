import React from "react";

interface CalculatorDisplayProps {
  display: string;
  memory: number;
  history: string[];
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  display,
  memory,
  history,
  showHistory,
  setShowHistory,
}) => {
  return (
    <div className="calculator-display">
      <div className="relative bg-white p-6 border-b border-gray-300">
        {memory !== 0 && (
          <div className="absolute top-2 left-2 text-sm font-bold text-red-500">
            M
          </div>
        )}
        <div className="text-right text-2xl font-medium text-gray-800 break-all min-h-12">
          {display}
        </div>
      </div>

      <button
        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 transition-colors border-b border-gray-300 font-medium"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <div className="bg-white p-4 border-b border-gray-300 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Calculation History
          </h3>
          {history.length > 0 ? (
            <ul className="text-sm">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="py-1 border-b border-gray-100 text-gray-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No calculations yet</p>
          )}
        </div>
      )}
    </div>
  );
};
