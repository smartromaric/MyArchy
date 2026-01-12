/**
 * Provider pour react-hot-toast
 */

'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
};



