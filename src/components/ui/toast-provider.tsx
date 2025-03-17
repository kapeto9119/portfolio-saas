"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

/**
 * Toast provider component that integrates with the theme system
 * Uses sonner for beautiful, accessible toast notifications
 */
export function ToastProvider() {
  const { theme } = useTheme();
  
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        className: "group",
      }}
      theme={theme as "light" | "dark" | "system"}
      closeButton
      richColors
    />
  );
} 