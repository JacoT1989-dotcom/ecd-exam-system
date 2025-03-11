// Utility functions for the Exam Calendar

// Function to convert Tailwind color class to actual color value
export const getColorValue = (colorClass: string) => {
  switch (colorClass) {
    case "bg-blue-500":
      return "#3e6788";
    case "bg-purple-500":
      return "#9061F9";
    case "bg-green-500":
      return "#10B981";
    case "bg-yellow-500":
      return "#F59E0B";
    case "bg-red-500":
      return "#EF4444";
    case "bg-indigo-500":
      return "#6366F1";
    case "bg-pink-500":
      return "#EC4899";
    case "bg-teal-500":
      return "#14B8A6";
    default:
      return "#3e6788";
  }
};

// Format date for display
export const formatMonth = (date: Date) => {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

// Format time for display
export const formatTime = (date: Date) => {
  return date.toLocaleString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Format date for display in the modal
export const formatExamDate = (date: Date) => {
  return date.toLocaleString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
