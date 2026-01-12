/**
 * Types communs partagés dans toute l'application
 */

export type Status = 'active' | 'inactive' | 'pending' | 'deleted';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

