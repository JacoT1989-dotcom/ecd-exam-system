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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, type RegisterFormValues } from "./validation";
import {
  examCenterSchema,
  type ExamCenterFormValues,
} from "./exam-validations"; // You'll need to create this
import { signUp } from "./actions";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createOrUpdateExamCenter } from "./exam-center-details";

interface RegisterFormProps {
  inModal?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const RegisterForm = ({ inModal = false, setIsOpen }: RegisterFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [step, setStep] = useState(1);
  const [provinces, setProvinces] = useState([
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ]);
  const [userData, setUserData] = useState<RegisterFormValues | null>(null);

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

  // Handle direct next button click with validation
  const handleNextClick = () => {
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

  const onSubmitExamCenterForm = async (
    examCenterData: ExamCenterFormValues,
  ) => {
    try {
      setIsPending(true);

      // First register the user
      if (!userData) {
        toast.error(
          "User data is missing. Please go back and fill the registration form",
        );
        return;
      }

      console.log("Submitting user data:", userData);
      const userResult = await signUp(userData);

      if (userResult?.error) {
        toast.error(userResult.error);
        if (userResult.error.includes("Username")) {
          userForm.setError("username", { message: userResult.error });
        } else if (userResult.error.includes("Email")) {
          userForm.setError("email", { message: userResult.error });
        }
        setStep(1);
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
      } else {
        console.error("No userId returned from signUp");
        toast.error(
          "User created but exam center setup failed. Please log in and set up your exam center later.",
        );
      }

      toast.success("Registration successful!");

      // First close the modal if we're in modal mode
      if (inModal && setIsOpen) {
        setIsOpen(false);
      }

      // Then manually redirect to register-success
      router.push("/register-success");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
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
            {step === 1 ? "Create an Account" : "Exam Center Details"}
          </h1>
          <p className={inModal ? "text-gray-500" : "text-muted-foreground"}>
            {step === 1
              ? "Please complete all required fields to register"
              : "Please provide your examination center details"}
          </p>
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
                onClick={handleNextClick}
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

        {/* Step 2: Exam Center Form */}
        {step === 2 && (
          <Form {...examCenterForm}>
            <form
              onSubmit={examCenterForm.handleSubmit(onSubmitExamCenterForm)}
              className="space-y-4"
            >
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
                  onClick={handlePrevStep}
                  className="flex-1"
                  disabled={isPending}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  type="submit"
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
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
