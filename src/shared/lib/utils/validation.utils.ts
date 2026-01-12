/**
 * Utilitaires pour la validation
 */

import { ZodError } from 'zod';

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Formate les erreurs Zod en objet de validation
 */
export const formatZodErrors = (error: ZodError): ValidationErrors => {
  const errors: ValidationErrors = {};
  error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
};

/**
 * Extrait le premier message d'erreur d'une ZodError
 */
export const getFirstZodError = (error: ZodError): string => {
  return error.errors[0]?.message || 'Erreur de validation';
};

