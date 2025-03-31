import * as z from "zod";

export const subjectSelectionSchema = z.object({
  selectedSubjects: z
    .array(z.string())
    .min(1, "Please select at least one subject")
    .max(10, "You can select up to 10 subjects"),
});

export type SubjectSelectionFormValues = z.infer<typeof subjectSelectionSchema>;
