import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'arzum.ai — AI trip planner & Europe deals map',
  description: 'Browse Europe flight deals and plan premium AI itineraries.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <div className="min-h-screen bg-slate-950 text-white">
            <AppHeader />
            <main className="min-h-[calc(100vh-120px)]">{children}</main>
            <AppFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
