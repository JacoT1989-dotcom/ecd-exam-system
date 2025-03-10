"use client";
import Link from "next/link";
import UserButton from "./UserButton";
import { usePathname } from "next/navigation";
import { useSession } from "../SessionProvider";

const Navbar = () => {
  // Extract developerId from the current path
  const pathname = usePathname();
  const developerId = pathname.split("/")[1];

  // Get user information from session
  const { user } = useSession();

  return (
    <>
      {/* Fixed top navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="bg-[#3e6788] text-white shadow-lg">
          <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
            <Link href={`/students`} className="flex items-center">
              {/* Show Student: followed by user ID */}
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                Student: {user?.id}
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
