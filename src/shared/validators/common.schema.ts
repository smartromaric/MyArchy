/**
 * Schémas de validation communs
 */

import { z } from 'zod';

/**
 * Schéma pour les IDs
 */
export const idSchema = z.string().uuid('ID invalide');

/**
 * Schéma pour la pagination
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});

/**
 * Schéma pour les dates
 */
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)');



