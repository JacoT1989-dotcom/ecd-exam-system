"use client";
import Link from "next/link";
import UserButton from "./UserButton";
import { usePathname } from "next/navigation";
import { useSession } from "../SessionProvider";

const Navbar = () => {
  // Get current pathname to determine when to show home button
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const isStudentsMainPage =
    pathSegments.length === 1 && pathSegments[0] === "students";
  const isExamSubjectsPage = pathname.includes("exam/subjects/");
  const shouldShowHomeButton = !isStudentsMainPage && !isExamSubjectsPage;
  const developerId = pathSegments[0];

  // Get user information from session
  const { user } = useSession();

  return (
    <>
      {/* Fixed top navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="bg-[#3e6788] text-white shadow-lg">
          <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
            <Link href={`/students`} className="flex items-center">
              {/* Home button followed by Student ID */}
              <div className="flex items-center">
                {shouldShowHomeButton && (
                  <div className="flex items-center mr-4 text-white hover:text-cyan-300 transition-colors border rounded-lg px-2 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="font-medium text-lg">Home</span>
                  </div>
                )}
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                  Student: {user?.id}
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <UserButton className="text-lg" />
            </div>

            <div className="md:hidden flex items-center">
              <UserButton className="text-lg" />
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[120px] md:h-[88px]"></div>
    </>
  );
};

export default Navbar;
