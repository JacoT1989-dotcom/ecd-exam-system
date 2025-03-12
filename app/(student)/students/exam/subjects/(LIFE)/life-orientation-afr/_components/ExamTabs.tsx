import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Import section components
import { SectionOne } from "./SectionOne";
import { SectionTwo } from "./SectionTwo";
import { SectionThree } from "./SectionThree";
import { SectionFour } from "./SectionFour";
import { SectionFive } from "./SectionFive";

// Import types and validation schemas - Updated to use Afrikaans schema
import { skepLewensorientringEksamen } from "../actions";
import { LewensorientringEksamenVormTipe } from "../types";
import {
  lewensorientringEksamenVormSkema,
  getVerstekLewensorientringEksamenWaardes,
} from "../validations";

// Maintain original function name while updating internals to use Afrikaans schema
export function ExamTabs({ subjectName = "", subjectCode = "" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize form with default values, using the subject name for the title
  const form = useForm<LewensorientringEksamenVormTipe>({
    resolver: zodResolver(lewensorientringEksamenVormSkema),
    defaultValues: {
      ...getVerstekLewensorientringEksamenWaardes(),
      titel: subjectName ? `${subjectName} ${subjectCode} Eksamen` : "",
    },
  });

  const onSubmit = async (data: LewensorientringEksamenVormTipe) => {
    setIsSubmitting(true);
    try {
      const result = await skepLewensorientringEksamen(data);

      if (result.sukses && result.eksamenId) {
        toast.success("Exam submitted successfully", {
          description: "Your exam has been saved.",
        });
        router.push(`/students/exam/${result.eksamenId}`);
      } else {
        toast.error("Error submitting exam", {
          description: result.fout || "Something went wrong. Please try again.",
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
  const getSectionCompletion = (start: number, end: number) => {
    const values = form.getValues();
    let completed = 0;
    let total = end - start + 1;

    for (let i = start; i <= end; i++) {
      // Map question field names to Afrikaans schema field names
      const fieldName = `vraag${i}` as keyof LewensorientringEksamenVormTipe;
      if (values[fieldName]) {
        completed++;
      }
    }

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const [activeTab, setActiveTab] = useState("section1");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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
          {/* Exam Header Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h1 className="text-2xl font-bold mb-4">Life Orientation Exam</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="titel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter exam title (e.g., Term 3 Life Orientation Exam)"
                          readOnly={!!subjectName} // Make field read-only if subject name is provided
                          className={
                            !!subjectName
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }
                          {...field}
                        />
                      </FormControl>
                      {!!subjectName && (
                        <p className="text-xs text-gray-500 mt-1">
                          This field is automatically populated based on the
                          selected exam.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="graad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input px-3 py-2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          value={field.value}
                        >
                          <option value={12}>Grade 12</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Main Tabs Component */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="section1">
                Section 1
                <span className="ml-2 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                  {getSectionCompletion(1, 10).completed}/
                  {getSectionCompletion(1, 10).total}
                </span>
              </TabsTrigger>
              <TabsTrigger value="section2">
                Section 2
                <span className="ml-2 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                  {getSectionCompletion(11, 20).completed}/
                  {getSectionCompletion(11, 20).total}
                </span>
              </TabsTrigger>
              <TabsTrigger value="section3">
                Section 3
                <span className="ml-2 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                  {getSectionCompletion(21, 30).completed}/
                  {getSectionCompletion(21, 30).total}
                </span>
              </TabsTrigger>
              <TabsTrigger value="section4">
                Section 4
                <span className="ml-2 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                  {getSectionCompletion(31, 40).completed}/
                  {getSectionCompletion(31, 40).total}
                </span>
              </TabsTrigger>
              <TabsTrigger value="section5">
                Section 5
                <span className="ml-2 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                  {getSectionCompletion(41, 50).completed}/
                  {getSectionCompletion(41, 50).total}
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <TabsContent value="section1">
                <SectionOne form={form} />
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={goToNextSection}>
                    Next Section
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="section2">
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
              </TabsContent>

              <TabsContent value="section3">
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
              </TabsContent>

              <TabsContent value="section4">
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
              </TabsContent>

              <TabsContent value="section5">
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
              </TabsContent>
            </div>
          </Tabs>

          {/* Exam Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium mb-4">Exam Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Completion:</span>
                <span className="font-medium">
                  {getSectionCompletion(1, 50).completed}/
                  {getSectionCompletion(1, 50).total} questions answered
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${getSectionCompletion(1, 50).percentage}%`,
                  }}
                ></div>
              </div>

              {/* Section breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                {[
                  { name: "Section 1", start: 1, end: 10 },
                  { name: "Section 2", start: 11, end: 20 },
                  { name: "Section 3", start: 21, end: 30 },
                  { name: "Section 4", start: 31, end: 40 },
                  { name: "Section 5", start: 41, end: 50 },
                ].map((section) => {
                  const { completed, total, percentage } = getSectionCompletion(
                    section.start,
                    section.end,
                  );
                  return (
                    <div key={section.name} className="text-center">
                      <p className="text-sm font-medium mb-1">{section.name}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {completed}/{total}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
