/**
 * Schémas de validation Zod pour Users
 */

import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['admin', 'user', 'moderator'], {
    errorMap: () => ({ message: 'Rôle invalide' }),
  }),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'deleted']).optional(),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;



