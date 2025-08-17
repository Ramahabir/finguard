import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatLauncher from "../components/ChatLauncher";
import Providers from "./providers";
import SkipLink from "../components/SkipLink";

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

function AppShell({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-background text-foreground`}
      >
    <SkipLink />
        <div className="relative">
          {children}
        </div>
        {/* Floating chat launcher available on all pages */}
        <ChatLauncher />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <Providers>
      <AppShell>{children}</AppShell>
  </Providers>
  );
}
