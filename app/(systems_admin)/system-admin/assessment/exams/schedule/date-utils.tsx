/**
 * Format date for input fields
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string YYYY-MM-DD
 */
export const formatDateForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      // Return today's date as fallback in UTC
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
    // Return date part only in UTC
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for input:", error);
    // Return today's date as fallback in UTC
    return new Date().toISOString().split("T")[0];
  }
};

/**
 * Format time for input fields
 * @param {Date} date - The date to extract time from
 * @returns {string} Formatted time string HH:MM in UTC
 */
export const formatTimeForInput = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      // Return current UTC time as fallback
      return new Date().toISOString().substring(11, 16);
    }
    // Return time part only in UTC
    return date.toISOString().substring(11, 16);
  } catch (error) {
    console.error("Error formatting time for input:", error);
    // Return current UTC time as fallback
    return new Date().toISOString().substring(11, 16);
  }
};

/**
 * Parse date and time strings to create a Date object in UTC
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {Date} Combined Date object in UTC
 */
export const parseDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    // If either input is empty or undefined, use current UTC date/time
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

    // Create ISO string in UTC (Z)
    const isoString = `${dateStr}T${normalizedTime}:00Z`;
    const result = new Date(isoString);

    // Validate the resulting date
    if (isNaN(result.getTime())) {
      console.warn("Invalid date created from:", {
        dateStr,
        timeStr,
        isoString,
      });
      return new Date(); // Return current date as fallback
    }

    return result;
  } catch (error) {
    console.error("Error parsing date and time:", error, { dateStr, timeStr });
    return new Date(); // Return current date as fallback
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
