// types.ts
import { z } from "zod";
import { lifeOrientationExamSchema } from "./validations";

// Type inference from the schema
export type LifeOrientationExamType = z.infer<typeof lifeOrientationExamSchema>;

// For form submission (without ID and date which will be set by the system)
export type LifeOrientationExamFormType = Omit<
  LifeOrientationExamType,
  "id" | "date"
>;

// Multiple choice answer options
export type MCOption = "A" | "B" | "C" | "D";

// Response type for the create action
export type CreateLifeOrientationExamResponse = {
  error?: string;
  success?: boolean;
  examId?: string;
};

// Question structure for client-side use
export type LifeOrientationQuestion = {
  id: string;
  text: string;
  type: "multipleChoice" | "text";
  options?: string[];
};
