import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

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

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex w-full grow">
          <Sidebar />
          <main className="flex-grow bg-gray-100 m-2">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
