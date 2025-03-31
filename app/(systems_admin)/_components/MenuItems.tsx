"use client";

import { useMemo } from "react";

export interface MenuLink {
  name: string;
  href: string;
}

export interface MenuItem {
  title: string;
  links: MenuLink[];
}

export function useMenuItems() {
  return useMemo<MenuItem[]>(
    () => [
      {
        title: "Academic Management",
        links: [
          {
            name: "Student Directory",
            href: "/admin/students/directory",
          },
          {
            name: "Class Schedule",
            href: "/admin/classes/schedule",
          },
          {
            name: "Course Catalog",
            href: "/admin/curriculum/course-catalog",
          },
        ],
      },
      {
        title: "Users",
        links: [
          {
            name: "SUsers",
            href: "/admin/faculty/teachers/directory",
          },
          {
            name: "Students",
            href: "/admin/faculty/development/training",
          },
          {
            name: "Teachers",
            href: "/admin/faculty/staff/directory",
          },
        ],
      },
      {
        title: "Exam Scheduling",
        links: [
          {
            name: "Schedule Exam",
            href: "/admin/assessment/exams/schedule",
          },
          {
            name: "Grade Entry",
            href: "/admin/assessment/exams/grades",
          },
          {
            name: "Performance Metrics",
            href: "/admin/assessment/analytics/performance",
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
            name: "Facilities",
            href: "/admin/administration/facilities",
          },
          {
            name: "Policy Management",
            href: "/admin/administration/policies",
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
            name: "Financial Reports",
            href: "/admin/finance/reports",
          },
        ],
      },
      {
        title: "Reports",
        links: [
          {
            name: "Attendance",
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
            name: "System Settings",
            href: "/admin/system/settings",
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

// Helper function for type checking - no longer needed since we removed the submenu complexity
export function isMenuItem(item: MenuItem | MenuLink): item is MenuItem {
  return "title" in item && "links" in item;
}
