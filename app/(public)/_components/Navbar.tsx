"use client";

import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/app/(auth)/_components/AuthTabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
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
            src="/dbe-logo.svg"
            alt="DBE Logo"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        <Link href="/" className="flex flex-col items-center mx-auto">
          <div className="flex items-center">
            {/* DEMS Text with emphasized E */}
            <div className="flex items-center">
              <span className="text-white font-bold text-7xl">D</span>
              <div className="relative mx-1">
                <span className="relative text-white font-bold text-7xl px-2">
                  E
                </span>
              </div>
              <span className="text-white font-bold text-7xl mr-2">M</span>
              <span className="text-white font-bold text-7xl">S</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - moved to absolute position */}
        <div className="hidden md:block absolute right-7">
          <div className="text-white">
            <Button
              className="px-8 py-3 bg-white text-[#4a6e8a] font-medium rounded-md hover:bg-gray-100 text-lg"
              onClick={handleStartClick}
            >
              Start
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - moved to absolute position */}
        <div className="md:hidden block absolute right-7">
          <div className="text-white">
            <Button
              className="px-5 py-2 bg-white text-[#4a6e8a] font-medium rounded-md hover:bg-gray-100"
              onClick={handleStartClick}
            >
              Start
            </Button>
          </div>
        </div>
      </nav>

      {/* Import AuthModal and pass state */}
      <AuthModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </header>
  );
}
