"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  examCenterSchema,
  type ExamCenterFormValues,
} from "../_validations/exam-validations";

import { ArrowLeft, ArrowRight } from "lucide-react";

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

interface ExamCenterFormProps {
  onPrevStep: () => void;
  onNextStep: (data: ExamCenterFormValues) => void;
  inModal?: boolean;
  isPending?: boolean;
}

const ExamCenterForm = ({
  onPrevStep,
  onNextStep,
  inModal = false,
  isPending = false,
}: ExamCenterFormProps) => {
  // Exam center form
  const examCenterForm = useForm<ExamCenterFormValues>({
    resolver: zodResolver(examCenterSchema),
    defaultValues: {
      examinationNumber: "",
      year: new Date().getFullYear(),
      province: "",
      centerName: "",
    },
  });

  // Handle next button click with validation for Step 2
  const handleNextToSubjects = () => {
    examCenterForm.trigger().then((isValid) => {
      if (isValid) {
        const values = examCenterForm.getValues();
        onNextStep(values);
      }
    });
  };

  return (
    <Form {...examCenterForm}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={examCenterForm.control}
            name="examinationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inModal ? "text-gray-700" : ""}>
                  Examination Number*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345-678"
                    {...field}
                    disabled={isPending}
                    className={
                      inModal
                        ? "bg-white border-gray-300 focus:border-[#4a6e8a] focus:ring-[#4a6e8a]"
                        : "bg-background"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={examCenterForm.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inModal ? "text-gray-700" : ""}>
                  Year*
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2025"
                    {...field}
                    disabled={isPending}
                    className={
                      inModal
                        ? "bg-white border-gray-300 focus:border-[#4a6e8a] focus:ring-[#4a6e8a]"
                        : "bg-background"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={examCenterForm.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inModal ? "text-gray-700" : ""}>
                  Province*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={examCenterForm.control}
            name="centerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inModal ? "text-gray-700" : ""}>
                  Examination Centre Name*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ABC School"
                    {...field}
                    disabled={isPending}
                    className={
                      inModal
                        ? "bg-white border-gray-300 focus:border-[#4a6e8a] focus:ring-[#4a6e8a]"
                        : "bg-background"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            onClick={handleNextToSubjects}
            className={`flex-1 ${inModal ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
            disabled={isPending}
          >
            <div className="flex items-center justify-center">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExamCenterForm;
