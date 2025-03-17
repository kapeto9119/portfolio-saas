import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Analytics } from '@/components/analytics';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};

export const metadata: Metadata = {
  title: 'Portfolio Builder - Create your professional portfolio',
  description: 'Create a stunning portfolio website with our easy-to-use platform. Perfect for students, recent graduates, and professionals.',
  keywords: ['portfolio', 'resume', 'personal website', 'job search', 'professional profile'],
  authors: [{ name: 'Portfolio SaaS Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <script src="/empty-file.js" defer></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased transition-colors duration-300`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="portfolio-saas-theme"
          >
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <main className="min-h-screen">
              {children}
            </main>
            <ToastProvider />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}