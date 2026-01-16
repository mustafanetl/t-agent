import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const AppHeader = () => (
  <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <Link href="/" className="text-lg font-semibold text-white">
        arzum.ai
      </Link>
      <nav className="flex items-center gap-3 text-sm text-white/80">
        <Link href="/pricing" className="hover:text-white">
          Pricing
        </Link>
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>
        <Button variant="secondary" size="sm">
          Sign in
        </Button>
      </nav>
    </div>
  </header>
);
