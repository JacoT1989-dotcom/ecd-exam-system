import { z } from "zod";
// Validation schema for staff identifier
export const staffIdentifierSchema = z.object({
  staffTitle: z.string().min(1, "Staff title is required"),
  govNumber: z
    .string()
    .min(1, "Government identification number is required")
    .refine((value) => /^\d+$/.test(value), {
      message: "Government number must contain only digits",
    })
    // The BigInt in the database can hold much larger numbers, but we'll validate a reasonable length
    .refine((value) => value.length >= 5 && value.length <= 20, {
      message: "Government number must be between 5 and 20 digits long",
    }),
});

export type StaffIdentifierFormValues = z.infer<typeof staffIdentifierSchema>;
