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
import { LoginFormValues, loginSchema } from "./validation";
import { toast } from "sonner";
import { ArrowLeft, Info } from "lucide-react";
import { login } from "./actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoginFormProps {
  inModal?: boolean;
}

const LoginForm = ({ inModal = false }: LoginFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsPending(true);
      const result = await login(data);

      if (result?.error) {
        toast.error(result.error);
        if (result.error.includes("Invalid email or password")) {
          form.setError("email", { message: "Invalid credentials" });
          form.setError("password", { message: "Invalid credentials" });
        }
        return;
      }

      if (result?.redirectTo) {
        toast.success("Logged in successfully!");
        router.push(result.redirectTo);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in. Please try again.");
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
            : "w-full max-w-md space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border"
        }
      >
        <div className="space-y-2 text-center">
          <h1
            className={`text-2xl font-semibold ${inModal ? "text-gray-800" : "text-foreground"}`}
          >
            Welcome to DEMS!
          </h1>
          <p className={inModal ? "text-gray-500" : "text-muted-foreground"}>
            Sign in to access the Digital Exam Management System
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={inModal ? "text-gray-700" : ""}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      disabled={isPending}
                      autoComplete="email"
                      type="email"
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
                  <div className="flex items-center justify-between">
                    <FormLabel className={inModal ? "text-gray-700" : ""}>
                      Password
                    </FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className={`h-4 w-4 ${inModal ? "text-gray-400 hover:text-gray-600" : "text-muted-foreground"} cursor-pointer`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Password must contain:</p>
                          <p>- At least 8 characters</p>
                          <p>- One uppercase letter</p>
                          <p>- One lowercase letter</p>
                          <p>- One number</p>
                          <p>- One special character</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isPending}
                      autoComplete="current-password"
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
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
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
                    <FormLabel
                      className={`text-sm ${inModal ? "text-gray-600" : "text-muted-foreground"}`}
                    >
                      Remember me
                    </FormLabel>
                  </div>
                  <Link
                    href="/forgot-password"
                    className={`text-sm ${inModal ? "text-[#4a6e8a] hover:text-[#3d5a73]" : "text-primary hover:text-primary/90"} font-medium`}
                  >
                    Forgot password?
                  </Link>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={`w-full ${inModal ? "bg-[#4a6e8a] hover:bg-[#3d5a73] text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
