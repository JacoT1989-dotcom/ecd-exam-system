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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface SectionThreeProps {
  form: UseFormReturn<LifeOrientationExamFormType>;
}

export function SectionThree({ form }: SectionThreeProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Section 3: Mixed Questions (21-30)</h2>
      <p className="text-sm text-gray-500 mb-4">
        Questions 21-25 are multiple choice. Questions 26-30 require short text
        answers.
      </p>

      {/* Question 21 - Multiple Choice */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          21. What is a key factor in successful goal setting?
        </h3>
        <FormField
          control={form.control}
          name="question21"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Setting vague objectives</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Setting unrealistic timeframes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Setting specific, measurable, achievable goals
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Avoiding any challenges</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 22 - Multiple Choice */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          22. Which of the following is a characteristic of a democratic
          election?
        </h3>
        <FormField
          control={form.control}
          name="question22"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Only certain groups are allowed to vote
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Votes are cast in public</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Results are predetermined</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Secret ballot voting</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 23 - Multiple Choice */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          23. What is the importance of diversity in society?
        </h3>
        <FormField
          control={form.control}
          name="question23"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. It leads to conflict and division</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. It enriches society with different perspectives and
                      ideas
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. It makes governance easier</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. It has no significant impact</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 24 - Multiple Choice */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          24. What is a key aspect of responsible citizenship?
        </h3>
        <FormField
          control={form.control}
          name="question24"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Focusing only on personal interests
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Active participation in community matters
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Avoiding all civic responsibilities
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Ignoring laws that are inconvenient
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 25 - Multiple Choice */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          25. Which of the following is an example of a human rights violation?
        </h3>
        <FormField
          control={form.control}
          name="question25"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Being required to follow traffic laws
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Having to pay taxes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Discrimination based on race or gender
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Being required to attend school</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Text Questions Begin */}
      <div className="mt-8 mb-4">
        <h3 className="text-lg font-semibold">Short Answer Questions</h3>
        <p className="text-sm text-gray-500">
          Provide brief answers to the following questions
        </p>
      </div>

      {/* Question 26 - Text */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          26. Explain the concept of democracy in your own words.
        </h3>
        <FormField
          control={form.control}
          name="question26"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your answer here"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 27 - Text */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          27. List three factors that contribute to good health.
        </h3>
        <FormField
          control={form.control}
          name="question27"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your answer here"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 28 - Text */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          28. What are two ways to resolve conflicts peacefully?
        </h3>
        <FormField
          control={form.control}
          name="question28"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your answer here"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 29 - Text */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          29. Describe one environmental challenge facing your community.
        </h3>
        <FormField
          control={form.control}
          name="question29"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your answer here"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 30 - Text */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          30. Name two rights protected by the South African Constitution.
        </h3>
        <FormField
          control={form.control}
          name="question30"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your answer here"
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
