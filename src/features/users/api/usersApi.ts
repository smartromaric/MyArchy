/**
 * API Client pour Users
 * Couche Data Access - Gère toutes les requêtes API liées aux users
 * Utilise JSONPlaceholder API publique: https://jsonplaceholder.typicode.com
 */

import { API_ENDPOINTS } from '@/shared/lib/constants/api.constants';
import type { ApiResponse, PaginationParams } from '@/shared/types/api.types';
import type { User, CreateUserDTO, UpdateUserDTO, UserFilters } from '../types/user.types';

/**
 * Helper pour mapper les données JSONPlaceholder vers notre format User
 */
const mapJsonPlaceholderUser = (data: any): User => {
  const nameParts = data.name?.split(' ') || [];
  return {
    ...data,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Fetch direct vers JSONPlaceholder (pas de wrapper ApiResponse)
 */
const fetchJsonPlaceholder = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const usersApi = {
  /**
   * Récupère tous les users
   * JSONPlaceholder retourne directement un tableau
   */
  getAll: async (params?: PaginationParams & UserFilters): Promise<ApiResponse<User[]>> => {
    const users = await fetchJsonPlaceholder<User[]>(API_ENDPOINTS.USERS.BASE);
    const mappedUsers = users.map(mapJsonPlaceholderUser);
    
    // Appliquer les filtres côté client (JSONPlaceholder ne supporte pas les filtres)
    let filtered = mappedUsers;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      message: 'Users récupérés avec succès',
      data: filtered,
    };
  },

  /**
   * Récupère un user par son ID
   */
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const user = await fetchJsonPlaceholder<User>(API_ENDPOINTS.USERS.BY_ID(id));
    return {
      success: true,
      message: 'User récupéré avec succès',
      data: mapJsonPlaceholderUser(user),
    };
  },

  /**
   * Crée un nouveau user (simulé - JSONPlaceholder retourne juste l'ID)
   */
  create: async (data: CreateUserDTO): Promise<ApiResponse<User>> => {
    const response = await fetch(API_ENDPOINTS.USERS.BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        username: data.email.split('@')[0],
      }),
    });
    const created = await response.json();
    return {
      success: true,
      message: 'User créé avec succès',
      data: mapJsonPlaceholderUser(created),
    };
  },

  /**
   * Met à jour un user (simulé)
   */
  update: async (id: string, data: UpdateUserDTO): Promise<ApiResponse<User>> => {
    const response = await fetch(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await response.json();
    return {
      success: true,
      message: 'User mis à jour avec succès',
      data: mapJsonPlaceholderUser(updated),
    };
  },

  /**
   * Supprime un user (simulé)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    await fetch(API_ENDPOINTS.USERS.BY_ID(id), { method: 'DELETE' });
    return {
      success: true,
      message: 'User supprimé avec succès',
      data: undefined,
    };
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const user = await fetchJsonPlaceholder<User>(API_ENDPOINTS.USERS.PROFILE);
    return {
      success: true,
      message: 'Profil récupéré avec succès',
      data: mapJsonPlaceholderUser(user),
    };
  },
};

