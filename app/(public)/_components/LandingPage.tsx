"use client";

import React, { useState } from "react";
import { useSession } from "@/app/SessionProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AuthModal from "@/app/(auth)/_components/AuthTabs";

const LandingPage = () => {
  const { user } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartClick = () => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 bg-[#4a6e8a]">
        <div className="container mx-auto">
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center space-y-8 text-center max-w-2xl">
              <h1 className="text-4xl font-bold text-white mt-6">
                Digital Exam Management System
              </h1>
              <p className="text-xl text-white/90">
                A secure and efficient platform for managing national
                educational examinations.
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleStartClick}
                  className="bg-white text-[#4a6e8a] hover:bg-gray-100 rounded-md px-8 py-2 font-medium"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                title: "Secure Testing",
                description:
                  "Multi-layered security protocols protecting examination integrity.",
              },
              {
                title: "Efficient Administration",
                description:
                  "Streamlined workflows reducing administrative burden.",
              },
              {
                title: "Reliable Results",
                description:
                  "Accurate assessment with comprehensive verification processes.",
              },
              {
                title: "Quality Assurance",
                description: "Consistent examination standards nationwide.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-[#4a6e8a] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Stakeholders */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            For All Educational Stakeholders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Students",
                description:
                  "Secure exam access with real-time feedback and performance tracking.",
              },
              {
                title: "Teachers",
                description:
                  "Efficient tools for exam administration and performance analysis.",
              },
              {
                title: "School Administrators",
                description:
                  "Comprehensive oversight of school examination performance.",
              },
              {
                title: "Education Officials",
                description:
                  "National and provincial analytics for policy development.",
              },
              {
                title: "Parents",
                description:
                  "Transparent access to examination schedules and results.",
              },
              {
                title: "Examination Boards",
                description:
                  "End-to-end management tools and quality control measures.",
              },
            ].map((role, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-[#4a6e8a] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">
            Ready to Transform Educational Assessment?
          </h2>
          <Button
            onClick={handleStartClick}
            className="bg-white text-[#4a6e8a] hover:bg-gray-100 rounded-md font-medium px-8 py-2"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      {!user && <AuthModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
    </div>
  );
};

export default LandingPage;
