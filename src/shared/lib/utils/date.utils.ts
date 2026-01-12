/**
 * Utilitaires pour la manipulation des dates
 */

export const formatDate = (date: Date | string, locale: string = 'fr-FR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatDateTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const formatTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale);
};

export const isDateValid = (date: unknown): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
};

