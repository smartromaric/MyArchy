/**
 * Layout principal de l'application
 * App Router de Next.js 15
 */

import { Providers } from '@/app/providers/Providers';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Architecture Template',
  description: 'Template avec Feature-Sliced Design + Layered Architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

