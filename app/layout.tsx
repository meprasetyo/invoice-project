import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import JotaiProviders from '@/components/jotai-provider';
import { ProgressBarProviders } from '@/components/progress-bar';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Invoice Generator',
  description: 'Create and manage invoices with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen antialiased font-sans')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JotaiProviders>
            <Suspense>
              <ProgressBarProviders>
                <MainContainer>{children}</MainContainer>
              </ProgressBarProviders>
            </Suspense>
          </JotaiProviders>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

function MainContainer({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
