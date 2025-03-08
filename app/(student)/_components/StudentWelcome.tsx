"use client";
import { useEffect, useState } from "react";
import { useSession } from "../SessionProvider";

// Define interface for subject
interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  examDate: Date;
  color: string;
}

// Define interface for time remaining object
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAvailable: boolean;
}

const StudentWelcome = () => {
  const { user } = useSession();
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Current date to set fixed exam dates
  const baseDate = new Date();

  // Dummy subject data with FIXED exam dates
  const subjects: Subject[] = [
    {
      id: 1,
      name: "Mathematics",
      code: "MTH301",
      description: "Advanced Calculus and Linear Algebra",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 2,
        8,
        7,
        0,
      ), // Mar 9, 08:07 PM
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Physics",
      code: "PHY201",
      description: "Classical Mechanics and Electromagnetism",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 5,
        8,
        7,
        0,
      ), // Mar 12, 08:07 PM
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Computer Science",
      code: "CS401",
      description: "Data Structures and Algorithms",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        9,
        7,
        0,
      ), // Mar 7, 09:07 PM (today)
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Biology",
      code: "BIO101",
      description: "Introduction to Molecular Biology",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 1,
        8,
        7,
        0,
      ), // Mar 8, 08:07 AM
      color: "bg-yellow-500",
    },
    {
      id: 5,
      name: "Chemistry",
      code: "CHM202",
      description: "Organic Chemistry",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 3,
        8,
        7,
        0,
      ), // Mar 10, 08:07 PM
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "History",
      code: "HIS305",
      description: "Modern World History",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 7,
        8,
        7,
        0,
      ), // Mar 14, 08:07 PM
      color: "bg-indigo-500",
    },
    {
      id: 7,
      name: "Literature",
      code: "LIT201",
      description: "Contemporary Fiction Analysis",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 4,
        8,
        7,
        0,
      ), // Mar 11, 08:07 PM
      color: "bg-pink-500",
    },
    {
      id: 8,
      name: "Economics",
      code: "ECO301",
      description: "Macroeconomics and Financial Markets",
      examDate: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + 6,
        8,
        7,
        0,
      ), // Mar 13, 08:07 PM
      color: "bg-teal-500",
    },
  ];

  // Update current time every second to keep timers accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Function to calculate remaining time until exam
  const calculateTimeRemaining = (examDate: Date): TimeRemaining => {
    const difference = examDate.getTime() - currentTime.getTime();

    // Return zeros if the exam date is in the past
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: true };
    }

    // Calculate time units
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    // Calculate remaining units (traditional countdown style)
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isAvailable: false };
  };

  // Format time remaining as HH:MM:SS with days in brackets
  const formatTimeRemaining = (timeObj: TimeRemaining): string => {
    if (timeObj.isAvailable) {
      return "Available now";
    }

    // Format as HH:MM:SS for display
    const formattedTime = [
      String(timeObj.hours).padStart(2, "0"),
      String(timeObj.minutes).padStart(2, "0"),
      String(timeObj.seconds).padStart(2, "0"),
    ].join(":");

    // Calculate total hours including days
    const totalHours = timeObj.hours + timeObj.days * 24;

    // Add days in brackets if there are any
    return timeObj.days > 0
      ? `${totalHours}:${String(timeObj.minutes).padStart(2, "0")}:${String(timeObj.seconds).padStart(2, "0")} (${timeObj.days} days)`
      : formattedTime;
  };

  // Format exam date for display
  const formatExamDate = (date: Date): string => {
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${month} ${day}, ${displayHour}:${minute} ${period}`;
  };

  // Handle exam card click
  const handleExamClick = (subject: Subject): void => {
    const timeRemaining = calculateTimeRemaining(subject.examDate);

    if (timeRemaining.isAvailable) {
      // Navigate to exam route
      window.location.href = `/exam/${subject.id}`;
    } else {
      // Show unavailable modal
      setSelectedSubject(subject);
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#3e6788] mb-2">
          {greeting}, {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-2">
          Welcome to your examination dashboard. Below you&apos;ll find all your
          upcoming exams.
        </p>
        <p className="text-sm text-gray-500">
          Exams will become available for writing when the timer reaches zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject: Subject) => {
          const timeRemaining = calculateTimeRemaining(subject.examDate);
          const timeDisplay = formatTimeRemaining(timeRemaining);
          const isAvailable = timeRemaining.isAvailable;
          const examDateDisplay = formatExamDate(subject.examDate);

          return (
            <a
              key={subject.id}
              href={isAvailable ? `/exam/${subject.id}` : "#"}
              onClick={(e) => {
                e.preventDefault();
                handleExamClick(subject);
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
                    <span className="text-sm font-medium">
                      {examDateDisplay}
                    </span>
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
        })}
      </div>

      {/* Unavailable Exam Modal */}
      {showModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Exam Not Available
            </h3>
            <p className="text-gray-600 mb-6">
              This exam for{" "}
              <span className="font-semibold">{selectedSubject.name}</span> is
              not available until{" "}
              <span className="font-semibold">
                {formatExamDate(selectedSubject.examDate)}
              </span>
              .
              <br />
              <br />
              Please log in again at the correct time to access this exam.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#3e6788] hover:bg-[#2d4d66] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWelcome;
