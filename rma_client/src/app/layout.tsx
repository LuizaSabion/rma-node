import { cn } from '@/lib/utils';
import { Wrench } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'RMA Zenith - Garantia de dispositivos',
  description: 'Processamento de sinistro / garantia de dispositivos eletrônicos',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={cn('h-full', 'antialiased', 'font-sans')}>
      <body className="flex min-h-full flex-col">
        <header className="bg-grafite text-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/sinistro" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary">
                <Wrench className="size-5" />
              </span>
              <span>
                <span className="block leading-tight font-semibold">RMA Zenith</span>
                <span className="block text-xs text-white/60">Central de garantia e reparos</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
