/**
 * Types pour le domaine Users
 * Adapté pour JSONPlaceholder API
 */

import { BaseEntity, Status } from '@/shared/types/common.types';

export interface User extends BaseEntity {
  id: number; // JSONPlaceholder utilise number
  email: string;
  name: string; // JSONPlaceholder utilise "name" au lieu de firstName/lastName
  username: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  // Champs calculés pour compatibilité
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: Status;
  avatar?: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: Status;
  avatar?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: Status;
}

