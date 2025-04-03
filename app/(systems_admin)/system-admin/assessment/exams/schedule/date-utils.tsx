/**
 * Date utilities for South African time zone
 *
 * Simple utility functions that handle formatting dates and times
 * for display without modifying the actual values.
 */

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string YYYY-MM-DD
 */
export const formatDateForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return new Date().toISOString().split("T")[0];
  }
};

/**
 * Format time for input fields (HH:MM)
 * @param {Date} date - The date to extract time from
 * @returns {string} Formatted time string HH:MM
 */
export const formatTimeForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      return new Date().toTimeString().substring(0, 5);
    }

    // Format as HH:MM
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time for input:", error);
    return new Date().toTimeString().substring(0, 5);
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

    // Normalize time string (handle partial inputs)
    let normalizedTime = timeStr;
    if (timeStr.length === 1) {
      normalizedTime = `0${timeStr}:00`;
    } else if (timeStr.length === 2) {
      normalizedTime = `${timeStr}:00`;
    } else if (timeStr.length === 4 && timeStr.includes(":")) {
      normalizedTime = `0${timeStr}`;
    }

    // Create a date with the time components
    // This creates a date in the browser's local timezone
    const result = new Date(`${dateStr}T${normalizedTime}`);

    // Validate the resulting date
    if (isNaN(result.getTime())) {
      console.warn("Invalid date created from:", { dateStr, timeStr });
      return new Date();
    }

    return result;
  } catch (error) {
    console.error("Error parsing date and time:", error, { dateStr, timeStr });
    return new Date();
  }
};

/**
 * Notification message component
 */
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
