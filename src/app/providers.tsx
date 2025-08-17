"use client";
import React from "react";
import { LanguageProvider } from "../i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
