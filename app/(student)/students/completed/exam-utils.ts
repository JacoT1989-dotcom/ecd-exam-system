import {
  Subject,
  TimeRemaining,
} from "../../_components/(exam_card_timers)/types";

// Adjust time for SAST (UTC+2)
export const adjustForSAST = (date: Date): Date => {
  // Create a new date to avoid mutation
  const adjustedDate = new Date(date);
  // Subtract 2 hours to compensate for double timezone adjustment
  adjustedDate.setHours(adjustedDate.getHours() - 2);
  return adjustedDate;
};

// Check if an exam is currently available with time correction
export const isExamAvailable = (
  subject: Subject,
  currentTime: Date,
  isClient: boolean,
): boolean => {
  if (!isClient) {
    return false;
  }

  // If exam is not scheduled or not active, it can't be available
  if (!subject.isScheduled || subject.isActive === false) {
    return false;
  }

  const now = currentTime.getTime();

  if (!subject.startingTime || !subject.dueTime) {
    // If only examDate is set, check against that
    if (subject.examDate) {
      const examDate = new Date(subject.examDate);
      examDate.setHours(examDate.getHours() - 2);
      return now >= examDate.getTime();
    }
    return false;
  }

  // Apply -2 hour correction directly here
  const startTime = new Date(subject.startingTime);
  startTime.setHours(startTime.getHours() - 2);

  const dueTime = new Date(subject.dueTime);
  dueTime.setHours(dueTime.getHours() - 2);

  // Check if current time is within the exam window
  return now >= startTime.getTime() && now <= dueTime.getTime();
};

// Calculate time remaining for an exam with time correction
export const calculateTimeRemaining = (
  subject: Subject,
  currentTime: Date,
  isClient: boolean,
): TimeRemaining => {
  if (!isClient || !subject.isScheduled) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: false };
  }

  const now = currentTime.getTime();

  // Handle different timing scenarios based on available date fields
  if (!subject.startingTime || !subject.dueTime) {
    // If no specific times are set, use examDate
    if (!subject.examDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isAvailable: false,
      };
    }

    const targetDate = new Date(subject.examDate);
    // Apply the -2 hour correction
    targetDate.setHours(targetDate.getHours() - 2);

    const difference = targetDate.getTime() - now;
    // Exams are available when we reach or pass the exam date (difference <= 0)
    const isAvailable = difference <= 0;

    if (isAvailable) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: true };
    }

    // Calculate remaining time
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isAvailable: false };
  } else {
    // If we have specific starting and due times
    const startTime = new Date(subject.startingTime);
    const dueTime = new Date(subject.dueTime);

    // Apply the -2 hour correction
    startTime.setHours(startTime.getHours() - 2);
    dueTime.setHours(dueTime.getHours() - 2);

    // If we're before the start time, count down to start
    if (now < startTime.getTime()) {
      const difference = startTime.getTime() - now;

      const totalSeconds = Math.floor(difference / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      return { days, hours, minutes, seconds, isAvailable: false };
    }

    // If we're between start and due time (inclusive), the exam is available
    if (now <= dueTime.getTime()) {
      // Calculate time until exam ends
      const difference = dueTime.getTime() - now;

      const totalSeconds = Math.floor(difference / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      return { days, hours, minutes, seconds, isAvailable: true };
    }

    // If we're after the due time, exam is over
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isAvailable: false };
  }
};

// Format time parts for display
export const formatTimeParts = (timeObj: TimeRemaining): string => {
  const formattedTime = [
    String(timeObj.hours).padStart(2, "0"),
    String(timeObj.minutes).padStart(2, "0"),
    String(timeObj.seconds).padStart(2, "0"),
  ].join(":");

  const totalHours = timeObj.hours + timeObj.days * 24;

  return timeObj.days > 0
    ? `${totalHours}:${String(timeObj.minutes).padStart(2, "0")}:${String(timeObj.seconds).padStart(2, "0")} (${timeObj.days} days)`
    : formattedTime;
};

