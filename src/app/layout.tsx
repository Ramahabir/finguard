import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatLauncher from "../components/ChatLauncher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinGuard SEA – Scam Message Checker",
  description:
    "Paste a suspicious message to check risk level, scam type, and get prevention tips in your local language.",
  metadataBase: new URL("https://finguard.local"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-black focus:text-white"
        >
          Skip to content
        </a>
        <div className="relative">
          {children}
        </div>
        {/* Floating chat launcher available on all pages */}
  <ChatLauncher />
      </body>
    </html>
  );
}
