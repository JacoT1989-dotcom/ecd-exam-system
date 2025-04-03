// date-utils.js

/**
 * Format date for input fields
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string YYYY-MM-DD
 */
export const formatDateForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      // Return today's date as fallback
      return new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for input:", error);
    // Return today's date as fallback
    return new Date().toISOString().split("T")[0];
  }
};

/**
 * Format time for input fields
 * @param {Date} date - The date to extract time from
 * @returns {string} Formatted time string HH:MM
 */
export const formatTimeForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      // Return current time as fallback
      return new Date().toISOString().split("T")[1].substring(0, 5);
    }
    return date.toISOString().split("T")[1].substring(0, 5);
  } catch (error) {
    console.error("Error formatting time for input:", error);
    // Return current time as fallback
    return new Date().toISOString().split("T")[1].substring(0, 5);
  }
};

/**
 * Parse date and time strings to create a Date object
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {Date} Combined Date object
 */
export const parseDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    // If either input is empty or undefined, use current date/time
    if (!dateStr || !timeStr) {
      console.warn("Empty date/time input", { dateStr, timeStr });
      return new Date();
    }

    // Handle potential partial time input (e.g., user typing "14:" instead of "14:00")
    let normalizedTimeStr = timeStr;
    if (timeStr.endsWith(":")) {
      normalizedTimeStr = timeStr + "00";
    } else if (timeStr.indexOf(":") === -1 && timeStr.length <= 2) {
      normalizedTimeStr = timeStr + ":00";
    }

    // Split and convert to numbers with validation
    const dateParts = dateStr.split("-");
    const timeParts = normalizedTimeStr.split(":");

    if (dateParts.length !== 3) {
      console.warn("Invalid date format", { dateStr });
      return new Date();
    }

    if (timeParts.length !== 2) {
      console.warn("Invalid time format, attempting to normalize", {
        timeStr,
        normalizedTimeStr,
      });
      // Try an alternative approach for time
      const hour = parseInt(normalizedTimeStr.substring(0, 2) || "0", 10);
      const minute = parseInt(normalizedTimeStr.substring(3, 5) || "0", 10);

      // Convert to numbers explicitly for date
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);

      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hour) ||
        isNaN(minute)
      ) {
        console.warn("Invalid values in alternative parsing", {
          year,
          month,
          day,
          hour,
          minute,
        });
        return new Date();
      }

      // Create the date - month is 0-indexed in JavaScript Date
      const monthIndex = month - 1;
      const result = new Date(year, monthIndex, day, hour, minute);

      if (isNaN(result.getTime())) {
        console.warn("Alternative parsing generated invalid date", result);
        return new Date();
      }

      return result;
    }

    // Standard path - convert to numbers explicitly
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const hour = Number(timeParts[0]);
    const minute = Number(timeParts[1]);

    // Validate each number individually
    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      isNaN(hour) ||
      isNaN(minute)
    ) {
      console.warn("Invalid date/time values", {
        year,
        month,
        day,
        hour,
        minute,
      });
      return new Date();
    }

    // Create the date - month is 0-indexed in JavaScript Date
    const monthIndex = month - 1;
    const result = new Date(year, monthIndex, day, hour, minute);

    // Final validation of the date
    if (isNaN(result.getTime())) {
      console.warn("Generated invalid date", result);
      return new Date();
    }

    console.log("Successfully parsed date/time:", result.toISOString());
    return result;
  } catch (error) {
    console.error("Error parsing date and time:", error, {
      dateStr,
      timeStr,
    });
    return new Date();
  }
};

// NotificationMessage.jsx

import React from "react";

interface NotificationProps {
  notification: {
    type: "success" | "error";
    message: string;
  };
}

export const NotificationMessage: React.FC<NotificationProps> = ({
  notification,
}) => {
  return (
    <div
      className={`${
        notification.type === "success"
          ? "bg-green-100 border-green-400 text-green-700"
          : "bg-red-100 border-red-400 text-red-700"
      } px-4 py-3 rounded mb-6 border`}
    >
      <p>{notification.message}</p>
    </div>
  );
};
