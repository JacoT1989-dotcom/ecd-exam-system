"use client";

import React, { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StaffIdentifierFormValues,
  staffIdentifierSchema,
} from "../_validations/staff-identifier-validation";

interface StaffIdentifierFormProps {
  onPrevStep: () => void;
  onComplete: (staffIdentifierValues: StaffIdentifierFormValues) => void;
  inModal?: boolean;
  isPending?: boolean;
}

const StaffIdentifierForm: React.FC<StaffIdentifierFormProps> = ({
  onPrevStep,
  onComplete,
  inModal = false,
  isPending = false,
}) => {
  // Staff title options
  const staffTitles = [
    "Teacher",
    "Principal",
    "Moderator",
    "School Administrator",
    "Provincial Official",
    "National Official",
    "Examination Board Member",
    "Invigilator",
    "Technical Support",
  ];

  // Create form
  const form = useForm<StaffIdentifierFormValues>({
    resolver: zodResolver(staffIdentifierSchema),
    defaultValues: {
      staffTitle: "",
      govNumber: "",
    },
  });

  const handleSubmit = (values: StaffIdentifierFormValues) => {
    onComplete(values);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="staffTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={inModal ? "text-gray-700" : ""}>
                    Staff Title*
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="govNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={inModal ? "text-gray-700" : ""}>
                    Government Identification Number*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your government ID number"
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
              type="submit"
              className={`flex-1 ${
                inModal
                  ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StaffIdentifierForm;
