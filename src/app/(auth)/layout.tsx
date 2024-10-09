import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Incognito Message",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:5xl mb-6">
              Incognito Message
            </h1>
          </div>
          {children}
          <Toaster />
        </div>
      </main>
    </>
  );
}
