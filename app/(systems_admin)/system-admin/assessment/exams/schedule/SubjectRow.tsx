import React from "react";
import { formatDateForInput, formatTimeForInput } from "./date-utils";
import { SubjectCodeInfo } from "./SubjectsTable";
import { type SubjectCode } from "./exam-timers";

interface SubjectRowProps {
  subject: SubjectCodeInfo;
  settings: {
    examDate: Date;
    startingTime: Date;
    dueTime: Date;
    isExamSubjectActive: boolean;
    isEditing: boolean;
    tempStartTime?: string;
    tempEndTime?: string;
  };
  onToggleEditMode: () => void;
  onSettingChange: (
    code: SubjectCode,
    field: "examDate" | "startingTime" | "dueTime" | "isExamSubjectActive",
    value: Date | boolean | string,
  ) => void;
  onSaveChanges: () => void;
  loading: boolean;
}

const SubjectRow: React.FC<SubjectRowProps> = ({
  subject,
  settings,
  onToggleEditMode,
  onSettingChange,
  onSaveChanges,
  loading,
}) => {
  const handleTimeInputChange = (
    field: "startingTime" | "dueTime",
    value: string,
  ) => {
    onSettingChange(subject.code, field, value);
  };

  const getTimeValue = (field: "startingTime" | "dueTime") => {
    if (field === "startingTime") {
      return (
        settings.tempStartTime || formatTimeForInput(settings.startingTime)
      );
    }
    return settings.tempEndTime || formatTimeForInput(settings.dueTime);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{subject.code}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{subject.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {settings.isEditing ? (
          <input
            type="date"
            className="border border-gray-300 rounded p-1 w-full"
            value={formatDateForInput(settings.examDate)}
            onChange={(e) =>
              onSettingChange(subject.code, "examDate", e.target.value)
            }
            aria-label={`Exam date for ${subject.title}`}
          />
        ) : (
          <div className="text-sm text-gray-900">
            {new Date(settings.examDate).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {settings.isEditing ? (
          <input
            type="text"
            pattern="[0-9]{1,2}:[0-9]{2}"
            placeholder="HH:MM"
            className="border border-gray-300 rounded p-1 w-full"
            value={getTimeValue("startingTime")}
            onChange={(e) =>
              handleTimeInputChange("startingTime", e.target.value)
            }
            onFocus={(e) => e.target.select()}
            aria-label={`Start time for ${subject.title}`}
          />
        ) : (
          <div className="text-sm text-gray-900">
            {new Date(settings.startingTime).toLocaleTimeString("en-ZA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {settings.isEditing ? (
          <input
            type="text"
            pattern="[0-9]{1,2}:[0-9]{2}"
            placeholder="HH:MM"
            className="border border-gray-300 rounded p-1 w-full"
            value={getTimeValue("dueTime")}
            onChange={(e) => handleTimeInputChange("dueTime", e.target.value)}
            onFocus={(e) => e.target.select()}
            aria-label={`End time for ${subject.title}`}
          />
        ) : (
          <div className="text-sm text-gray-900">
            {new Date(settings.dueTime).toLocaleTimeString("en-ZA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {settings.isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={onSaveChanges}
              disabled={loading}
              className="text-green-600 hover:text-green-900"
            >
              Save
            </button>
            <button
              onClick={onToggleEditMode}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onToggleEditMode}
            className="text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};

export default SubjectRow;
