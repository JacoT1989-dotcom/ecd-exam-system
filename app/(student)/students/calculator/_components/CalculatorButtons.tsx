import React from "react";

interface CalculatorButtonsProps {
  currentTab: "standard" | "scientific" | "calculus" | "geometry";
  angleMode: "deg" | "rad";
  setAngleMode: (mode: "deg" | "rad") => void;
  appendToDisplay: (value: string) => void;
  clearDisplay: () => void;
  clearEntry: () => void;
  calculateResult: () => void;
  applyFunction: (func: string) => void;
  handleMemoryOperation: (operation: "MC" | "MR" | "MS" | "M+" | "M-") => void;
  handleCalculusOperation: (operation: string) => void;
  handleGeometryOperation: (operation: string) => void;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
}

export const CalculatorButtons: React.FC<CalculatorButtonsProps> = ({
  currentTab,
  angleMode,
  setAngleMode,
  appendToDisplay,
  clearDisplay,
  clearEntry,
  calculateResult,
  applyFunction,
  handleMemoryOperation,
  handleCalculusOperation,
  handleGeometryOperation,
  setDisplay,
}) => {
  const renderStandardButtons = () => (
    <>
      <div className="flex mb-2">
        <button
          onClick={() => handleMemoryOperation("MC")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          MC
        </button>
        <button
          onClick={() => handleMemoryOperation("MR")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          MR
        </button>
        <button
          onClick={() => handleMemoryOperation("MS")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          MS
        </button>
        <button
          onClick={() => handleMemoryOperation("M+")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          M+
        </button>
        <button
          onClick={() => handleMemoryOperation("M-")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          M-
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("%")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          %
        </button>
        <button
          onClick={clearEntry}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          CE
        </button>
        <button
          onClick={clearDisplay}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          C
        </button>
        <button
          onClick={() => setDisplay((prev) => prev.slice(0, -1) || "0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ⌫
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("7")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          7
        </button>
        <button
          onClick={() => appendToDisplay("8")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          8
        </button>
        <button
          onClick={() => appendToDisplay("9")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          9
        </button>
        <button
          onClick={() => appendToDisplay("/")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          /
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("4")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          4
        </button>
        <button
          onClick={() => appendToDisplay("5")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          5
        </button>
        <button
          onClick={() => appendToDisplay("6")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          6
        </button>
        <button
          onClick={() => appendToDisplay("*")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ×
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("1")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          1
        </button>
        <button
          onClick={() => appendToDisplay("2")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          2
        </button>
        <button
          onClick={() => appendToDisplay("3")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          3
        </button>
        <button
          onClick={() => appendToDisplay("-")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          -
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          0
        </button>
        <button
          onClick={() => appendToDisplay(".")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          .
        </button>
        <button
          onClick={calculateResult}
          className="flex-1 mx-1 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 active:bg-blue-700"
        >
          =
        </button>
        <button
          onClick={() => appendToDisplay("+")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          +
        </button>
      </div>
    </>
  );

  const renderScientificButtons = () => (
    <>
      <div className="flex mb-2">
        <button
          onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          {angleMode.toUpperCase()}
        </button>
        <button
          onClick={() => applyFunction("pi")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          π
        </button>
        <button
          onClick={() => applyFunction("e")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          e
        </button>
        <button
          onClick={() => appendToDisplay("(")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          (
        </button>
        <button
          onClick={() => appendToDisplay(")")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          )
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => applyFunction("sin")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          sin
        </button>
        <button
          onClick={() => applyFunction("cos")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          cos
        </button>
        <button
          onClick={() => applyFunction("tan")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          tan
        </button>
        <button
          onClick={() => appendToDisplay("^")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          x^y
        </button>
        <button
          onClick={() => applyFunction("sqrt")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          √
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => applyFunction("asin")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          sin⁻¹
        </button>
        <button
          onClick={() => applyFunction("acos")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          cos⁻¹
        </button>
        <button
          onClick={() => applyFunction("atan")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          tan⁻¹
        </button>
        <button
          onClick={() => applyFunction("square")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          x²
        </button>
        <button
          onClick={() => applyFunction("cube")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          x³
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => applyFunction("ln")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ln
        </button>
        <button
          onClick={() => applyFunction("log")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          log
        </button>
        <button
          onClick={() => applyFunction("reciprocal")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          1/x
        </button>
        <button
          onClick={() => applyFunction("abs")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          |x|
        </button>
        <button
          onClick={() => applyFunction("factorial")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          x!
        </button>
      </div>
      {renderStandardButtons()}
    </>
  );

  const renderCalculusButtons = () => (
    <>
      <div className="flex mb-2">
        <button
          onClick={() => handleCalculusOperation("derivative")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          d/dx
        </button>
        <button
          onClick={() => handleCalculusOperation("integral")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ∫
        </button>
        <button
          onClick={() => handleCalculusOperation("limit")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          lim
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("x")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          x
        </button>
        <button
          onClick={() => appendToDisplay("(")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          (
        </button>
        <button
          onClick={() => appendToDisplay(")")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          )
        </button>
        <button
          onClick={() => appendToDisplay("+")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          +
        </button>
        <button
          onClick={() => appendToDisplay("-")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          -
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("*")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          *
        </button>
        <button
          onClick={() => appendToDisplay("/")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          /
        </button>
        <button
          onClick={() => appendToDisplay("^")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ^
        </button>
        <button
          onClick={() => applyFunction("sin")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          sin
        </button>
        <button
          onClick={() => applyFunction("cos")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          cos
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => applyFunction("tan")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          tan
        </button>
        <button
          onClick={() => applyFunction("ln")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ln
        </button>
        <button
          onClick={() => applyFunction("log")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          log
        </button>
        <button
          onClick={() => applyFunction("e")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          e
        </button>
        <button
          onClick={() => applyFunction("pi")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          π
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("7")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          7
        </button>
        <button
          onClick={() => appendToDisplay("8")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          8
        </button>
        <button
          onClick={() => appendToDisplay("9")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          9
        </button>
        <button
          onClick={clearEntry}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          CE
        </button>
        <button
          onClick={clearDisplay}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          C
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("4")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          4
        </button>
        <button
          onClick={() => appendToDisplay("5")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          5
        </button>
        <button
          onClick={() => appendToDisplay("6")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          6
        </button>
        <button
          onClick={() => setDisplay((prev) => prev.slice(0, -1) || "0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ⌫
        </button>
        <button
          onClick={calculateResult}
          className="flex-1 mx-1 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 active:bg-blue-700"
        >
          =
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("1")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          1
        </button>
        <button
          onClick={() => appendToDisplay("2")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          2
        </button>
        <button
          onClick={() => appendToDisplay("3")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          3
        </button>
        <button
          onClick={() => appendToDisplay("0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          0
        </button>
        <button
          onClick={() => appendToDisplay(".")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          .
        </button>
      </div>
    </>
  );

  const renderGeometryButtons = () => (
    <>
      <div className="flex mb-2">
        <button
          onClick={() => handleGeometryOperation("circle-area")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Circle Area
        </button>
        <button
          onClick={() => handleGeometryOperation("circle-circumference")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Circle Circum.
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => handleGeometryOperation("sphere-volume")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Sphere Vol.
        </button>
        <button
          onClick={() => handleGeometryOperation("sphere-surface-area")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Sphere Area
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => handleGeometryOperation("cube-volume")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Cube Vol.
        </button>
        <button
          onClick={() => handleGeometryOperation("cube-surface-area")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          Cube Area
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("7")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          7
        </button>
        <button
          onClick={() => appendToDisplay("8")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          8
        </button>
        <button
          onClick={() => appendToDisplay("9")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          9
        </button>
        <button
          onClick={() => appendToDisplay("/")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          /
        </button>
        <button
          onClick={clearDisplay}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          C
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("4")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          4
        </button>
        <button
          onClick={() => appendToDisplay("5")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          5
        </button>
        <button
          onClick={() => appendToDisplay("6")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          6
        </button>
        <button
          onClick={() => appendToDisplay("*")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ×
        </button>
        <button
          onClick={clearEntry}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          CE
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("1")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          1
        </button>
        <button
          onClick={() => appendToDisplay("2")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          2
        </button>
        <button
          onClick={() => appendToDisplay("3")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          3
        </button>
        <button
          onClick={() => appendToDisplay("-")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          -
        </button>
        <button
          onClick={() => setDisplay((prev) => prev.slice(0, -1) || "0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          ⌫
        </button>
      </div>
      <div className="flex mb-2">
        <button
          onClick={() => appendToDisplay("0")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          0
        </button>
        <button
          onClick={() => appendToDisplay(".")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          .
        </button>
        <button
          onClick={calculateResult}
          className="flex-1 mx-1 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 active:bg-blue-700"
        >
          =
        </button>
        <button
          onClick={() => appendToDisplay("+")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          +
        </button>
        <button
          onClick={() => applyFunction("pi")}
          className="flex-1 mx-1 py-3 bg-white rounded shadow hover:bg-gray-100 active:bg-gray-200"
        >
          π
        </button>
      </div>
    </>
  );

  return (
    <div className="p-3">
      {currentTab === "standard" && renderStandardButtons()}
      {currentTab === "scientific" && renderScientificButtons()}
      {currentTab === "calculus" && renderCalculusButtons()}
      {currentTab === "geometry" && renderGeometryButtons()}
    </div>
  );
};
