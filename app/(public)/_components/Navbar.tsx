"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/app/SessionProvider";
import AuthModal from "@/app/(auth)/_components/AuthTabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartClick = () => {
    setIsModalOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#4a6e8a] shadow-md">
      <nav className="container mx-auto px-7 flex items-center justify-between h-32 relative">
        {/* DBE Logo on the far left */}
        <div className="absolute left-7">
          <Image
            src="/dbe_logo.png"
            alt="DBE Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <Link href="/" className="flex flex-col items-center mx-auto">
          <div className="flex items-center">
            {/* Exam Icon - using a document/clipboard icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            {/* DEMS Text with emphasized E */}
            <div className="flex items-center">
              <span className="text-white font-bold text-5xl">D</span>
              <div className="relative mx-1">
                <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
                <span className="relative text-white font-bold text-5xl px-2">
                  E
                </span>
              </div>
              <span className="text-white font-bold text-5xl">MS</span>
            </div>
          </div>
          {/* Full name below */}
          <span className="text-white text-lg tracking-wider mt-2 text-center">
            DIGITAL EXAM MANAGEMENT SYSTEM
          </span>
        </Link>

        {/* Desktop Navigation - moved to absolute position */}
        <div className="hidden md:block absolute right-7">
          <div className="text-white">
            {!user ? (
              <Button
                className="px-8 py-3 bg-white text-[#4a6e8a] font-medium rounded-md hover:bg-gray-100 text-lg"
                onClick={handleStartClick}
              >
                Start
              </Button>
            ) : (
              <Button className="px-6 py-2.5 border border-white text-white rounded-md hover:bg-white/10 transition-colors text-lg">
                Profile
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation - moved to absolute position */}
        <div className="md:hidden block absolute right-7">
          <div className="text-white">
            {!user ? (
              <Button
                className="px-5 py-2 bg-white text-[#4a6e8a] font-medium rounded-md hover:bg-gray-100"
                onClick={handleStartClick}
              >
                Start
              </Button>
            ) : (
              <Button className="px-4 py-1.5 border border-white text-white rounded-md hover:bg-white/10 transition-colors">
                Profile
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Import AuthModal and pass state */}
      {!user && <AuthModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
    </header>
  );
}
