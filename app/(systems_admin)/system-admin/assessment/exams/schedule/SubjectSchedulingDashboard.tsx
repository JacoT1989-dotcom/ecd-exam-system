"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateSubjectDates } from "./bulk-update-codes";

const formatSASTTime = (dateString: string | Date | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setHours(date.getHours() - 2); // Subtract 2 hours to convert to SAST
  return format(date, "p");
};

const formSchema = z.object({
  subjectCodes: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
  examDate: z.date({
    required_error: "Please select an exam date",
  }),
  startingTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
});

interface SubjectSchedulingDashboardProps {
  uniqueSubjectCodes: Array<{ code: string; title: string }>;
  allSubjects: any[];
  subjectsWithMissingDates: any[];
}

export default function SubjectSchedulingDashboard({
  uniqueSubjectCodes,
  allSubjects,
  subjectsWithMissingDates,
}: SubjectSchedulingDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectCodes: [],
      examDate: undefined,
      startingTime: "",
      dueTime: "",
    },
  });

  const filteredSubjectCodes =
    searchTerm.trim() === ""
      ? uniqueSubjectCodes
      : uniqueSubjectCodes.filter(
          (subject) =>
            subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Create a new object with properly typed values
      const submissionData = {
        subjectCodes: values.subjectCodes,
        examDate: values.examDate, // Already a Date object
        startingTime: values.startingTime,
        dueTime: values.dueTime,
      };

      const result = await updateSubjectDates(submissionData);

      if (result.error) {
        toast.error(result.error);
      } else {
        const subjectTitle = values.subjectCodes
          .map((code) => {
            const subject = uniqueSubjectCodes.find((s) => s.code === code);
            return subject ? `${code} - ${subject.title}` : code;
          })
          .join(", ");

        toast.success(
          `Successfully updated ${result.updatedCount} records for ${subjectTitle}`,
        );
        form.reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while updating subjects");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectCodeCount = (code: string) => {
    return allSubjects.filter((s) => s.subjectCode === code).length;
  };

  return (
    <Tabs defaultValue="schedule" className="space-y-4">
      <TabsList>
        <TabsTrigger value="schedule">Schedule Exams</TabsTrigger>
        <TabsTrigger value="missing">Missing Dates</TabsTrigger>
        <TabsTrigger value="all">All Subjects</TabsTrigger>
      </TabsList>

      {/* Schedule Exams Tab */}
      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Subject Exam Dates</CardTitle>
            <CardDescription>
              Set exam date, starting time, and due time for specific subject
              codes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <FormLabel>Search Subjects</FormLabel>
                  <Input
                    placeholder="Search by code or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Subject Code Selection */}
                <FormField
                  control={form.control}
                  name="subjectCodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Codes</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange([...field.value, value])
                          }
                          value=""
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject codes" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredSubjectCodes.length === 0 ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                No matching subjects found
                              </div>
                            ) : (
                              filteredSubjectCodes.map((subject) => (
                                <SelectItem
                                  key={subject.code}
                                  value={subject.code}
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span>
                                      {subject.code} - {subject.title}
                                    </span>
                                    <Badge variant="outline" className="ml-2">
                                      {getSubjectCodeCount(subject.code)}{" "}
                                      students
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((code) => {
                          const subject = uniqueSubjectCodes.find(
                            (s) => s.code === code,
                          );
                          return (
                            <Badge
                              key={code}
                              variant="outline"
                              className="px-3 py-1"
                            >
                              {subject ? `${code} - ${subject.title}` : code}
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((c) => c !== code),
                                  )
                                }
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exam Date */}
                <FormField
                  control={form.control}
                  name="examDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Exam Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Starting Time */}
                <FormField
                  control={form.control}
                  name="startingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Time (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={!form.getValues("examDate")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Time */}
                <FormField
                  control={form.control}
                  name="dueTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Time (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={!form.getValues("examDate")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting || !form.getValues("subjectCodes")?.length
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Update Subject Dates"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Missing Dates Tab */}
      <TabsContent value="missing">
        <Card>
          <CardHeader>
            <CardTitle>Subjects With Missing Dates</CardTitle>
            <CardDescription>
              These subjects need exam dates, starting times, or due times to be
              set.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjectsWithMissingDates.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                All subjects have their dates set.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Exam Date</TableHead>
                    <TableHead>Starting Time</TableHead>
                    <TableHead>Due Time</TableHead>
                    <TableHead>Student</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectsWithMissingDates.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        {subject.subjectCode}
                      </TableCell>
                      <TableCell>{subject.title}</TableCell>
                      <TableCell>
                        {subject.examDate ? (
                          format(new Date(subject.examDate), "PP")
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subject.startingTime ? (
                          format(new Date(subject.startingTime), "p")
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subject.dueTime ? (
                          format(new Date(subject.dueTime), "p")
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subject.user?.displayName || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* All Subjects Tab */}
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Scheduled Subjects</CardTitle>
            <CardDescription>
              Overview of all subjects and their scheduled exam dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allSubjects.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No subjects found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Exam Date</TableHead>
                      <TableHead>Time Window</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Student</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">
                          {subject.subjectCode}
                        </TableCell>
                        <TableCell>{subject.title}</TableCell>
                        <TableCell>
                          {subject.examDate ? (
                            format(new Date(subject.examDate), "PP")
                          ) : (
                            <span className="text-muted-foreground">
                              Not set
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {subject.startingTime && subject.dueTime ? (
                            <>
                              {formatSASTTime(subject.startingTime)} -{" "}
                              {formatSASTTime(subject.dueTime)}
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              Not set
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {subject.isExamSubjectActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {subject.user?.displayName || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
