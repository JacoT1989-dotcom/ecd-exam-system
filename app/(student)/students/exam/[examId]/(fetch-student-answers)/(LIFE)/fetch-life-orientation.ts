"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { LifeOrientationQuestion } from "../../../subjects/(LIFE)/life-orientation-eng/types";

// Define the response type for the getLifeOrientationQuestions action
type GetLifeOrientationQuestionsResponse = {
  error?: string;
  success?: boolean;
  questions?: LifeOrientationQuestion[];
};

// Define the response type for the getStudentExamAnswers action
type GetStudentExamAnswersResponse = {
  error?: string;
  success?: boolean;
  answers?: Record<string, string | undefined>;
  examTitle?: string;
  examGrade?: number;
  createdAt?: Date;
};

/**
 * Server action to fetch all Life Orientation exam questions
 * This can be accessed by both students and teachers
 */
export async function getLifeOrientationQuestions(): Promise<GetLifeOrientationQuestionsResponse> {
  try {
    // Get current session to verify user is authenticated
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        error: "You must be logged in to access exam questions.",
        success: false,
      };
    }

    // Validate session and get user
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Invalid session
      cookies().delete(lucia.sessionCookieName);
      return {
        error: "Session expired. Please log in again.",
        success: false,
      };
    }

    // Check if user is a student or teacher
    if (user.role !== UserRole.STUDENT && user.role !== UserRole.TEACHER) {
      return {
        error: "You don't have permission to access exam questions.",
        success: false,
      };
    }

    // These would typically be stored in a database table, but for this example,
    // we'll define them directly in the code
    const questions: LifeOrientationQuestion[] = [
      // Section 1: Multiple choice questions (1-10)
      {
        id: "question1",
        text: "Which of the following best describes a healthy lifestyle?",
        type: "multipleChoice",
        options: [
          "A. Regular exercise only",
          "B. Balanced diet only",
          "C. Combination of exercise, balanced diet, and mental wellbeing",
          "D. Avoiding all processed foods",
        ],
      },
      {
        id: "question2",
        text: "What is a key component of effective goal setting?",
        type: "multipleChoice",
        options: [
          "A. Setting only long-term goals",
          "B. Making goals specific and measurable",
          "C. Focusing only on career goals",
          "D. Setting goals that are easy to achieve",
        ],
      },
      {
        id: "question3",
        text: "Which statement about peer pressure is most accurate?",
        type: "multipleChoice",
        options: [
          "A. Peer pressure is always negative",
          "B. Peer pressure only affects teenagers",
          "C. Peer pressure can be both positive and negative",
          "D. Peer pressure has no impact on decision making",
        ],
      },
      {
        id: "question4",
        text: "What is the main purpose of a CV (Curriculum Vitae)?",
        type: "multipleChoice",
        options: [
          "A. To list your social media profiles",
          "B. To summarize your education, skills, and experience",
          "C. To describe your personality traits",
          "D. To explain your family background",
        ],
      },
      {
        id: "question5",
        text: "Which of the following is an example of discrimination?",
        type: "multipleChoice",
        options: [
          "A. Treating someone differently based on their skills",
          "B. Hiring the most qualified candidate for a job",
          "C. Denying someone a service based on their race",
          "D. Promoting someone based on their performance",
        ],
      },
      // Continue with more questions for sections 1-5
      // For brevity, I've included just 5 examples
      // In a real implementation, you would include all 50 questions
      // ...

      // Section 3: Text-based questions
      {
        id: "question26",
        text: "Explain how participating in community service can contribute to personal development.",
        type: "text",
      },
      {
        id: "question27",
        text: "Describe two strategies for managing stress during examination periods.",
        type: "text",
      },
      {
        id: "question28",
        text: "Discuss how cultural diversity enriches society and why it should be celebrated.",
        type: "text",
      },
      // Add more text questions as needed
    ];

    return {
      success: true,
      questions,
    };
  } catch (error) {
    console.error("Get Life Orientation Questions error:", error);
    return {
      error: "Something went wrong. Please try again.",
      success: false,
    };
  }
}

/**
 * Server action to fetch a student's exam answers
 * This action is restricted to the student who submitted the exam and teachers
 */
export async function getStudentExamAnswers(
  examId: string,
): Promise<GetStudentExamAnswersResponse> {
  try {
    // Get current session to verify user is authenticated
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        error: "You must be logged in to view exam answers.",
        success: false,
      };
    }

    // Validate session and get user
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Invalid session
      cookies().delete(lucia.sessionCookieName);
      return {
        error: "Session expired. Please log in again.",
        success: false,
      };
    }

    // Fetch the exam from the database
    const exam = await prisma.lifeOrientationExam.findUnique({
      where: {
        id: examId,
      },
    });

    if (!exam) {
      return {
        error: "Exam not found.",
        success: false,
      };
    }

    // Check permissions - must be the student who took the exam or a teacher
    if (user.id !== exam.userId && user.role !== UserRole.TEACHER) {
      return {
        error: "You don't have permission to view these answers.",
        success: false,
      };
    }

    // Construct answers object from exam data
    const answers: Record<string, string | undefined> = {};

    // Add all question answers to the object
    for (let i = 1; i <= 50; i++) {
      const questionKey = `question${i}` as keyof typeof exam;
      answers[`question${i}`] = exam[questionKey] as string | undefined;
    }

    return {
      success: true,
      answers,
      examTitle: exam.title,
      examGrade: exam.grade,
      createdAt: exam.createdAt,
    };
  } catch (error) {
    console.error("Get Student Exam Answers error:", error);
    return {
      error: "Something went wrong. Please try again.",
      success: false,
    };
  }
}
