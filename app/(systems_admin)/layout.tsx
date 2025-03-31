import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import CollapsibleSidebar from "./_components/Sidebar";

export const dynamic = "force-dynamic";

export default async function SystemAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  // Fixed the null check for user
  if (!session.user || session.user.role !== "SYSTEM_ADMINISTRATOR") {
    redirect("/");
  }

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navbar is fixed and sits outside the main flex layout */}
        <Navbar />

        {/* Main content area that includes both sidebar and page content */}
        <div className="flex flex-1 pt-[88px]">
          <CollapsibleSidebar />

          <main
            id="main-content"
            className="flex-1 p-10 transition-all duration-300 ease-in-out"
            style={{ marginLeft: "280px" }} // Set initial margin to match sidebar width
          >
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
