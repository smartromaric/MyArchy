/**
 * Client API centralisé
 * Gère toutes les requêtes HTTP avec intercepteurs et gestion d'erreurs
 */

import { AppError, NetworkError, AuthError } from '@/shared/services/errorHandler';
import { notificationService } from '@/shared/services/notificationService';
import type { ApiResponse, RequestConfig } from '@/shared/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Crée les headers avec authentification
 */
const createHeaders = async (
  customHeaders: Record<string, string> = {}
): Promise<Record<string, string>> => {
  try {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      return customHeaders;
    }

    // Récupérer le token depuis le store Redux ou localStorage
    // TODO: Adapter selon votre système d'auth
    const userToken = localStorage.getItem('userToken');
    const appToken = localStorage.getItem('appToken');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (appToken) {
      headers['x-app-token'] = appToken;
    }

    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    return headers;
  } catch (error) {
    console.error('Error creating headers:', error);
    throw error;
  }
};

/**
 * Construit l'URL avec les paramètres de requête
 */
const buildUrl = (endpoint: string, params?: RequestConfig['params']): string => {
  if (!params) return `${API_BASE_URL}${endpoint}`;

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
};

/**
 * Client fetch générique avec gestion d'erreurs
 */
const fetchClient = async (endpoint: string, options: RequestConfig = {}): Promise<Response> => {
  try {
    const headers = await createHeaders(options.headers as Record<string, string>);
    const url = buildUrl(endpoint, options.params);

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    // Gérer les erreurs d'authentification
    if (response.status === 401) {
      console.warn('Unauthorized request, redirecting to login page...');
      // TODO: Adapter selon votre système d'auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        window.location.href = '/login';
      }
      throw new AuthError('Session expirée. Veuillez vous reconnecter.');
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);

    if (error instanceof AppError) {
      throw error;
    } else if (
      error instanceof Error &&
      error.name === 'TypeError' &&
      error.message.includes('fetch')
    ) {
      throw new NetworkError('Erreur de connexion réseau');
    } else {
      throw new AppError('Erreur lors de la requête', 'FETCH_ERROR');
    }
  }
};

/**
 * Parse la réponse JSON avec gestion d'erreurs
 */
const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new AppError('Erreur lors du parsing de la réponse', 'PARSE_ERROR');
  }
};

/**
 * Client API avec méthodes HTTP
 */
export const apiClient = {
  /**
   * GET request
   */
  get: async <T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await fetchClient(endpoint, { ...config, method: 'GET' });
    if (!response.ok) {
      notificationService.handleApiResponse(response);
      throw new AppError(`Erreur ${response.status}`, 'HTTP_ERROR', response.status);
    }
    return parseResponse<T>(response);
  },

  /**
   * POST request
   */
  post: async <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await fetchClient(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      notificationService.handleApiResponse(response);
      throw new AppError(`Erreur ${response.status}`, 'HTTP_ERROR', response.status);
    }
    return parseResponse<T>(response);
  },

  /**
   * PUT request
   */
  put: async <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await fetchClient(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      notificationService.handleApiResponse(response);
      throw new AppError(`Erreur ${response.status}`, 'HTTP_ERROR', response.status);
    }
    return parseResponse<T>(response);
  },

  /**
   * PATCH request
   */
  patch: async <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await fetchClient(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      notificationService.handleApiResponse(response);
      throw new AppError(`Erreur ${response.status}`, 'HTTP_ERROR', response.status);
    }
    return parseResponse<T>(response);
  },

  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await fetchClient(endpoint, { ...config, method: 'DELETE' });
    if (!response.ok) {
      notificationService.handleApiResponse(response);
      throw new AppError(`Erreur ${response.status}`, 'HTTP_ERROR', response.status);
    }
    return parseResponse<T>(response);
  },
};

export default apiClient;

