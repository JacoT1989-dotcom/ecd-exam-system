"use client";
import React, { useState } from "react";
import * as math from "mathjs";
import {
  factorial,
  handleCalculusOperation,
  handleGeometryOperation,
} from "./calculatorUtils";
import { CalculatorDisplay } from "./_components/CalculatorDisplay";
import { CalculatorButtons } from "./_components/CalculatorButtons";

interface ScientificCalculatorProps {
  className?: string;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  className = "",
}) => {
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [isNewCalculation, setIsNewCalculation] = useState<boolean>(true);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("rad");

  // Create a type-safe set angle mode function
  const setAngleModeHandler = (mode: "deg" | "rad"): void => {
    setAngleMode(mode);
  };
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<
    "standard" | "scientific" | "calculus" | "geometry"
  >("scientific");

  const appendToDisplay = (value: string) => {
    if (isNewCalculation) {
      setDisplay(value);
      setIsNewCalculation(false);
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setIsNewCalculation(true);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const calculateResult = () => {
    try {
      let expression = display.replace(/π/g, "pi").replace(/√/g, "sqrt");

      // Convert trigonometric functions based on angle mode
      if (angleMode === "deg") {
        expression = expression
          .replace(/sin\(/g, "sin(pi/180*")
          .replace(/cos\(/g, "cos(pi/180*")
          .replace(/tan\(/g, "tan(pi/180*")
          .replace(/asin\(/g, `180/pi*asin(`)
          .replace(/acos\(/g, `180/pi*acos(`)
          .replace(/atan\(/g, `180/pi*atan(`);
      }

      const result = math.evaluate(expression);
      const formattedResult =
        typeof result === "number"
          ? parseFloat(result.toPrecision(10)).toString()
          : result.toString();

      setHistory((prev) =>
        [`${display} = ${formattedResult}`, ...prev].slice(0, 10),
      );
      setDisplay(formattedResult);
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay("Error");
      setIsNewCalculation(true);
    }
  };

  const handleMemoryOperation = (
    operation: "MC" | "MR" | "MS" | "M+" | "M-",
  ) => {
    switch (operation) {
      case "MC":
        setMemory(0);
        break;
      case "MR":
        setDisplay(memory.toString());
        setIsNewCalculation(true);
        break;
      case "MS":
        try {
          setMemory(parseFloat(display));
        } catch {
          setDisplay("Error");
        }
        setIsNewCalculation(true);
        break;
      case "M+":
        try {
          setMemory(memory + parseFloat(display));
        } catch {
          setDisplay("Error");
        }
        setIsNewCalculation(true);
        break;
      case "M-":
        try {
          setMemory(memory - parseFloat(display));
        } catch {
          setDisplay("Error");
        }
        setIsNewCalculation(true);
        break;
    }
  };

  const applyFunction = (func: string) => {
    try {
      let value = parseFloat(display);
      let result;

      switch (func) {
        case "sin":
        case "cos":
        case "tan":
          if (angleMode === "deg") {
            value = (value * Math.PI) / 180;
          }
          result = math.evaluate(`${func}(${value})`);
          break;
        case "asin":
        case "acos":
        case "atan":
          result = math.evaluate(`${func}(${value})`);
          if (angleMode === "deg") {
            result = (result * 180) / Math.PI;
          }
          break;
        case "ln":
          result = Math.log(value);
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "sqrt":
          result = Math.sqrt(value);
          break;
        case "square":
          result = value * value;
          break;
        case "cube":
          result = value * value * value;
          break;
        case "reciprocal":
          result = 1 / value;
          break;
        case "factorial":
          result = factorial(value);
          break;
        case "abs":
          result = Math.abs(value);
          break;
        case "exp":
          result = Math.exp(value);
          break;
        case "pi":
          result = Math.PI;
          break;
        case "e":
          result = Math.E;
          break;
        default:
          throw new Error("Unknown function");
      }

      const formattedResult = parseFloat(result.toPrecision(10)).toString();
      setDisplay(formattedResult);
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay("Error");
      setIsNewCalculation(true);
    }
  };

  const handleCalculusOp = (operation: string) => {
    const result = handleCalculusOperation(operation, display);
    setDisplay(result);
    setIsNewCalculation(true);
  };

  const handleGeometryOp = (operation: string) => {
    try {
      const value = parseFloat(display);
      const result = handleGeometryOperation(operation, value);
      const formattedResult = parseFloat(result.toPrecision(10)).toString();
      setDisplay(formattedResult);
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay("Error");
      setIsNewCalculation(true);
    }
  };

  return (
    <div className="space-y-4 mx-10">
      {/* Description above calculator */}
      <div className="bg-[#3e6788] p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">
          Scientific Calculator
        </h2>
      </div>

      {/* Calculator Component */}
      <div
        className={`calculator-container bg-[#3e6788] rounded-xl shadow-2xl overflow-hidden ${className}`}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Buttons */}
          <div className="md:w-3/5 bg-[#3e6788]">
            {/* Tabs */}
            <div className="flex border-b border-blue-700">
              {["standard", "scientific", "calculus", "geometry"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 px-2 font-medium text-sm capitalize transition-colors ${
                    currentTab === tab
                      ? "bg-[#2c4a63] text-white font-bold"
                      : "bg-[#3e6788] text-blue-100 hover:bg-[#365a7a]"
                  }`}
                  onClick={() => setCurrentTab(tab as any)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Calculator Buttons */}
            <div className="p-3 bg-[#3e6788] h-full overflow-y-auto pb-16">
              <CalculatorButtons
                currentTab={currentTab}
                angleMode={angleMode}
                setAngleMode={setAngleModeHandler}
                appendToDisplay={appendToDisplay}
                clearDisplay={clearDisplay}
                clearEntry={clearEntry}
                calculateResult={calculateResult}
                applyFunction={applyFunction}
                handleMemoryOperation={handleMemoryOperation}
                handleCalculusOperation={handleCalculusOp}
                handleGeometryOperation={handleGeometryOp}
                setDisplay={setDisplay}
              />
            </div>
          </div>

          {/* Right side - Display */}
          <div className="md:w-2/5 p-4 space-y-3 bg-[#2c4a63]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Result</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-100">
                  {memory !== 0 && "M"}
                </span>
                <span className="text-sm bg-[#3e6788] px-2 py-1 rounded text-white font-medium">
                  {angleMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Display area */}
            <div
              className="bg-[#2c4a63] border border-[#1c3952] p-4 rounded-lg text-right text-3xl font-medium text-white overflow-x-auto whitespace-nowrap h-24 flex items-center justify-end"
              style={{ fontFamily: "monospace" }}
            >
              {display}
            </div>

            {showHistory && (
              <div className="bg-[#2c4a63] p-3 rounded-lg max-h-48 overflow-y-auto border border-[#1c3952]">
                <h3 className="text-white font-medium mb-2 border-b border-[#1c3952] pb-1">
                  Calculation History
                </h3>
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm text-blue-100 text-right py-1 border-b border-[#1c3952]/30"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-blue-300 text-center py-2">
                    No history yet
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-2 bg-[#3e6788] hover:bg-[#365a7a] text-sm text-blue-100 hover:text-white transition-colors rounded border border-[#1c3952]"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
