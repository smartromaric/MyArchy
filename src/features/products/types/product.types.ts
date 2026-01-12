/**
 * Types pour le domaine Products
 * Adapté pour Fake Store API
 */

import { BaseEntity, Status } from '@/shared/types/common.types';

export interface Product extends BaseEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: Status;
  image?: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  status?: Status;
  image?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: Status;
}



