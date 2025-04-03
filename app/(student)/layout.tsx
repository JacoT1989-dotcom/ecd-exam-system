import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== "STUDENT") {
    redirect("/");
  }

  // Fetch the subject count for this student
  let subjectCount = 0;
  try {
    // Count the subjects for this user
    subjectCount = await prisma.subject.count({
      where: {
        userId: session.user.id,
      },
    });

    console.log(
      `[SERVER] Subject count for user ${session.user.id}: ${subjectCount}`,
    );
  } catch (error) {
    console.error("[SERVER] Error fetching subject count:", error);
  }

  // IMPORTANT: Add the subject count directly to the user object
  const userWithSubjectCount = {
    ...session.user,
    subjectCount,
  };

  console.log(
    `[SERVER] Added subjectCount (${subjectCount}) directly to user object`,
  );

  // Create a modified value object with the enhanced user object
  const sessionProviderValue = {
    user: userWithSubjectCount,
    session: session.session,
  };

  console.log(`[SERVER] Passing to SessionProvider with modified user object`);

  return (
    <SessionProvider value={sessionProviderValue}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex w-full grow">
          <Sidebar />
          {/* Main content area with ID for JavaScript manipulation */}
          <main
            id="main-content"
            className="flex-grow bg-gray-100 m-2"
            style={{
              marginLeft: "320px",
              transition: "margin-left 0.3s ease-in-out",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
