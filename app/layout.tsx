import "./globals.css";
import { validateRequest } from "@/auth";
import Providers from "./Providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, session } = await validateRequest();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers user={user} session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
