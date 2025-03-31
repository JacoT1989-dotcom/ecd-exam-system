"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "../_actions/actions";
import { createOrUpdateExamCenter } from "../_actions/exam-center-details";
import { registerUserSubjects } from "../_actions/subject-actions";
import { RegisterFormValues } from "../_validations/validation";
import { ExamCenterFormValues } from "../_validations/exam-validations";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectOption {
  name: string;
  code: string;
}

interface SubjectSelectionFormProps {
  userData: RegisterFormValues;
  examCenterData: ExamCenterFormValues;
  onPrevStep: () => void;
  onComplete: (userId: string, selectedSubjectCodes: string[]) => void;
  inModal?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const SubjectSelectionForm: React.FC<SubjectSelectionFormProps> = ({
  userData,
  examCenterData,
  onPrevStep,
  onComplete,
  inModal = false,
  setIsOpen,
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectOption[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string>("");

  // Dummy subject list
  const subjectOptions: SubjectOption[] = [
    { name: "Mathematics", code: "MATH101" },
    { name: "Physical Sciences", code: "PHYS101" },
    { name: "Life Sciences", code: "LIFE101" },
    { name: "Geography", code: "GEOG101" },
    { name: "History", code: "HIST101" },
    { name: "English Home Language", code: "ENHL101" },
    { name: "Afrikaans First Additional Language", code: "AFAL101" },
    { name: "Economics", code: "ECON101" },
    { name: "Business Studies", code: "BUSS101" },
    { name: "Accounting", code: "ACCO101" },
    { name: "Computer Applications Technology", code: "CAT101" },
    { name: "Information Technology", code: "IT101" },
    { name: "Tourism", code: "TOUR101" },
    { name: "Consumer Studies", code: "CONS101" },
    { name: "Agricultural Sciences", code: "AGRI101" },
    { name: "Visual Arts", code: "VART101" },
    { name: "Music", code: "MUSI101" },
    { name: "Dramatic Arts", code: "DRAM101" },
    { name: "Sepedi Home Language", code: "SEHL101" },
    { name: "Zulu Home Language", code: "ZUHL101" },
  ];

  // Handle adding a subject
  const addSubject = () => {
    if (!currentSelection) return;

    const subject = subjectOptions.find((s) => s.name === currentSelection);
    if (!subject) return;

    // Check if this subject is already selected
    if (selectedSubjects.some((s) => s.code === subject.code)) {
      toast.error(`${subject.name} is already selected`);
      return;
    }

    // Check if we're at the maximum limit
    if (selectedSubjects.length >= 10) {
      toast.error("You can select up to 10 subjects only");
      return;
    }

    // Add the subject
    setSelectedSubjects([...selectedSubjects, subject]);
    // Reset selection
    setCurrentSelection("");
  };

  // Handle removing a subject
  const removeSubject = (code: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s.code !== code));
  };

  // Available subjects (filtered to exclude already selected ones)
  const availableSubjects = subjectOptions.filter(
    (subject) => !selectedSubjects.some((s) => s.code === subject.code),
  );

  const onSubmit = async () => {
    try {
      setIsPending(true);

      // Validate subject selection
      if (selectedSubjects.length === 0) {
        toast.error("Please select at least one subject");
        return;
      }

      console.log("Submitting user data:", userData);
      const userResult = await signUp(userData);

      if (userResult?.error) {
        toast.error(userResult.error);
        return;
      }

      console.log("User registration successful, result:", userResult);

      // Check if we got a userId back from the signup function
      if (userResult?.userId) {
        console.log("Creating exam center for user:", userResult.userId);

        // Then create the exam center using the userId
        const examCenterResult = await createOrUpdateExamCenter(
          examCenterData,
          userResult.userId,
        );

        if (examCenterResult?.error) {
          console.error("Exam center creation failed:", examCenterResult.error);
          toast.error(examCenterResult.error);
          return;
        }

        console.log("Exam center creation successful");

        // Register selected subjects
        const selectedSubjectCodes = selectedSubjects.map((s) => s.code);
        if (selectedSubjectCodes.length > 0) {
          console.log("Registering subjects for user:", userResult.userId);
          const subjectResult = await registerUserSubjects(
            selectedSubjectCodes,
            userResult.userId,
          );

          if (subjectResult?.error) {
            console.error("Subject registration failed:", subjectResult.error);
            toast.error(subjectResult.error);
            // Continue with registration even if subject registration fails
          } else {
            console.log("Subject registration successful");
          }
        }

        toast.success("Registration successful!");

        // First close the modal if we're in modal mode
        if (inModal && setIsOpen) {
          setIsOpen(false);
        }

        // Call the completion callback
        onComplete(userResult.userId, selectedSubjectCodes);
      } else {
        console.error("No userId returned from signUp");
        toast.error(
          "User created but additional setup failed. Please log in and complete your profile setup later.",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select up to 10 subjects using the dropdown below. Your selections
              will appear below.
            </p>

            {/* Subject selection dropdown */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <Select
                  value={currentSelection}
                  onValueChange={setCurrentSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.code} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={addSubject}
                disabled={!currentSelection || selectedSubjects.length >= 10}
              >
                Add Subject
              </Button>
            </div>

            {/* Selected subjects */}
            <div className="mb-4">
              <Label className="mb-2 block">
                Your Selected Subjects ({selectedSubjects.length}/10):
              </Label>
              {selectedSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No subjects selected yet
                </p>
              ) : (
                <div className="border rounded-md p-3 space-y-2">
                  {selectedSubjects.map((subject, index) => (
                    <div
                      key={subject.code}
                      className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">
                          {index + 1}. {subject.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code: {subject.code}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject.code)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            className="flex-1"
            disabled={isPending}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            className={`flex-1 ${inModal ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Account...
              </div>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelectionForm;
