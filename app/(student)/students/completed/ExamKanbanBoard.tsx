"use client";
import { useEffect, useState } from "react";
import { useSession } from "../../SessionProvider";
import LanguageSelectionModal from "../../_components/(exam_card_timers)/LanguageSelectionModal";
import UnavailableExamModal from "../../_components/(exam_card_timers)/UnavailableExamModal";
import { Subject } from "../../_components/(exam_card_timers)/types";
import {
  fetchStudentSubjects,
  refreshSubjectsData,
} from "../../_components/(exam_card_timers)/fetch-subjects";
import ExamCard from "./ExamCard";
import {
  organizeSubjects,
  isExamAvailable,
  formatExamTimeWindow,
} from "./exam-utils";

const ExamKanbanBoard = () => {
  const { user } = useSession();
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [completedExams, setCompletedExams] = useState<number[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state and fetch subjects
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const loadSubjects = async () => {
      setIsLoading(true);
      try {
        const result = await fetchStudentSubjects();
        if (result.subjects) {
          setSubjects(result.subjects);
        }
        if (result.error) {
          setFetchError(result.error);
        }
      } catch (error) {
        setFetchError("Failed to load subjects. Please try again.");
        console.error("Error loading subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  // Handle time updates
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // Set greeting based on time of day
  useEffect(() => {
    if (!isClient) return;

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, [isClient]);

  const handleExamClick = (subject: Subject): void => {
    setSelectedSubject(subject);

    // Check if the exam is within its time window (in progress)
    let isWithinTimeWindow = false;
    if (subject.startingTime && subject.dueTime) {
      const startTime = new Date(subject.startingTime);
      startTime.setHours(startTime.getHours() - 2);

      const dueTime = new Date(subject.dueTime);
      dueTime.setHours(dueTime.getHours() - 2);

      isWithinTimeWindow = currentTime >= startTime && currentTime <= dueTime;
    }

    // Show language modal for exams in progress, regardless of isActive flag
    if (isWithinTimeWindow && user) {
      setShowLanguageModal(true);
    } else {
      setShowUnavailableModal(true);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const result = await refreshSubjectsData();
      if (result.subjects) {
        setSubjects(result.subjects);
      }
      if (result.error) {
        setFetchError(result.error);
      }
    } catch (error) {
      setFetchError("Failed to refresh subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { notAvailable, inProgress, completed } = organizeSubjects(
    subjects,
    completedExams,
    currentTime,
  );

  const renderColumn = (
    title: string,
    subjects: Subject[],
    bgColor: string,
  ) => (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-md p-3 min-h-[400px]">
      <div
        className={`${bgColor} text-white text-base font-bold py-1.5 px-3 rounded-t-lg mb-3 shadow-sm`}
      >
        {title} ({subjects.length})
      </div>
      <div className="flex-grow space-y-2.5 overflow-y-auto">
        {subjects.map((subject) => (
          <ExamCard
            key={subject.id}
            subject={subject}
            completedExams={completedExams}
            currentTime={currentTime}
            isClient={isClient}
            onExamClick={handleExamClick}
          />
        ))}
        {subjects.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No exams in this category
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((column) => (
            <div
              key={column}
              className="flex flex-col bg-gray-50 rounded-lg shadow-md p-3 min-h-[400px]"
            >
              <div className="bg-gray-200 h-8 rounded-t-lg mb-3"></div>
              <div className="space-y-2.5">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="bg-white rounded-lg shadow p-3 animate-pulse"
                  >
                    <div className="h-1.5 bg-gray-200 w-full rounded mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-7 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#3e6788] mb-2">
          {greeting}, {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-2">
          Welcome to your examination dashboard. Below you&apos;ll find all your
          exams organized by status.
        </p>
        <p className="text-sm text-gray-500">
          Exams will move to &quot;In Progress&quot; when the timer reaches zero
          and can be started.
        </p>
        {fetchError && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {fetchError}
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <button
            onClick={refreshData}
            className="text-[#3e6788] hover:text-[#2d4d66] text-sm font-medium focus:outline-none"
          >
            Refresh Exams
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderColumn("Not Available Yet", notAvailable, "bg-blue-600")}
        {renderColumn("In Progress", inProgress, "bg-green-600")}
        {renderColumn("Completed", completed, "bg-gray-600")}
      </div>

      {showLanguageModal && selectedSubject && (
        <LanguageSelectionModal
          subject={selectedSubject}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {showUnavailableModal && selectedSubject && (
        <UnavailableExamModal
          subject={selectedSubject}
          formatExamDate={formatExamTimeWindow}
          onClose={() => setShowUnavailableModal(false)}
        />
      )}
    </div>
  );
};

export default ExamKanbanBoard;
