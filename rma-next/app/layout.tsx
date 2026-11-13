import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zenith RMA',
  description: 'Garantia de dispositivos eletrônicos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topo">
          <Link href="/" className="marca">🔧 Zenith RMA</Link>
          <span>Central de Garantia</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
