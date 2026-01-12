/**
 * Constantes pour les endpoints API
 * Organisées par domaine métier
 * 
 * APIs publiques utilisées :
 * - JSONPlaceholder pour Users: https://jsonplaceholder.typicode.com
 * - Fake Store API pour Products: https://fakestoreapi.com
 */

export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    BASE: 'https://jsonplaceholder.typicode.com/users',
    BY_ID: (id: string) => `https://jsonplaceholder.typicode.com/users/${id}`,
    PROFILE: 'https://jsonplaceholder.typicode.com/users/1',
  },
  PRODUCTS: {
    BASE: 'https://fakestoreapi.com/products',
    BY_ID: (id: string) => `https://fakestoreapi.com/products/${id}`,
    BY_CATEGORY: (category: string) => `https://fakestoreapi.com/products/category/${category}`,
  },
} as const;

