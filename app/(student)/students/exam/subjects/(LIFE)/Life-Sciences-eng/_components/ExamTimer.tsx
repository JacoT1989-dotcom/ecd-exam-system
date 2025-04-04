"use client";

import React, { useState, useEffect } from "react";

const ExamTimer = () => {
  // Set initial time to 2 hours (in seconds)
  const initialTime = 2 * 60 * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Start the countdown when the component mounts
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      // Here you could add an auto-submit function if desired
    }

    // Cleanup the interval on component unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  // Convert seconds to hours, minutes, seconds
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  // Format time as HH:MM:SS
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // Set color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining < 300) return "text-red-600"; // Less than 5 minutes
    if (timeRemaining < 1800) return "text-red-600"; // Less than 30 minutes
    return "text-blue-600";
  };

  return (
    <div className="mt-6 text-center">
      <div className="inline-flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium text-gray-700 text-lg">
          Time Remaining:
        </span>
        <span className={`font-bold text-2xl ${getTimerColor()}`}>
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </span>
      </div>

      {timeRemaining < 1800 && (
        <p className="text-sm mt-1 text-red-600 font-medium">
          {timeRemaining < 300
            ? "Warning: Less than 5 minutes remaining!"
            : "Warning: Less than 30 minutes remaining!"}
        </p>
      )}

      {timeRemaining === 0 && (
        <p className="text-red-600 font-bold mt-2">
          Time&apos;s up! Your exam will be submitted automatically.
        </p>
      )}
    </div>
  );
};

export default ExamTimer;
