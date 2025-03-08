"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "../SessionProvider";

// Define icons for the sidebar
const DashboardIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
      fill="currentColor"
    />
  </svg>
);

const CoursesIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5ZM19 5V7H5V5H19ZM5 19V9H19V19H5ZM8 14H16V16H8V14ZM8 11H16V13H8V11Z"
      fill="currentColor"
    />
  </svg>
);

const MeetingsIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM19 7H5V5H19V7ZM7 11H9V17H7V11ZM11 11H13V17H11V11ZM15 11H17V17H15V11Z"
      fill="currentColor"
    />
  </svg>
);

const QuizzesIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
      fill="currentColor"
    />
  </svg>
);

const CertificatesIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 14.52 16.81 18.25 13.03 19.71L12 20.07L10.97 19.71C7.19 18.25 5 14.52 5 11V6.3L12 3.19L19 6.3V11ZM7.41 11.59L6 13L10 17L18 9L16.59 7.58L10 14.17L7.41 11.59Z"
      fill="currentColor"
    />
  </svg>
);

const FinancialIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 15.97 12.08 15.97C10.48 15.97 9.85 15.25 9.76 14.33H8.04C8.14 15.96 9.4 16.94 10.9 17.25V19H13.24V17.26C14.76 16.97 15.96 16.07 15.97 14.57C15.96 12.36 14.07 11.6 12.31 11.14Z"
      fill="currentColor"
    />
  </svg>
);

const SupportIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z"
      fill="currentColor"
    />
  </svg>
);

// Define the sidebar navigation items
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Courses", href: "/courses", icon: CoursesIcon },
  { name: "Meetings", href: "/meetings", icon: MeetingsIcon },
  { name: "Quizzes", href: "/quizzes", icon: QuizzesIcon },
  { name: "Certificates", href: "/certificates", icon: CertificatesIcon },
  { name: "Financial", href: "/financial", icon: FinancialIcon },
  { name: "Support", href: "/support", icon: SupportIcon },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSession();

  return (
    <aside className="bg-[#3e6788] w-80 min-h-screen flex flex-col border-r border-gray-700">
      {/* User profile section */}
      <div className="flex flex-col items-center p-6 border-b border-gray-700">
        <div className="relative w-24 h-24 mb-4">
          <div className="bg-white rounded-full w-full h-full overflow-hidden">
            {user?.avatarUrl ? (
              <Image
                src={user?.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                {user?.firstName?.charAt(0) || ""}
                {user?.lastName?.charAt(0) || ""}
              </div>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center">
          {user?.firstName} {user?.lastName}
        </h2>

        {/* Stats section */}
        <div className="flex w-full mt-4 justify-between border-t border-gray-600 pt-4">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">0</span>
            <span className="text-sm text-gray-200">Courses</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">0</span>
            <span className="text-sm text-gray-200">Following</span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-white hover:bg-[#2d4d66] hover:text-white transition-colors duration-200
                    ${isActive ? "bg-[#2d4d66] font-medium" : ""}`}
                >
                  <span
                    className={`mr-3 ${isActive ? "text-white" : "text-gray-200"}`}
                  >
                    <item.icon />
                  </span>
                  <span className="text-lg">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
