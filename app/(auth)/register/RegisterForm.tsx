"use client";

import React from "react";
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
import { registerSchema, type RegisterFormValues } from "./validation";
import { signUp } from "./actions";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface RegisterFormProps {
  inModal?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const RegisterForm = ({ inModal = false, setIsOpen }: RegisterFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<RegisterFormValues>({
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

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsPending(true);
      const result = await signUp(data);
      if (result?.error) {
        toast.error(result.error);
        if (result.error.includes("Username")) {
          form.setError("username", { message: result.error });
        } else if (result.error.includes("Email")) {
          form.setError("email", { message: result.error });
        }
        return;
      }

      toast.success("Registration successful!");

      // First close the modal if we're in modal mode
      if (inModal && setIsOpen) {
        setIsOpen(false);
      }

      // Then redirect with a slight delay to ensure modal closes firs
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
            Create an Account
          </h1>
          <p className={inModal ? "text-gray-500" : "text-muted-foreground"}>
            Please complete all required fields to register
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              control={form.control}
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
              type="submit"
              className={`w-full mt-6 ${inModal ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
