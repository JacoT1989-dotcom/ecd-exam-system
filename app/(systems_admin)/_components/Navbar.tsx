"use client";
import Link from "next/link";
import Image from "next/image";
import UserButton from "./UserButton";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[88px] bg-indigo-900 text-white shadow-lg z-50">
      <div className="flex items-center justify-between h-full mx-auto px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          {/* You can add your school logo here */}
          <div className="bg-white p-2 rounded-full">
            <span className="text-indigo-900 text-xl font-bold">EDU</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Educational Admin
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <UserButton className="text-lg" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
