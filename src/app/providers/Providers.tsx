/**
 * Providers wrapper pour App Router
 * Doit être un Client Component car Redux et Toast nécessitent des hooks
 */

'use client';

import { ReduxProvider } from './ReduxProvider';
import { ToastProvider } from './ToastProvider';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Composant wrapper pour tous les providers
 * Utilisé dans le layout.tsx (Server Component)
 */
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReduxProvider>
      <ToastProvider>{children}</ToastProvider>
    </ReduxProvider>
  );
};



