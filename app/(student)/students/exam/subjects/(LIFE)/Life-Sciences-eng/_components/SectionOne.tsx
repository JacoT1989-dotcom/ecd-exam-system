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

interface SectionOneProps {
  form: UseFormReturn<LifeOrientationExamFormType>;
}

export function SectionOne({ form }: SectionOneProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Section 1: Multiple Choice Questions (1-10)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Select the correct option for each question
      </p>

      {/* Question 1 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          1. What is the main purpose of the South African Constitution?
        </h3>
        <FormField
          control={form.control}
          name="question1"
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
                    <FormLabel>A. To protect the rights of citizens</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. To provide guidelines for economic growth
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. To establish the rules for international relations
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. To organize sporting events</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 2 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          2. Which of the following is a human right guaranteed in the Bill of
          Rights?
        </h3>
        <FormField
          control={form.control}
          name="question2"
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
                    <FormLabel>A. The right to free housing</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. The right to dignity</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. The right to a high-paying job</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. The right to free university education
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 3 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          3. What does the term &quot;Ubuntu&quot; refer to in South African
          culture?
        </h3>
        <FormField
          control={form.control}
          name="question3"
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
                    <FormLabel>A. A type of traditional food</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. A philosophy emphasizing community and
                      interconnectedness
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. A traditional dance</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. A specific language spoken in South Africa
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Questions 4-10 follow the same pattern - adding all for completeness */}
      {/* Question 4 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          4. Which of the following is an example of good citizenship?
        </h3>
        <FormField
          control={form.control}
          name="question4"
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
                    <FormLabel>A. Voting in elections</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Avoiding paying taxes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Ignoring community issues</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Breaking traffic laws</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 5 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          5. What is a key characteristic of a democratic society?
        </h3>
        <FormField
          control={form.control}
          name="question5"
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
                    <FormLabel>A. Single-party rule</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Limited freedom of speech</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Regular free and fair elections</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Government control of the media</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 6 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          6. Which of the following is a healthy coping mechanism for stress?
        </h3>
        <FormField
          control={form.control}
          name="question6"
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
                    <FormLabel>A. Regular physical exercise</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Substance abuse</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Social isolation</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Procrastination</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 7 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          7. Which of the following is a benefit of a balanced diet?
        </h3>
        <FormField
          control={form.control}
          name="question7"
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
                    <FormLabel>A. Increased risk of chronic diseases</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Improved concentration and energy levels
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Decreased immune function</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Slower metabolism</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 8 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          8. What is a primary goal of career planning?
        </h3>
        <FormField
          control={form.control}
          name="question8"
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
                    <FormLabel>A. Maximizing income at all costs</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Finding meaning and purpose in work
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Avoiding all challenging positions</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Working as little as possible</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 9 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">9. What is peer pressure?</h3>
        <FormField
          control={form.control}
          name="question9"
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
                      A. Pressure from parents to succeed academically
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Influence from friends to adopt certain behaviors
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Pressure from teachers to complete assignments
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Pressure from employers to work overtime
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 10 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          10. Which of the following is a characteristic of a healthy
          relationship?
        </h3>
        <FormField
          control={form.control}
          name="question10"
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
                      A. One person making all the decisions
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Mutual respect and trust</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Limited communication</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Controlling behavior</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
