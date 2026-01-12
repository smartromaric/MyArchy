/**
 * API Client pour Products
 * Couche Data Access - Gère toutes les requêtes API liées aux produits
 * Utilise Fake Store API publique: https://fakestoreapi.com
 */

import { API_ENDPOINTS } from '@/shared/lib/constants/api.constants';
import type { ApiResponse, PaginationParams } from '@/shared/types/api.types';
import type { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from '../types/product.types';

/**
 * Helper pour mapper les données Fake Store API vers notre format Product
 */
const mapFakeStoreProduct = (data: any): Product => {
  return {
    id: String(data.id),
    name: data.title,
    description: data.description,
    price: data.price,
    stock: Math.floor(Math.random() * 100), // Fake Store n'a pas de stock, on génère aléatoirement
    category: data.category,
    status: 'active' as const,
    image: data.image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Fetch direct vers Fake Store API
 */
const fetchFakeStore = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const productsApi = {
  /**
   * Récupère tous les produits
   */
  getAll: async (params?: PaginationParams & ProductFilters): Promise<ApiResponse<Product[]>> => {
    const products = await fetchFakeStore<any[]>(API_ENDPOINTS.PRODUCTS.BASE);
    const mappedProducts = products.map(mapFakeStoreProduct);
    
    // Appliquer les filtres côté client
    let filtered = mappedProducts;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }
    if (params?.category) {
      filtered = filtered.filter((product) => product.category === params.category);
    }
    if (params?.minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= params.maxPrice!);
    }
    
    return {
      success: true,
      message: 'Produits récupérés avec succès',
      data: filtered,
    };
  },

  /**
   * Récupère un produit par son ID
   */
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const product = await fetchFakeStore<any>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return {
      success: true,
      message: 'Produit récupéré avec succès',
      data: mapFakeStoreProduct(product),
    };
  },

  /**
   * Crée un nouveau produit (simulé)
   */
  create: async (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.name,
        price: data.price,
        description: data.description,
        image: data.image || 'https://via.placeholder.com/300',
        category: data.category,
      }),
    });
    const created = await response.json();
    return {
      success: true,
      message: 'Produit créé avec succès',
      data: mapFakeStoreProduct(created),
    };
  },

  /**
   * Met à jour un produit (simulé)
   */
  update: async (id: string, data: UpdateProductDTO): Promise<ApiResponse<Product>> => {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.name,
        price: data.price,
        description: data.description,
        image: data.image,
        category: data.category,
      }),
    });
    const updated = await response.json();
    return {
      success: true,
      message: 'Produit mis à jour avec succès',
      data: mapFakeStoreProduct(updated),
    };
  },

  /**
   * Supprime un produit (simulé)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), { method: 'DELETE' });
    return {
      success: true,
      message: 'Produit supprimé avec succès',
      data: undefined,
    };
  },
};

