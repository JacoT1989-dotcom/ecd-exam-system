"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ExamTimerProps {
  subjectDetails: any | null;
  examId: string | null;
  fetchSubjectDetails: () => Promise<any>;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  subjectDetails,
  examId,
  fetchSubjectDetails,
}) => {
  // State for timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Start with null until we know the actual time
  const [isActive, setIsActive] = useState(false); // Start inactive until we know the correct time
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerStatus, setTimerStatus] = useState<
    "not_started" | "in_progress" | "ended"
  >("not_started");

  // Calculate and set the correct remaining time based on subject details
  const calculateRemainingTime = useCallback(() => {
    if (
      !subjectDetails ||
      !subjectDetails.startingTime ||
      !subjectDetails.dueTime
    ) {
      setLoading(false);
      setError("No exam schedule information available");
      return;
    }

    try {
      const startTime = new Date(subjectDetails.startingTime);
      const dueTime = new Date(subjectDetails.dueTime);
      const now = new Date();

      // Apply the -2 hour correction for SAST timezone
      startTime.setHours(startTime.getHours() - 2);
      dueTime.setHours(dueTime.getHours() - 2);

      // If exam has started and not ended yet
      if (now >= startTime && now <= dueTime) {
        // Calculate remaining time in seconds
        const remainingMilliseconds = dueTime.getTime() - now.getTime();
        const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
        setTimeRemaining(remainingSeconds > 0 ? remainingSeconds : 0);
        setIsActive(true);
        setTimerStatus("in_progress");
      }
      // If exam hasn't started yet
      else if (now < startTime) {
        // For an upcoming exam, display time until start
        const timeUntilStart = Math.floor(
          (startTime.getTime() - now.getTime()) / 1000,
        );
        setTimeRemaining(timeUntilStart);
        setIsActive(false);
        setTimerStatus("not_started");
      }
      // If exam has ended
      else if (now > dueTime) {
        setTimeRemaining(0);
        setIsActive(false);
        setTimerStatus("ended");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error calculating remaining time", err);
      setError("Error calculating exam time");
      setLoading(false);
    }
  }, [subjectDetails]);

  // Set initial time when subject details change
  useEffect(() => {
    if (subjectDetails) {
      calculateRemainingTime();
    }
  }, [subjectDetails, calculateRemainingTime]);

  // If no data is passed, try to fetch it (as fallback)
  useEffect(() => {
    if (!subjectDetails && fetchSubjectDetails) {
      const loadData = async () => {
        try {
          setLoading(true);
          const result = await fetchSubjectDetails();
          if (result.error) {
            setError(result.error);
          }
          // No need to process the result here, as parent will re-render with new props
          setLoading(false);
        } catch (err) {
          console.error("Error fetching subject details", err);
          setError("Failed to load exam information");
          setLoading(false);
        }
      };

      loadData();
    }
  }, [subjectDetails, fetchSubjectDetails]);

  // Timer functionality - only run if we have a time and the timer is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Only start the countdown if we have a time value and the timer should be active
    if (isActive && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === null || prevTime <= 1) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            setTimerStatus("ended");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      setTimerStatus("ended");
    }

    // Cleanup the interval on component unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  // Format display based on timer status and remaining time
  const getTimerDisplay = () => {
    if (loading) {
      return { display: "Loading exam schedule...", color: "text-gray-500" };
    }

    if (error) {
      return { display: error, color: "text-red-500" };
    }

    if (timeRemaining === null) {
      return {
        display: "Loading exam schedule...",
        color: "text-gray-500",
      };
    }

    // Convert seconds to hours, minutes, seconds
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    // Format time as HH:MM:SS
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timerStatus === "not_started") {
      return {
        display: `Starts in ${formattedTime}`,
        color: "text-blue-600",
      };
    }

    if (timerStatus === "ended") {
      return {
        display: "Exam has ended",
        color: "text-gray-500",
      };
    }

    // In progress
    let color = "text-blue-600";
    if (timeRemaining < 300) {
      color = "text-red-600"; // Less than 5 minutes
    } else if (timeRemaining < 1800) {
      color = "text-red-600"; // Less than 30 minutes
    }

    return {
      display: formattedTime,
      color,
    };
  };

  // Format exam date and times for display
  const formatExamTimes = () => {
    if (
      !subjectDetails ||
      !subjectDetails.startingTime ||
      !subjectDetails.dueTime
    ) {
      return null;
    }

    try {
      const startTime = new Date(subjectDetails.startingTime);
      const dueTime = new Date(subjectDetails.dueTime);

      // Apply the -2 hour correction for SAST timezone
      startTime.setHours(startTime.getHours() - 2);
      dueTime.setHours(dueTime.getHours() - 2);

      // Format times for display
      const formatTimeComponent = (value: number): string => {
        return value.toString().padStart(2, "0");
      };

      const startHour = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      const dueHour = dueTime.getHours();
      const dueMinutes = dueTime.getMinutes();

      return {
        start: `${formatTimeComponent(startHour)}:${formatTimeComponent(startMinutes)}`,
        end: `${formatTimeComponent(dueHour)}:${formatTimeComponent(dueMinutes)}`,
      };
    } catch (error) {
      console.error("Error formatting exam times:", error);
      return null;
    }
  };

  const examTimes = formatExamTimes();
  const timerDisplay = getTimerDisplay();

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
          {timerStatus === "in_progress" ? "Time Remaining:" : "Exam Time:"}
        </span>
        <span className={`font-bold text-2xl ${timerDisplay.color}`}>
          {timerDisplay.display}
        </span>
      </div>

      {examTimes && (
        <div className="text-sm mt-1 text-gray-600">
          Scheduled: {examTimes.start} - {examTimes.end}
        </div>
      )}

      {subjectDetails && subjectDetails.title && (
        <div className="text-sm text-gray-600">
          Subject: {subjectDetails.title} ({subjectDetails.subjectCode})
          {examId && (
            <span className="ml-2">Exam ID: {examId.substring(0, 8)}</span>
          )}
        </div>
      )}

      {timeRemaining !== null &&
        timeRemaining < 1800 &&
        timerStatus === "in_progress" && (
          <p className="text-sm mt-1 text-red-600 font-medium">
            {timeRemaining < 300
              ? "Warning: Less than 5 minutes remaining!"
              : "Warning: Less than 30 minutes remaining!"}
          </p>
        )}

      {timerStatus === "ended" && (
        <p className="text-red-600 font-bold mt-2">
          Time&apos;s up! Your exam will be submitted automatically.
        </p>
      )}
    </div>
  );
};

export default ExamTimer;
