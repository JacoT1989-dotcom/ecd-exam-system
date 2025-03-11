"use client";
import React, { useState } from "react";
import { X, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Subject } from "./types";
import {
  getColorValue,
  formatMonth,
  formatTime,
  formatExamDate,
} from "./utils";
import { subjects } from "./data";

const ExamCalendar = () => {
  // State variables
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedExam, setSelectedExam] = useState<Subject | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Calendar utility functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Build calendar days
  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border p-1 bg-gray-100"></div>,
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();

      // Check if this date has exams
      const examsOnDay = subjects.filter((subject) => {
        const examDate = subject.examDate;
        return (
          examDate.getFullYear() === date.getFullYear() &&
          examDate.getMonth() === date.getMonth() &&
          examDate.getDate() === date.getDate()
        );
      });

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-20 border p-1 ${isToday ? "bg-cyan-50 border-[#3e6788]" : ""}`}
        >
          <div className="flex justify-between">
            <span
              className={`font-semibold text-sm ${isToday ? "text-[#3e6788]" : ""}`}
            >
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {examsOnDay.map((exam) => (
              <div
                key={exam.id}
                className="text-xs p-1 rounded text-white truncate cursor-pointer"
                style={{ backgroundColor: getColorValue(exam.color) }}
                onClick={() => {
                  setSelectedExam(exam);
                  setShowModal(true);
                }}
              >
                {exam.name}
              </div>
            ))}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-10">
      {/* Calendar Header */}
      <div className="bg-[#3e6788] text-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Exam Calendar</h1>
            <p className="text-sm mt-1">
              View your upcoming exams and manage your study schedule
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#3e6788]">
            {formatMonth(currentDate)}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-[#3e6788] text-white rounded hover:bg-[#2d4d66]"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">{buildCalendarDays()}</div>
      </div>

      {/* Upcoming Exams Section */}
      <div className="p-4 border-t bg-gray-50">
        <h3 className="font-bold text-[#3e6788] mb-3 text-lg">
          Upcoming Exams
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {subjects
            .filter((subject) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const examDate = new Date(subject.examDate);
              examDate.setHours(0, 0, 0, 0);
              return examDate >= today;
            })
            .map((subject) => (
              <div
                key={subject.id}
                className="p-2 rounded cursor-pointer text-white"
                style={{ backgroundColor: getColorValue(subject.color) }}
                onClick={() => {
                  setSelectedExam(subject);
                  setShowModal(true);
                }}
              >
                <div className="font-semibold">{subject.name}</div>
                <div className="text-xs">
                  {subject.examDate.toLocaleDateString()},{" "}
                  {formatTime(subject.examDate)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Exam Details Modal */}
      {showModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b bg-[#3e6788] text-white">
              <h3 className="text-lg font-bold">Exam Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div
                className="w-full p-3 mb-4 rounded-lg text-white"
                style={{ backgroundColor: getColorValue(selectedExam.color) }}
              >
                <div className="text-2xl font-bold">{selectedExam.name}</div>
                <div className="text-sm">{selectedExam.code}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Description</div>
                <div className="font-medium">{selectedExam.description}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="font-medium">
                  {formatExamDate(selectedExam.examDate)}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#3e6788] text-white rounded hover:bg-[#2d4d66]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCalendar;
