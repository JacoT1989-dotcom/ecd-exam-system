export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  examDate: Date;
  color: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAvailable: boolean;
}
