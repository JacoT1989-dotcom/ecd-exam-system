// validation.ts
import { z } from "zod";

// Multiple choice options
const mcOptions = ["A", "B", "C", "D"] as const;

// Validation schema for Life Orientation Exam
export const lifeOrientationExamSchema = z.object({
  id: z.string().uuid().optional(), // Optional as it will be auto-generated
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100),
  grade: z
    .number()
    .int()
    .min(8, { message: "Grade must be at least 8" })
    .max(12),
  date: z.date().optional(), // Optional as it will default to current date

  // Multiple choice questions (1-25)
  question1: z.enum(mcOptions, {
    errorMap: () => ({ message: "Please select option A, B, C, or D" }),
  }),
  question2: z.enum(mcOptions),
  question3: z.enum(mcOptions),
  question4: z.enum(mcOptions),
  question5: z.enum(mcOptions),
  question6: z.enum(mcOptions),
  question7: z.enum(mcOptions),
  question8: z.enum(mcOptions),
  question9: z.enum(mcOptions),
  question10: z.enum(mcOptions),
  question11: z.enum(mcOptions),
  question12: z.enum(mcOptions),
  question13: z.enum(mcOptions),
  question14: z.enum(mcOptions),
  question15: z.enum(mcOptions),
  question16: z.enum(mcOptions),
  question17: z.enum(mcOptions),
  question18: z.enum(mcOptions),
  question19: z.enum(mcOptions),
  question20: z.enum(mcOptions),
  question21: z.enum(mcOptions),
  question22: z.enum(mcOptions),
  question23: z.enum(mcOptions),
  question24: z.enum(mcOptions),
  question25: z.enum(mcOptions),

  // Text-based questions (26-50)
  question26: z.string().min(1, { message: "Answer cannot be empty" }).max(500),
  question27: z.string().min(1).max(500),
  question28: z.string().min(1).max(500),
  question29: z.string().min(1).max(500),
  question30: z.string().min(1).max(500),
  question31: z.string().min(1).max(500),
  question32: z.string().min(1).max(500),
  question33: z.string().min(1).max(500),
  question34: z.string().min(1).max(500),
  question35: z.string().min(1).max(500),
  question36: z.string().min(1).max(500),
  question37: z.string().min(1).max(500),
  question38: z.string().min(1).max(500),
  question39: z.string().min(1).max(500),
  question40: z.string().min(1).max(500),
  question41: z.string().min(1).max(500),
  question42: z.string().min(1).max(500),
  question43: z.string().min(1).max(500),
  question44: z.string().min(1).max(500),
  question45: z.string().min(1).max(500),
  question46: z.string().min(1).max(500),
  question47: z.string().min(1).max(500),
  question48: z.string().min(1).max(500),
  question49: z.string().min(1).max(500),
  question50: z.string().min(1).max(500),

  userId: z.string(),
});

// For form submission (without ID and date which will be set by the system)
export const lifeOrientationExamFormSchema = lifeOrientationExamSchema.omit({
  id: true,
  date: true,
});

// Helper function to generate default values for the form
export const getDefaultLifeOrientationExamValues = () => {
  return {
    title: "",
    grade: 10,
    question1: undefined,
    question2: undefined,
    question3: undefined,
    question4: undefined,
    question5: undefined,
    question6: undefined,
    question7: undefined,
    question8: undefined,
    question9: undefined,
    question10: undefined,
    question11: undefined,
    question12: undefined,
    question13: undefined,
    question14: undefined,
    question15: undefined,
    question16: undefined,
    question17: undefined,
    question18: undefined,
    question19: undefined,
    question20: undefined,
    question21: undefined,
    question22: undefined,
    question23: undefined,
    question24: undefined,
    question25: undefined,
    question26: "",
    question27: "",
    question28: "",
    question29: "",
    question30: "",
    question31: "",
    question32: "",
    question33: "",
    question34: "",
    question35: "",
    question36: "",
    question37: "",
    question38: "",
    question39: "",
    question40: "",
    question41: "",
    question42: "",
    question43: "",
    question44: "",
    question45: "",
    question46: "",
    question47: "",
    question48: "",
    question49: "",
    question50: "",
    userId: "",
  };
};
