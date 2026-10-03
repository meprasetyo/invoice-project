import { ReactNode, Suspense } from 'react';
import { Navbar } from '@/components/navbar';

type MainLayoutProps = {
  children: ReactNode;
};

const LoadingPage = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
    Loading…
  </div>
);

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingPage />}>{children}</Suspense>
      </main>
    </div>
  );
}
