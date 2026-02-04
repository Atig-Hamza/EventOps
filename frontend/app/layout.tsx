import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventOps",
  description: "Modern Event Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-800">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
