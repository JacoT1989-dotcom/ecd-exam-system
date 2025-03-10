"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateStudentInfoSchema,
  UpdateStudentInfoValues,
} from "./student-validations";
import { updateStudentInfo } from "./student-actions";
import { toast } from "sonner";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRound, Mail, Phone, BadgeCheck, Loader2 } from "lucide-react";

interface StudentInfoSectionProps {
  userData: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
  };
  onSuccess?: () => void;
}

export function StudentInfoSection({
  userData,
  onSuccess,
}: StudentInfoSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateStudentInfoValues>({
    resolver: zodResolver(updateStudentInfoSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      displayName: userData.displayName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateStudentInfoValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateStudentInfo(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Personal information updated successfully");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Failed to update personal information");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden border border-gray-200 bg-white shadow-lg">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-cyan-600" />
          <CardTitle className="text-xl font-semibold">
            Personal Information
          </CardTitle>
        </div>
        <CardDescription>
          Update your name, display name, and contact details
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-9"
                          placeholder="Your first name"
                          disabled={isSubmitting}
                        />
                      </div>
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-9"
                          placeholder="Your last name"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        className="pl-9"
                        placeholder="Your display name"
                        disabled={isSubmitting}
                      />
                    </div>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="email"
                        className="pl-9"
                        placeholder="Your email address"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        className="pl-9"
                        placeholder="Your phone number"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end px-0 pt-4">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
