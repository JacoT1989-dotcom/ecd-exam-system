import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LifeOrientationExamFormType } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface SectionFiveProps {
  form: UseFormReturn<LifeOrientationExamFormType>;
}

export function SectionFive({ form }: SectionFiveProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Section 5: Extended Response Questions (41-50)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Provide detailed answers to the following questions. Support your
        answers with examples where possible.
      </p>

      {/* Question 41 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          41. Discuss the importance of diversity and inclusivity in building a
          cohesive society.
        </h3>
        <FormField
          control={form.control}
          name="question41"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 42 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          42. Explain how substance abuse can affect an individual&apos;s
          physical health, relationships, and future opportunities.
        </h3>
        <FormField
          control={form.control}
          name="question42"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 43 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          43. Describe your personal five-year plan, including educational,
          career, and personal goals.
        </h3>
        <FormField
          control={form.control}
          name="question43"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 44 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          44. Discuss the role of community service in developing citizenship
          skills.
        </h3>
        <FormField
          control={form.control}
          name="question44"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 45 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          45. Analyze the factors that contribute to gender-based violence in
          society and suggest solutions.
        </h3>
        <FormField
          control={form.control}
          name="question45"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 46 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          46. Explain how participating in democracy extends beyond voting. Give
          specific examples.
        </h3>
        <FormField
          control={form.control}
          name="question46"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 47 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          47. Describe how technological advancements have changed career
          opportunities. Discuss both positive and negative impacts.
        </h3>
        <FormField
          control={form.control}
          name="question47"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 48 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          48. Discuss the importance of work-life balance and strategies to
          achieve it.
        </h3>
        <FormField
          control={form.control}
          name="question48"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 49 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          49. Explain how cultural diversity enriches society while presenting
          challenges. Use examples from South Africa.
        </h3>
        <FormField
          control={form.control}
          name="question49"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 50 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          50. Reflect on how your education in Life Orientation has prepared you
          for life after school.
        </h3>
        <FormField
          control={form.control}
          name="question50"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
