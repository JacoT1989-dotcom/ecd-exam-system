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
import {
  registerSchema,
  type RegisterFormValues,
} from "./_validations/validation";
import {
  examCenterSchema,
  type ExamCenterFormValues,
} from "./_validations/exam-validations";
import {
  StaffIdentifierFormValues,
  staffIdentifierSchema,
} from "./_validations/staff-identifier-validation";

import { ArrowLeft, ArrowRight } from "lucide-react";

import SubjectSelectionForm from "./_components/SubjectSelectionForm";
import StaffIdentifierForm from "./_components/StaffIdentifierForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { signUp } from "./_actions/actions";
import { createOrUpdateExamCenter } from "./_actions/exam-center-details";
import { registerUserSubjects } from "./_actions/subject-actions";
import { createStaffIdentifier } from "./_actions/staff-identifier";

interface RegisterFormProps {
  inModal?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const RegisterForm = ({ inModal = false, setIsOpen }: RegisterFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("student"); // Default to student registration
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
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
      role: "USER", // Default role is USER
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

  // Update role when user type changes
  React.useEffect(() => {
    // Only change the role to STUDENT if student is selected
    // For staff, keep the default USER role
    if (userType === "student") {
      userForm.setValue("role", "STUDENT");
    } else {
      // For staff, keep the default USER role
      userForm.setValue("role", "USER");
    }
  }, [userType, userForm]);

  // Handle user type change
  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    setStep(1); // Reset to first step when switching user type
  };

  // Handle next button click with validation
  const handleNextStep = () => {
    // Trigger manual validation
    userForm.trigger().then((isValid) => {
      if (isValid) {
        const values = userForm.getValues();
        setUserData(values);
        setStep(2);
      }
    });
  };

  // Handle next button click with validation for Step 2
  const handleNextToSubjects = () => {
    examCenterForm.trigger().then((isValid) => {
      if (isValid) {
        const values = examCenterForm.getValues();
        setExamCenterData(values);
        setStep(3);
      }
    });
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle registration completion from SubjectSelectionForm
  const handleRegistrationComplete = async (
    userId: string,
    selectedSubjectCodes?: string[],
  ) => {
    router.push("/register-success");
  };

  // Handle staff registration completion
  const handleStaffRegistrationComplete = async (
    staffIdentifierValues: StaffIdentifierFormValues,
  ) => {
    try {
      setIsPending(true);

      // Validate user data
      if (!userData) {
        toast.error("User data is missing");
        return;
      }

      // Process staff registration here
      console.log("Submitting user data:", userData);
      const userResult = await signUp(userData);

      if (userResult?.error) {
        toast.error(userResult.error);
        return;
      }

      console.log("Staff user registration successful, result:", userResult);

      // Check if we got a userId back from the signup function
      if (userResult?.userId) {
        console.log("Creating staff identifier for user:", userResult.userId);

        // Create the staff identifier using the userId
        const staffResult = await createStaffIdentifier(
          staffIdentifierValues,
          userResult.userId,
        );

        if (staffResult?.error) {
          console.error("Staff identifier creation failed:", staffResult.error);
          toast.error(staffResult.error);
          return;
        }

        console.log("Staff identifier creation successful");
        toast.success("Registration successful!");

        // First close the modal if we're in modal mode
        if (inModal && setIsOpen) {
          setIsOpen(false);
        }

        // Navigate to success page
        handleRegistrationComplete(userResult.userId);
      } else {
        console.error("No userId returned from signUp");
        toast.error(
          "User created but additional setup failed. Please log in and complete your profile setup later.",
        );
      }
    } catch (error) {
      console.error("Staff registration error:", error);
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
            {step === 1
              ? "Create an Account"
              : userType === "student"
                ? step === 2
                  ? "Exam Center Details"
                  : "Select Your Subjects"
                : "Staff Identification"}
          </h1>
          <p className={inModal ? "text-gray-500" : "text-muted-foreground"}>
            {step === 1
              ? "Please complete all required fields to register"
              : userType === "student"
                ? step === 2
                  ? "Please provide your examination center details"
                  : "Select up to 10 subjects you want to register for"
                : "Please provide your staff identification details"}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center">
          <Tabs
            defaultValue="student"
            value={userType}
            onValueChange={handleUserTypeChange}
            className="w-full max-w-xs"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="staff">Staff Member</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Registration Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center w-full max-w-md">
            {userType === "student" ? (
              <>
                <div
                  className={`h-2 w-1/3 rounded-l-full ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`h-2 w-1/3 ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`h-2 w-1/3 rounded-r-full ${step >= 3 ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </>
            ) : (
              <>
                <div
                  className={`h-2 w-1/2 rounded-l-full ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`h-2 w-1/2 rounded-r-full ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </>
            )}
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

              <Button
                type="button"
                onClick={handleNextStep}
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

        {/* Student-specific forms */}
        {userType === "student" && (
          <>
            {/* Step 2: Exam Center Form */}
            {step === 2 && (
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
                      onClick={handlePrevStep}
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
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
              />
            )}
          </>
        )}

        {/* Staff-specific forms */}
        {userType === "staff" && step === 2 && (
          <StaffIdentifierForm
            onPrevStep={handlePrevStep}
            onComplete={handleStaffRegistrationComplete}
            inModal={inModal}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