// Format exam time window for display with time correction
export const formatExamTimeWindow = (subject: Subject): string => {
  // For unscheduled exams
  if (!subject.isScheduled) {
    return "Not scheduled yet";
  }

  if (!subject.startingTime || !subject.dueTime) {
    return formatExamDate(subject.examDate);
  }

  // Create new date objects and subtract 2 hours
  const startTime = new Date(subject.startingTime);
  startTime.setHours(startTime.getHours() - 2);

  const dueTime = new Date(subject.dueTime);
  dueTime.setHours(dueTime.getHours() - 2);

  const month = startTime.toLocaleString("en-ZA", { month: "short" });
  const day = startTime.getDate();

  const startHour = startTime.getHours();
  const startMinute = String(startTime.getMinutes()).padStart(2, "0");
  const startPeriod = startHour >= 12 ? "PM" : "AM";
  const displayStartHour = startHour % 12 || 12;

  const dueHour = dueTime.getHours();
  const dueMinute = String(dueTime.getMinutes()).padStart(2, "0");
  const duePeriod = dueHour >= 12 ? "PM" : "AM";
  const displayDueHour = dueHour % 12 || 12;

  return `${month} ${day}, ${displayStartHour}:${startMinute} ${startPeriod} - ${displayDueHour}:${dueMinute} ${duePeriod}`;
};

