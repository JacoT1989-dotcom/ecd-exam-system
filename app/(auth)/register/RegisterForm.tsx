"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  registerSchema,
  type RegisterFormValues,
} from "./_validations/validation";
import { type ExamCenterFormValues } from "./_validations/exam-validations";

import { ArrowLeft, ArrowRight } from "lucide-react";

import SubjectSelectionForm from "./_components/SubjectSelectionForm";
import ExamCenterForm from "./_components/ExamCenterForm";

interface RegisterFormProps {
  inModal?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const RegisterForm = ({ inModal = false, setIsOpen }: RegisterFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<RegisterFormValues | null>(null);
  const [examCenterData, setExamCenterData] =
    useState<ExamCenterFormValues | null>(null);

  // User registration form
  const userForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      displayName: "",
      streetAddress: "",
      townCity: "",
      postcode: "",
      country: "",
      password: "",
      confirmPassword: "",
      role: "USER",
      agreeTerms: false,
      avatarUrl: null,
      backgroundUrl: null,
    },
  });

  // Handle direct next button click with validation
  const handleNextToExamCenter = () => {
    console.log("Next button clicked");

    // Trigger manual validation
    userForm.trigger().then((isValid) => {
      console.log("Form valid:", isValid);
      if (isValid) {
        const values = userForm.getValues();
        console.log("Form values:", values);
        setUserData(values);
        setStep(2);
        console.log("Moving to step 2");
      } else {
        console.log("Form errors:", userForm.formState.errors);
      }
    });
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleNextToSubjects = (examCenterValues: ExamCenterFormValues) => {
    setExamCenterData(examCenterValues);
    setStep(3);
  };

  // Handle registration completion from SubjectSelectionForm
  const handleRegistrationComplete = async (
    userId: string,
    selectedSubjectCodes: string[],
  ) => {
    router.push("/register-success");
  };

  return (
    <div
      className={
        inModal
          ? "w-full space-y-6"
          : "min-h-screen bg-background flex flex-col items-center justify-center p-4"
      }
    >
      {!inModal && (
        <div className="w-full max-w-md mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      )}

      <div
        className={
          inModal
            ? "w-full space-y-6"
            : "w-full max-w-2xl space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border"
        }
      >
        <div className="space-y-2 text-center">
          <h1
            className={`text-2xl font-semibold ${inModal ? "text-gray-800" : "text-foreground"}`}
          >
            {step === 1
              ? "Create an Account"
              : step === 2
                ? "Exam Center Details"
                : "Select Your Subjects"}
          </h1>
          <p className={inModal ? "text-gray-500" : "text-muted-foreground"}>
            {step === 1
              ? "Please complete all required fields to register"
              : step === 2
                ? "Please provide your examination center details"
                : "Select up to 10 subjects you want to register for"}
          </p>
        </div>

        {/* Registration Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center w-full max-w-md">
            <div
              className={`h-2 w-1/3 rounded-l-full ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`}
            ></div>
            <div
              className={`h-2 w-1/3 ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}
            ></div>
            <div
              className={`h-2 w-1/3 rounded-r-full ${step >= 3 ? "bg-green-500" : "bg-gray-200"}`}
            ></div>
          </div>
        </div>

        {/* Step 1: User Registration Form */}
        {step === 1 && (
          <Form {...userForm}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={userForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Username*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          autoComplete="username"
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
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Email*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                          autoComplete="email"
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
                  control={userForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Display Name*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
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
                  control={userForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        First Name*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
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
                  control={userForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Last Name*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
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
                  control={userForm.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Street Address*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
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
                  control={userForm.control}
                  name="townCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Town/City*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cape Town"
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
                  control={userForm.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Postcode*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345"
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
                  control={userForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Country*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="South Africa"
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
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Password*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          autoComplete="new-password"
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
                  control={userForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={inModal ? "text-gray-700" : ""}>
                        Confirm Password*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          autoComplete="new-password"
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

              <FormField
                control={userForm.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className={
                          inModal ? "text-[#4a6e8a] focus:ring-[#4a6e8a]" : ""
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className={
                          inModal ? "text-gray-600" : "text-muted-foreground"
                        }
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className={`${inModal ? "text-[#4a6e8a] hover:text-[#3d5a73]" : "text-primary hover:text-primary/90"} underline`}
                        >
                          terms and conditions
                        </Link>
                        *
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Changed to button type and using direct click handler */}
              <Button
                type="button"
                onClick={handleNextToExamCenter}
                className={`w-full mt-6 ${inModal ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Step 2: Exam Center Form (Now using the imported component) */}
        {step === 2 && (
          <ExamCenterForm
            onPrevStep={handlePrevStep}
            onNextStep={handleNextToSubjects}
            inModal={inModal}
            isPending={isPending}
          />
        )}

        {/* Step 3: Subject Selection (Imported Component) */}
        {step === 3 && (
          <SubjectSelectionForm
            userData={userData!}
            examCenterData={examCenterData!}
            onPrevStep={() => setStep(2)}
            onComplete={handleRegistrationComplete}
            inModal={inModal}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
