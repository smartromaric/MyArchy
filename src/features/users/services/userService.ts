/**
 * Services métier pour Users
 * Couche Business Logic - Contient la logique métier pure
 */

import type { User } from '../types/user.types';

export class UserService {
  /**
   * Formate le nom complet d'un user
   */
  static formatFullName(user: User): string {
    // JSONPlaceholder utilise "name", on l'utilise si disponible
    if (user.name) return user.name;
    // Sinon on combine firstName et lastName
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  /**
   * Vérifie si un user est actif
   */
  static isActive(user: User): boolean {
    return user.status === 'active';
  }

  /**
   * Vérifie si un user est admin
   */
  static isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * Calcule l'initiale du user (pour avatar)
   */
  static getInitials(user: User): string {
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || user.username?.[0].toUpperCase() || 'U';
  }

  /**
   * Filtre les users selon des critères
   */
  static filterUsers(users: User[], search?: string, role?: string): User[] {
    let filtered = users;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    return filtered;
  }
}

