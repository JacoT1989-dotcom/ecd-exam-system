import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import section components
import { SectionOne } from "./SectionOne";
import { SectionTwo } from "./SectionTwo";
import { SectionThree } from "./SectionThree";
import { SectionFour } from "./SectionFour";
import { SectionFive } from "./SectionFive";

// Import types and validation schemas
import { LifeOrientationExamFormType } from "../types";
import { lifeOrientationExamFormSchema } from "../validations";
import { getDefaultLifeOrientationExamValues } from "../validations";
import { createLifeOrientationExam } from "../actions";
import { ExamProgressContext } from "../../layout";

// Update the ExamTabs function signature to accept the props
export function ExamTabs({ subjectName = "", subjectCode = "" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Get the progress context including the exam title and grade
  const { updateProgress, activeTab, setActiveTab, examTitle, examGrade } =
    useContext(ExamProgressContext);

  // Initialize form with default values, using the context values for title and grade
  const form = useForm<LifeOrientationExamFormType>({
    resolver: zodResolver(lifeOrientationExamFormSchema),
    defaultValues: {
      ...getDefaultLifeOrientationExamValues(),
      title: examTitle,
      grade: examGrade,
    },
  });

  // Update the form when the examTitle or examGrade changes in context
  useEffect(() => {
    // Always set the title in the form from context - now it's non-editable
    form.setValue("title", examTitle);
    form.setValue("grade", examGrade);
  }, [examTitle, examGrade, form]);

  const onSubmit = async (data: LifeOrientationExamFormType) => {
    setIsSubmitting(true);
    try {
      const result = await createLifeOrientationExam(data);

      if (result.success && result.examId) {
        toast.success("Exam submitted successfully", {
          description: "Your exam has been saved.",
        });
        router.push(`/students/exam/${result.examId}`);
      } else {
        toast.error("Error submitting exam", {
          description:
            result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error submitting exam", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate completion percentage for each section
  const getSectionCompletion = React.useCallback(
    (start: number, end: number) => {
      const values = form.getValues();
      let completed = 0;
      let total = end - start + 1;

      for (let i = start; i <= end; i++) {
        const fieldName = `question${i}` as keyof LifeOrientationExamFormType;
        if (values[fieldName]) {
          completed++;
        }
      }

      return {
        completed,
        total,
        percentage: Math.round((completed / total) * 100),
      };
    },
    [form],
  );

  // Update the progress whenever form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      // Calculate all section completions
      const section1 = getSectionCompletion(1, 10);
      const section2 = getSectionCompletion(11, 20);
      const section3 = getSectionCompletion(21, 30);
      const section4 = getSectionCompletion(31, 40);
      const section5 = getSectionCompletion(41, 50);

      // Calculate overall completion
      const overallCompleted =
        section1.completed +
        section2.completed +
        section3.completed +
        section4.completed +
        section5.completed;

      // Update progress via context
      updateProgress({
        overall: { completed: overallCompleted, total: 50 },
        sections: [
          {
            name: "Section 1",
            completed: section1.completed,
            total: section1.total,
          },
          {
            name: "Section 2",
            completed: section2.completed,
            total: section2.total,
          },
          {
            name: "Section 3",
            completed: section3.completed,
            total: section3.total,
          },
          {
            name: "Section 4",
            completed: section4.completed,
            total: section4.total,
          },
          {
            name: "Section 5",
            completed: section5.completed,
            total: section5.total,
          },
        ],
      });
    });

    // Cleanup the subscription
    return () => subscription.unsubscribe();
  }, [form, updateProgress, getSectionCompletion]);

  // Navigation functions
  const goToNextSection = () => {
    const sections = [
      "section1",
      "section2",
      "section3",
      "section4",
      "section5",
    ];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1]);
    }
  };

  const goToPreviousSection = () => {
    const sections = [
      "section1",
      "section2",
      "section3",
      "section4",
      "section5",
    ];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(sections[currentIndex - 1]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Content without TabsList */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {activeTab === "section1" && (
              <>
                <SectionOne form={form} />
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={goToNextSection}>
                    Next Section
                  </Button>
                </div>
              </>
            )}

            {activeTab === "section2" && (
              <>
                <SectionTwo form={form} />
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousSection}
                  >
                    Previous Section
                  </Button>
                  <Button type="button" onClick={goToNextSection}>
                    Next Section
                  </Button>
                </div>
              </>
            )}

            {activeTab === "section3" && (
              <>
                <SectionThree form={form} />
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousSection}
                  >
                    Previous Section
                  </Button>
                  <Button type="button" onClick={goToNextSection}>
                    Next Section
                  </Button>
                </div>
              </>
            )}

            {activeTab === "section4" && (
              <>
                <SectionFour form={form} />
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousSection}
                  >
                    Previous Section
                  </Button>
                  <Button type="button" onClick={goToNextSection}>
                    Next Section
                  </Button>
                </div>
              </>
            )}

            {activeTab === "section5" && (
              <>
                <SectionFive form={form} />
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousSection}
                  >
                    Previous Section
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Exam"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
