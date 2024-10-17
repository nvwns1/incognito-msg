import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import QueryProvider from "@/context/QueryProvider";

export const metadata: Metadata = {
  title: "Incognito Message",
  description: "",
};
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
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
          </QueryProvider>
        </body>
      </html>
    </>
  );
}
