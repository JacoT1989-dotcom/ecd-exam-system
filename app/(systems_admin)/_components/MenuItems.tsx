"use client";

import { useMemo } from "react";

export interface MenuLink {
  name: string;
  href: string;
  isSubmenu?: false;
}

export interface MenuItem {
  title: string;
  links: (MenuLink | MenuItem)[];
  isSubmenu?: boolean;
}

// Helper type guard functions
export function isMenuItem(item: MenuItem | MenuLink): item is MenuItem {
  return (
    "title" in item &&
    "links" in item &&
    Array.isArray((item as MenuItem).links)
  );
}

export function isSubmenu(item: MenuItem | MenuLink): boolean {
  return isMenuItem(item) && item.isSubmenu === true;
}

export function useMenuItems() {
  return useMemo<MenuItem[]>(
    () => [
      {
        title: "Academic Management",
        links: [
          {
            title: "Students",
            isSubmenu: true,
            links: [
              {
                name: "Student Directory",
                href: "/admin/students/directory",
              },
              {
                name: "Admissions",
                href: "/admin/students/admissions",
              },
              {
                name: "Enrollment Status",
                href: "/admin/students/enrollment-status",
              },
              {
                name: "Student Progress",
                href: "/admin/students/progress",
              },
              {
                name: "Special Needs",
                href: "/admin/students/special-needs",
              },
              {
                name: "Behavioral Reports",
                href: "/admin/students/behavioral-reports",
              },
            ],
          },
          {
            title: "Classes",
            isSubmenu: true,
            links: [
              {
                name: "Class Schedule",
                href: "/admin/classes/schedule",
              },
              {
                name: "Class Rosters",
                href: "/admin/classes/rosters",
              },
              {
                name: "Room Assignments",
                href: "/admin/classes/room-assignments",
              },
              {
                name: "Elective Management",
                href: "/admin/classes/electives",
              },
            ],
          },
          {
            title: "Curriculum",
            isSubmenu: true,
            links: [
              {
                name: "Course Catalog",
                href: "/admin/curriculum/course-catalog",
              },
              {
                name: "Syllabus Management",
                href: "/admin/curriculum/syllabus",
              },
              {
                name: "Learning Materials",
                href: "/admin/curriculum/materials",
              },
              {
                name: "Curriculum Development",
                href: "/admin/curriculum/development",
              },
            ],
          },
        ],
      },
      {
        title: "Faculty & Staff",
        links: [
          {
            title: "Teachers",
            isSubmenu: true,
            links: [
              {
                name: "Teacher Directory",
                href: "/admin/faculty/teachers/directory",
              },
              {
                name: "Teaching Assignments",
                href: "/admin/faculty/teachers/assignments",
              },
              {
                name: "Certifications",
                href: "/admin/faculty/teachers/certifications",
              },
              {
                name: "Performance Reviews",
                href: "/admin/faculty/teachers/reviews",
              },
            ],
          },
          {
            title: "Staff",
            isSubmenu: true,
            links: [
              {
                name: "Staff Directory",
                href: "/admin/faculty/staff/directory",
              },
              {
                name: "Administrative Staff",
                href: "/admin/faculty/staff/administrative",
              },
              {
                name: "Support Staff",
                href: "/admin/faculty/staff/support",
              },
            ],
          },
          {
            title: "Professional Development",
            isSubmenu: true,
            links: [
              {
                name: "Training Programs",
                href: "/admin/faculty/development/training",
              },
              {
                name: "Workshops",
                href: "/admin/faculty/development/workshops",
              },
              {
                name: "Conferences",
                href: "/admin/faculty/development/conferences",
              },
            ],
          },
        ],
      },
      {
        title: "Assessment & Reporting",
        links: [
          {
            title: "Examinations",
            isSubmenu: true,
            links: [
              {
                name: "Exam Schedule",
                href: "/admin/assessment/exams/schedule",
              },
              {
                name: "Create Exams",
                href: "/admin/assessment/exams/create",
              },
              {
                name: "Grade Entry",
                href: "/admin/assessment/exams/grades",
              },
              {
                name: "Standardized Tests",
                href: "/admin/assessment/exams/standardized",
              },
            ],
          },
          {
            title: "Grading",
            isSubmenu: true,
            links: [
              {
                name: "Grading Policies",
                href: "/admin/assessment/grading/policies",
              },
              {
                name: "Grade Reports",
                href: "/admin/assessment/grading/reports",
              },
              {
                name: "Academic Records",
                href: "/admin/assessment/grading/records",
              },
            ],
          },
          {
            title: "Analytics",
            isSubmenu: true,
            links: [
              {
                name: "Performance Metrics",
                href: "/admin/assessment/analytics/performance",
              },
              {
                name: "Achievement Gaps",
                href: "/admin/assessment/analytics/gaps",
              },
              {
                name: "Learning Outcomes",
                href: "/admin/assessment/analytics/outcomes",
              },
            ],
          },
        ],
      },
      {
        title: "Student Services",
        links: [
          {
            name: "Counseling",
            href: "/admin/services/counseling",
          },
          {
            name: "Health Services",
            href: "/admin/services/health",
          },
          {
            name: "Special Education",
            href: "/admin/services/special-education",
          },
          {
            name: "Career Guidance",
            href: "/admin/services/career",
          },
          {
            name: "Transport Services",
            href: "/admin/services/transport",
          },
          {
            name: "Food Services",
            href: "/admin/services/food",
          },
        ],
      },
      {
        title: "Administration",
        links: [
          {
            name: "School Calendar",
            href: "/admin/administration/calendar",
          },
          {
            name: "Facilities Management",
            href: "/admin/administration/facilities",
          },
          {
            name: "Resource Allocation",
            href: "/admin/administration/resources",
          },
          {
            name: "Policy Management",
            href: "/admin/administration/policies",
          },
          {
            name: "Compliance",
            href: "/admin/administration/compliance",
          },
        ],
      },
      {
        title: "Communication",
        links: [
          {
            name: "Announcements",
            href: "/admin/communication/announcements",
          },
          {
            name: "Parent Portal",
            href: "/admin/communication/parent-portal",
          },
          {
            name: "Staff Communications",
            href: "/admin/communication/staff",
          },
          {
            name: "Community Engagement",
            href: "/admin/communication/community",
          },
          {
            name: "Event Calendar",
            href: "/admin/communication/events",
          },
        ],
      },
      {
        title: "Finance",
        links: [
          {
            name: "Budget Management",
            href: "/admin/finance/budget",
          },
          {
            name: "Tuition & Fees",
            href: "/admin/finance/tuition",
          },
          {
            name: "Financial Aid",
            href: "/admin/finance/aid",
          },
          {
            name: "Payroll",
            href: "/admin/finance/payroll",
          },
          {
            name: "Procurement",
            href: "/admin/finance/procurement",
          },
          {
            name: "Financial Reports",
            href: "/admin/finance/reports",
          },
        ],
      },
      {
        title: "Reports & Analytics",
        links: [
          {
            name: "Attendance Reports",
            href: "/admin/reports/attendance",
          },
          {
            name: "Academic Performance",
            href: "/admin/reports/academic",
          },
          {
            name: "Enrollment Trends",
            href: "/admin/reports/enrollment",
          },
          {
            name: "Staff Analytics",
            href: "/admin/reports/staff",
          },
          {
            name: "Operational Reports",
            href: "/admin/reports/operational",
          },
          {
            name: "Custom Reports",
            href: "/admin/reports/custom",
          },
        ],
      },
      {
        title: "System",
        links: [
          {
            name: "User Management",
            href: "/admin/system/users",
          },
          {
            name: "Access Control",
            href: "/admin/system/access",
          },
          {
            name: "Data Backup",
            href: "/admin/system/backup",
          },
          {
            name: "System Settings",
            href: "/admin/system/settings",
          },
          {
            name: "Audit Logs",
            href: "/admin/system/logs",
          },
          {
            name: "Help & Support",
            href: "/admin/system/help",
          },
        ],
      },
    ],
    [],
  );
}
