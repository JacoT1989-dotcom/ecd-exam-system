import * as z from "zod";

export const examCenterSchema = z.object({
  examinationNumber: z.string().min(1, "Examination number is required"),
  year: z.coerce.number().int().min(2000, "Valid year is required"),
  province: z.string().min(1, "Province is required"),
  centerName: z.string().min(1, "Examination center name is required"),
});

export type ExamCenterFormValues = z.infer<typeof examCenterSchema>;
