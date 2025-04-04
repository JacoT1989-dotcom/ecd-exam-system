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

  // Multiple choice questions (1-25) - now optional
  question1: z
    .enum(mcOptions, {
      errorMap: () => ({ message: "Please select option A, B, C, or D" }),
    })
    .optional(),
  question2: z.enum(mcOptions).optional(),
  question3: z.enum(mcOptions).optional(),
  question4: z.enum(mcOptions).optional(),
  question5: z.enum(mcOptions).optional(),
  question6: z.enum(mcOptions).optional(),
  question7: z.enum(mcOptions).optional(),
  question8: z.enum(mcOptions).optional(),
  question9: z.enum(mcOptions).optional(),
  question10: z.enum(mcOptions).optional(),
  question11: z.enum(mcOptions).optional(),
  question12: z.enum(mcOptions).optional(),
  question13: z.enum(mcOptions).optional(),
  question14: z.enum(mcOptions).optional(),
  question15: z.enum(mcOptions).optional(),
  question16: z.enum(mcOptions).optional(),
  question17: z.enum(mcOptions).optional(),
  question18: z.enum(mcOptions).optional(),
  question19: z.enum(mcOptions).optional(),
  question20: z.enum(mcOptions).optional(),
  question21: z.enum(mcOptions).optional(),
  question22: z.enum(mcOptions).optional(),
  question23: z.enum(mcOptions).optional(),
  question24: z.enum(mcOptions).optional(),
  question25: z.enum(mcOptions).optional(),

  // Text-based questions (26-50) - now optional
  question26: z.string().max(500).optional(),
  question27: z.string().max(500).optional(),
  question28: z.string().max(500).optional(),
  question29: z.string().max(500).optional(),
  question30: z.string().max(500).optional(),
  question31: z.string().max(500).optional(),
  question32: z.string().max(500).optional(),
  question33: z.string().max(500).optional(),
  question34: z.string().max(500).optional(),
  question35: z.string().max(500).optional(),
  question36: z.string().max(500).optional(),
  question37: z.string().max(500).optional(),
  question38: z.string().max(500).optional(),
  question39: z.string().max(500).optional(),
  question40: z.string().max(500).optional(),
  question41: z.string().max(500).optional(),
  question42: z.string().max(500).optional(),
  question43: z.string().max(500).optional(),
  question44: z.string().max(500).optional(),
  question45: z.string().max(500).optional(),
  question46: z.string().max(500).optional(),
  question47: z.string().max(500).optional(),
  question48: z.string().max(500).optional(),
  question49: z.string().max(500).optional(),
  question50: z.string().max(500).optional(),

  userId: z.string(),
});

// For form submission (without ID which will be set by the system)
export const lifeOrientationExamFormSchema = lifeOrientationExamSchema.omit({
  id: true,
});

// Helper function to generate default values for the form
export const getDefaultLifeOrientationExamValues = () => {
  return {
    title: "",
    grade: 12,
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
