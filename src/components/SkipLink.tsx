"use client";
import React from "react";
import { useI18n } from "../i18n";

export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-black focus:text-white"
    >
      {t("skipToContent")}
    </a>
  );
}
