"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  bulkUpdateExamTimes,
  type SubjectCode,
  getAllSubjectExamSettings,
} from "./exam-timers";
import SubjectRow from "./SubjectRow";
import {
  formatDateForInput,
  formatTimeForInput,
  NotificationMessage,
  parseDateTime,
} from "./date-utils";

interface SubjectsTableProps {
  subjectCodes: SubjectCodeInfo[];
  initialSettings: Record<
    SubjectCode,
    {
      examDate: Date;
      startingTime: Date;
      dueTime: Date;
      isExamSubjectActive: boolean;
    }
  >;
}

export interface SubjectCodeInfo {
  code: SubjectCode;
  title: string;
}

export default function SubjectsTable({
  subjectCodes,
  initialSettings,
}: SubjectsTableProps) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const initialLoadComplete = useRef(false);

  // State for subject exam settings
  const [examSettings, setExamSettings] = useState<
    Partial<
      Record<
        SubjectCode,
        {
          examDate: Date;
          startingTime: Date;
          dueTime: Date;
          isExamSubjectActive: boolean;
          isEditing: boolean;
          // Add temporary string values for time inputs being edited
          tempStartTime?: string;
          tempEndTime?: string;
        }
      >
    >
  >(() => {
    // Initialize settings state from props with isEditing set to false
    const initialExamSettings: Partial<
      Record<
        SubjectCode,
        {
          examDate: Date;
          startingTime: Date;
          dueTime: Date;
          isExamSubjectActive: boolean;
          isEditing: boolean;
        }
      >
    > = {};

    // Create safe date converters to handle potential invalid dates
    const safeDate = (dateValue: any): Date => {
      try {
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? new Date() : date;
      } catch (e) {
        console.error("Error converting date:", e, dateValue);
        return new Date();
      }
    };

    Object.entries(initialSettings).forEach(([code, settings]) => {
      if (!settings) {
        console.warn(`No settings found for subject code: ${code}`);
        return;
      }

      try {
        initialExamSettings[code as SubjectCode] = {
          ...settings,
          examDate: safeDate(settings.examDate),
          startingTime: safeDate(settings.startingTime),
          dueTime: safeDate(settings.dueTime),
          isEditing: false,
        };
      } catch (error) {
        console.error(`Error processing settings for ${code}:`, error);
        // Create fallback dates
        const now = new Date();
        const fallbackExamDate = new Date(now);
        fallbackExamDate.setDate(now.getDate() + 30);

        const fallbackStartTime = new Date(fallbackExamDate);
        fallbackStartTime.setHours(9, 0, 0, 0);

        const fallbackDueTime = new Date(fallbackExamDate);
        fallbackDueTime.setHours(12, 0, 0, 0);

        initialExamSettings[code as SubjectCode] = {
          examDate: fallbackExamDate,
          startingTime: fallbackStartTime,
          dueTime: fallbackDueTime,
          isExamSubjectActive: false,
          isEditing: false,
        };
      }
    });

    return initialExamSettings;
  });

  // Load settings for all subjects once on initial render
  useEffect(() => {
    const loadSettings = async () => {
      // Only run this once
      if (initialLoadComplete.current) return;
      if (loading) return;
      if (subjectCodes.length === 0) return;

      try {
        initialLoadComplete.current = true;
        setLoading(true);

        // Get all subject settings at once instead of individual calls
        const result = await getAllSubjectExamSettings();

        if (result.error) {
          setNotification({
            type: "error",
            message: result.error,
          });
          initialLoadComplete.current = false;
          return;
        }

        if (result.settings) {
          const settingsMap: Partial<
            Record<
              SubjectCode,
              {
                examDate: Date;
                startingTime: Date;
                dueTime: Date;
                isExamSubjectActive: boolean;
                isEditing: boolean;
              }
            >
          > = {};

          Object.entries(result.settings).forEach(([code, settings]) => {
            settingsMap[code as SubjectCode] = {
              ...settings,
              examDate: new Date(settings.examDate),
              startingTime: new Date(settings.startingTime),
              dueTime: new Date(settings.dueTime),
              isEditing: false,
            };
          });

          setExamSettings(settingsMap);
        }
      } catch (err) {
        setNotification({
          type: "error",
          message: "Failed to load subject settings. Please refresh the page.",
        });
        console.error(err);
        initialLoadComplete.current = false; // Allow retry on error
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // No dependencies array makes this run only once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle edit mode for a subject
  const toggleEditMode = (code: SubjectCode) => {
    setExamSettings((prev) => {
      const settings = prev[code];
      if (!settings) return prev;

      // When entering edit mode, initialize the temp time values
      if (!settings.isEditing) {
        return {
          ...prev,
          [code]: {
            ...settings,
            isEditing: true,
            tempStartTime: formatTimeForInput(settings.startingTime),
            tempEndTime: formatTimeForInput(settings.dueTime),
          },
        };
      } else {
        // When exiting edit mode without saving, remove temp values
        const { tempStartTime, tempEndTime, ...rest } = settings;
        return {
          ...prev,
          [code]: {
            ...rest,
            isEditing: false,
          },
        };
      }
    });
  };

  // Handle input change for a subject's settings
  const handleSettingChange = (
    code: SubjectCode,
    field: "examDate" | "startingTime" | "dueTime" | "isExamSubjectActive",
    value: Date | boolean | string,
  ) => {
    setExamSettings((prev) => {
      const settings = prev[code];
      if (!settings) return prev;

      // Handle time inputs specifically - store the raw input in temp fields
      if (typeof value === "string") {
        if (field === "startingTime") {
          // Store the raw input value in tempStartTime
          const updatedSettings = {
            ...settings,
            tempStartTime: value,
          };

          // If the value is a complete valid time, also update the actual Date object
          if (value.includes(":") && value.length >= 5) {
            try {
              const datePart = formatDateForInput(settings.examDate);
              const newDateTime = parseDateTime(datePart, value);

              if (!isNaN(newDateTime.getTime())) {
                updatedSettings.startingTime = newDateTime;
              }
            } catch (error) {
              console.error(`Error updating startingTime:`, error);
            }
          }

          return {
            ...prev,
            [code]: updatedSettings,
          };
        } else if (field === "dueTime") {
          // Store the raw input value in tempEndTime
          const updatedSettings = {
            ...settings,
            tempEndTime: value,
          };

          // If the value is a complete valid time, also update the actual Date object
          if (value.includes(":") && value.length >= 5) {
            try {
              const datePart = formatDateForInput(settings.examDate);
              const newDateTime = parseDateTime(datePart, value);

              if (!isNaN(newDateTime.getTime())) {
                updatedSettings.dueTime = newDateTime;
              }
            } catch (error) {
              console.error(`Error updating dueTime:`, error);
            }
          }

          return {
            ...prev,
            [code]: updatedSettings,
          };
        } else if (field === "examDate") {
          try {
            // For exam date changes, keep the time components
            const startTimePart = formatTimeForInput(settings.startingTime);
            const dueTimePart = formatTimeForInput(settings.dueTime);

            const newStartDateTime = parseDateTime(value, startTimePart);
            const newDueDateTime = parseDateTime(value, dueTimePart);

            return {
              ...prev,
              [code]: {
                ...settings,
                examDate: new Date(value + "T00:00:00"),
                startingTime: newStartDateTime,
                dueTime: newDueDateTime,
              },
            };
          } catch (error) {
            console.error(`Error updating examDate:`, error);
            return prev;
          }
        }
      }

      // Handle boolean values (for isExamSubjectActive)
      return {
        ...prev,
        [code]: {
          ...settings,
          [field]: value,
        },
      };
    });
  };

  // Save changes for a single subject
  const saveChanges = async (code: SubjectCode) => {
    if (loading) return; // Prevent multiple calls if already loading

    try {
      setLoading(true);
      const settings = examSettings[code];

      if (!settings) {
        setNotification({
          type: "error",
          message: `Settings for ${code} are not loaded.`,
        });
        setLoading(false);
        return;
      }

      // Validate that due time is after starting time
      if (settings.dueTime <= settings.startingTime) {
        setNotification({
          type: "error",
          message: `Due time must be after starting time for ${code}.`,
        });
        setLoading(false);
        return;
      }

      const updates = [
        {
          subjectCode: code,
          examDate: settings.examDate,
          startingTime: settings.startingTime,
          dueTime: settings.dueTime,
          isExamSubjectActive: settings.isExamSubjectActive,
        },
      ];

      const result = await bulkUpdateExamTimes(updates);

      if (result.error) {
        setNotification({
          type: "error",
          message: result.error,
        });
        return;
      }

      // Remove temporary time fields when saving
      setExamSettings((prev) => {
        const currentSettings = prev[code];
        if (!currentSettings) return prev;

        const { tempStartTime, tempEndTime, ...rest } = currentSettings;
        return {
          ...prev,
          [code]: {
            ...rest,
            isEditing: false,
          },
        };
      });

      setNotification({
        type: "success",
        message: `Successfully updated ${code} settings. ${result.updatedCount} student records updated.`,
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to save changes. Please try again.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Bulk save all changes
  const saveAllChanges = async () => {
    if (loading) return; // Prevent multiple calls if already loading

    try {
      setLoading(true);

      // Create updates array from all subjects that are in edit mode
      const updates = Object.entries(examSettings)
        .filter(([_, settings]) => settings && settings.isEditing)
        .map(([code, settings]) => {
          if (!settings) {
            throw new Error(`Settings for ${code} are undefined`);
          }

          // Validate time order for each subject
          if (settings.dueTime <= settings.startingTime) {
            throw new Error(`Due time must be after starting time for ${code}`);
          }

          return {
            subjectCode: code as SubjectCode,
            examDate: settings.examDate,
            startingTime: settings.startingTime,
            dueTime: settings.dueTime,
            isExamSubjectActive: settings.isExamSubjectActive,
          };
        });

      if (updates.length === 0) {
        setNotification({
          type: "error",
          message: "No changes to save. Please edit at least one subject.",
        });
        setLoading(false);
        return;
      }

      const result = await bulkUpdateExamTimes(updates);

      if (result.error) {
        setNotification({
          type: "error",
          message: result.error,
        });
        return;
      }

      // Reset all edit modes and remove temp fields
      setExamSettings((prev) => {
        const newSettings = { ...prev };
        Object.keys(newSettings).forEach((code) => {
          const settings = newSettings[code as SubjectCode];
          if (settings && settings.isEditing) {
            // Remove temporary fields when saving
            const { tempStartTime, tempEndTime, ...rest } = settings;
            newSettings[code as SubjectCode] = {
              ...rest,
              isEditing: false,
            };
          }
        });
        return newSettings;
      });

      setNotification({
        type: "success",
        message: `Successfully updated ${updates.length} subjects. ${result.updatedCount} student records updated.`,
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save changes. Please try again.";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Memoize notification to prevent unnecessary re-renders
  const notificationComponent = useMemo(() => {
    if (!notification) return null;
    return <NotificationMessage notification={notification} />;
  }, [notification]);

  if (loading && !initialLoadComplete.current) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {notificationComponent}

      <div className="mb-6 flex justify-end">
        <button
          onClick={saveAllChanges}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjectCodes.map((subject) => {
              // Get settings for this subject
              const settings = examSettings[subject.code];

              // Skip if settings aren't loaded yet
              if (!settings) {
                return (
                  <tr key={subject.code}>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading settings...
                    </td>
                  </tr>
                );
              }

              return (
                <SubjectRow
                  key={subject.code}
                  subject={subject}
                  settings={settings}
                  onToggleEditMode={() => toggleEditMode(subject.code)}
                  onSettingChange={handleSettingChange}
                  onSaveChanges={() => saveChanges(subject.code)}
                  loading={loading}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
