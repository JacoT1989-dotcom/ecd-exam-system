import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LewensorientringEksamenVormTipe } from "../types";

interface SectionTwoProps {
  form: UseFormReturn<LewensorientringEksamenVormTipe>;
}

export function SectionTwo({ form }: SectionTwoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Section 2: Multiple Choice Questions (11-20)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Select the correct option for each question
      </p>

      {/* Question 11 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          11. Which of the following is a consequence of substance abuse?
        </h3>
        <FormField
          control={form.control}
          name="vraag11"
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
                    <FormLabel>A. Improved decision-making</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Better physical health</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Damaged relationships</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Increased productivity</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 12 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          12. What is the purpose of the United Nations?
        </h3>
        <FormField
          control={form.control}
          name="vraag12"
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
                    <FormLabel>A. To control global trade</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. To maintain international peace and promote cooperation
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. To govern all countries</FormLabel>
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

      {/* Question 13 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          13. What is a key component of emotional intelligence?
        </h3>
        <FormField
          control={form.control}
          name="vraag13"
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
                    <FormLabel>A. Academic intelligence</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Self-awareness</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Physical strength</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Technical skills</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 14 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          14. What is the purpose of a CV (Curriculum Vitae)?
        </h3>
        <FormField
          control={form.control}
          name="vraag14"
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
                      A. To summarize your qualifications and experience for
                      employers
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. To list your personal problems</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. To apply for university admission only
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. To keep track of your personal finances
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 15 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          15. Which of the following is a healthy conflict resolution strategy?
        </h3>
        <FormField
          control={form.control}
          name="vraag15"
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
                    <FormLabel>A. Physical confrontation</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Ignoring the problem</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Open communication and compromise</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Spreading rumors about the other person
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 16 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          16. What is a potential consequence of gender-based violence?
        </h3>
        <FormField
          control={form.control}
          name="vraag16"
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
                    <FormLabel>A. Stronger community bonds</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Improved family relationships</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Psychological trauma</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Economic growth</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 17 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          17. Which of the following is an environmental issue facing South
          Africa?
        </h3>
        <FormField
          control={form.control}
          name="vraag17"
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
                    <FormLabel>A. Too much rainfall</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Water scarcity</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Excessive forest coverage</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Overpopulation of endangered species
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 18 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          18. What is a characteristic of a good study habit?
        </h3>
        <FormField
          control={form.control}
          name="vraag18"
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
                      A. Studying only the night before exams
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Regular scheduled study time</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Studying with loud music playing</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Multitasking with social media while studying
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 19 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          19. What is the main goal of physical education?
        </h3>
        <FormField
          control={form.control}
          name="vraag19"
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
                      A. To identify future professional athletes
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. To promote lifelong physical fitness and well-being
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. To punish students with exercise</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. To give teachers a break from classroom instruction
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 20 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          20. Which of the following is a characteristic of responsible
          decision-making?
        </h3>
        <FormField
          control={form.control}
          name="vraag20"
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
                    <FormLabel>A. Making choices impulsively</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Ignoring potential consequences</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Considering the impact of choices on yourself and
                      others
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Following peer pressure</FormLabel>
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
