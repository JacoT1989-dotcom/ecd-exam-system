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
        title: "Exam Scheduling",
        links: [
          {
            name: "Schedule Exam",
            href: "/system-admin/assessment/exams/schedule",
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
