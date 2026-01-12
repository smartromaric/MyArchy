/**
 * Intercepteurs pour les requêtes API
 * Permet d'ajouter des comportements globaux (logging, retry, etc.)
 */

import type { ApiResponse } from '@/shared/types/api.types';

/**
 * Intercepteur de requête
 * Appelé avant chaque requête
 */
export const requestInterceptor = (config: RequestInit): RequestInit => {
  // Ajouter du logging en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Request]', config);
  }

  // Ajouter des headers personnalisés si nécessaire
  // config.headers = { ...config.headers, 'X-Custom-Header': 'value' };

  return config;
};

/**
 * Intercepteur de réponse
 * Appelé après chaque réponse
 */
export const responseInterceptor = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  // Ajouter du logging en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Response]', response);
  }

  // Transformer la réponse si nécessaire
  return response;
};

/**
 * Intercepteur d'erreur
 * Appelé en cas d'erreur
 */
export const errorInterceptor = (error: Error): Promise<Error> => {
  // Logging des erreurs
  console.error('[API Error]', error);

  // Retry logic, error transformation, etc.
  return Promise.reject(error);
};



