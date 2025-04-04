// Define interface for subject
// This file should be saved as types.ts in the same directory as the other components
export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  examDate: Date | null; // Allow null values
  startingTime: Date | null; // Allow null values
  dueTime: Date | null; // Allow null values
  isActive?: boolean;
  isScheduled?: boolean; // Add flag to indicate if exam is scheduled
  color: string;
}

// Define interface for time remaining object
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAvailable: boolean;
}
