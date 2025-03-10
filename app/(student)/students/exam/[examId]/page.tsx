import React from "react";
import StudentExamAnswers from "./_components/(LIFE)/StudentExamAnswers";

const ExamAnswersPage = ({ params }: { params: { examId: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-[#3e6788] mb-6">
        Exam Answers Review
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Below are your submitted answers for the exam. Review your responses to
        help prepare for future assessments.
      </p>

      <StudentExamAnswers />
    </div>
  );
};

export default ExamAnswersPage;