// Format exam date for display with time correction
export const formatExamDate = (date: Date | null): string => {
  if (!date) return "Not scheduled yet";

  // Create a new date and subtract 2 hours
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() - 2);

  const month = adjustedDate.toLocaleString("en-ZA", { month: "short" });
  const day = adjustedDate.getDate();
  const hour = adjustedDate.getHours();
  const minute = String(adjustedDate.getMinutes()).padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${month} ${day}, ${displayHour}:${minute} ${period}`;
};

// Format time remaining for display with time correction
export const formatTimeRemaining = (
  subject: Subject,
  currentTime: Date,
  isClient: boolean,
): string => {
  if (!isClient) {
    return "Loading...";
  }

  const timeObj = calculateTimeRemaining(subject, currentTime, isClient);

  // If it's not scheduled, return appropriate message
  if (!subject.isScheduled) {
    return "Not scheduled yet";
  }

  // If exam is expired (past due time) with time correction
  if (subject.dueTime) {
    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);
    if (currentTime > dueTime) {
      return "Expired";
    }
  }

  // For available exams - directly use the isAvailable flag from timeObj
  if (timeObj.isAvailable) {
    // If all time components are 0, it might be at the exact end time
    if (
      timeObj.days === 0 &&
      timeObj.hours === 0 &&
      timeObj.minutes === 0 &&
      timeObj.seconds === 0
    ) {
      // Double check with due time
      if (subject.dueTime) {
        const dueTime = new Date(subject.dueTime);
        dueTime.setHours(dueTime.getHours() - 2);
        if (Math.abs(currentTime.getTime() - dueTime.getTime()) < 1000) {
          return "Expired";
        }
      }
    }
    return `Ends in ${formatTimeParts(timeObj)}`;
  }

  // For upcoming exams
  return `Starts in ${formatTimeParts(timeObj)}`;
};

// Get exam status for UI display and button styling with time correction
export const getExamStatus = (
  subject: Subject,
  completedExams: number[],
  currentTime: Date,
) => {
  // For unscheduled exams
  if (!subject.isScheduled) {
    return {
      isEnded: false,
      isAvailable: false,
      isUpcoming: false,
      statusText: "Not Scheduled",
      statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
    };
  }

  // Check if exam is in time window but inactive
  let isWithinTimeWindow = false;

  if (subject.startingTime && subject.dueTime) {
    // Apply the -2 hour correction
    const startTime = new Date(subject.startingTime);
    startTime.setHours(startTime.getHours() - 2);

    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);

    isWithinTimeWindow = currentTime >= startTime && currentTime <= dueTime;
  }

  // If exam is within time window but inactive, show a special status
  if (isWithinTimeWindow && subject.isActive === false) {
    return {
      isEnded: false,
      isAvailable: false,
      isUpcoming: false,
      statusText: "Inactive",
      statusClass: "bg-yellow-300 text-yellow-800 cursor-not-allowed",
    };
  }

  // Check if exam is inactive (and not in time window)
  if (subject.isActive === false) {
    return {
      isEnded: false,
      isAvailable: false,
      isUpcoming: false,
      statusText: "Inactive",
      statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
    };
  }

  const timeRemaining = calculateTimeRemaining(subject, currentTime, true);
  const isCompleted = completedExams.includes(subject.id);

  // Check if the exam is expired
  let isExpired = false;

  if (subject.dueTime) {
    const dueTime = new Date(subject.dueTime);
    dueTime.setHours(dueTime.getHours() - 2);
    isExpired = currentTime > dueTime;
  }

  if (isCompleted) {
    return {
      isEnded: true,
      isAvailable: false,
      isUpcoming: false,
      statusText: "Completed",
      statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
    };
  }

  if (isExpired) {
    return {
      isEnded: true,
      isAvailable: false,
      isUpcoming: false,
      statusText: "Expired",
      statusClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
    };
  }

  // Direct check for availability - using timeRemaining.isAvailable is more reliable
  if (timeRemaining.isAvailable) {
    return {
      isEnded: false,
      isAvailable: true,
      isUpcoming: false,
      statusText: "Start Exam",
      statusClass: "bg-[#3e6788] hover:bg-[#2d4d66] text-white",
    };
  }

  return {
    isEnded: false,
    isAvailable: false,
    isUpcoming: true,
    statusText: "Not Available Yet",
    statusClass: "bg-gray-100 text-gray-400",
  };
};

// Organize subjects into columns based on their status with time correction
export const organizeSubjects = (
  subjects: Subject[],
  completedExams: number[],
  currentTime: Date,
) => {
  const notAvailable: Subject[] = [];
  const inProgress: Subject[] = [];
  const completed: Subject[] = [];

  subjects.forEach((subject) => {
    // Check if exam is completed
    if (completedExams.includes(subject.id)) {
      completed.push(subject);
      return;
    }

    // Check for expired exams with time correction
    let isExpired = false;
    if (subject.dueTime) {
      const dueTime = new Date(subject.dueTime);
      dueTime.setHours(dueTime.getHours() - 2);
      isExpired = currentTime > dueTime;
    }

    if (isExpired) {
      completed.push(subject);
      return;
    }

    // Check if the exam is currently within its scheduled time window
    // with time correction
    let isWithinTimeWindow = false;
    if (subject.startingTime && subject.dueTime) {
      const startTime = new Date(subject.startingTime);
      startTime.setHours(startTime.getHours() - 2);

      const dueTime = new Date(subject.dueTime);
      dueTime.setHours(dueTime.getHours() - 2);

      isWithinTimeWindow = currentTime >= startTime && currentTime <= dueTime;
    }

    // If the exam is within its time window, put it in inProgress
    if (isWithinTimeWindow) {
      inProgress.push(subject);
    } else {
      notAvailable.push(subject);
    }
  });

  // Sort not available exams by date with time correction
  notAvailable.sort((a, b) => {
    if (!a.startingTime && !b.startingTime) {
      if (!a.examDate && !b.examDate) return 0;
      if (!a.examDate) return 1;
      if (!b.examDate) return -1;

      const aExamDate = new Date(a.examDate);
      aExamDate.setHours(aExamDate.getHours() - 2);

      const bExamDate = new Date(b.examDate);
      bExamDate.setHours(bExamDate.getHours() - 2);

      return aExamDate.getTime() - bExamDate.getTime();
    }

    if (!a.startingTime) return 1;
    if (!b.startingTime) return -1;

    const aStartTime = new Date(a.startingTime);
    aStartTime.setHours(aStartTime.getHours() - 2);

    const bStartTime = new Date(b.startingTime);
    bStartTime.setHours(bStartTime.getHours() - 2);

    return aStartTime.getTime() - bStartTime.getTime();
  });

  // Sort in-progress exams by due date with time correction (closest due date first)
  inProgress.sort((a, b) => {
    if (!a.dueTime && !b.dueTime) return 0;
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;

    const aDueTime = new Date(a.dueTime);
    aDueTime.setHours(aDueTime.getHours() - 2);

    const bDueTime = new Date(b.dueTime);
    bDueTime.setHours(bDueTime.getHours() - 2);

    return aDueTime.getTime() - bDueTime.getTime();
  });

  return { notAvailable, inProgress, completed };
};
