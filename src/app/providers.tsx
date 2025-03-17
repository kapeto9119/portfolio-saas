'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster position="top-right" richColors />
      {children}
    </ThemeProvider>
  );
}