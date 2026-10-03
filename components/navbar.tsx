import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          <span>Invoice Generator</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/new-invoice">+ New Invoice</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
