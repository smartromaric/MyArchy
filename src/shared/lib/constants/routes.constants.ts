/**
 * Constantes pour les routes de l'application
 */

export const ROUTES = {
  HOME: '/',
  USERS: {
    BASE: '/users',
    BY_ID: (id: string | number) => `/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string | number) => `/products/${id}`,
  },
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;



