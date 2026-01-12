# 🎯 Guide : Créer une nouvelle Feature

Ce guide vous explique étape par étape comment créer une nouvelle feature (ex: "products") en suivant l'architecture du template.

## 📋 Étapes à suivre

### 1. Créer la structure de dossiers

```bash
mkdir -p src/features/products/{api,components,hooks,services,store,types,validators}
```

Structure créée :
```
src/features/products/
├── api/
├── components/
├── hooks/
├── services/
├── store/
├── types/
├── validators/
└── index.ts (à créer)
```

### 2. Créer les Types (`types/product.types.ts`)

```typescript
import { BaseEntity, Status } from '@/shared/types/common.types';

export interface Product extends BaseEntity {
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
```

### 3. Créer les Validators (`validators/product.schema.ts`)

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
  category: z.string().min(1, 'La catégorie est requise'),
  image: z.string().url('URL invalide').optional().or(z.literal('')),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'deleted']).optional(),
  image: z.string().url().optional().or(z.literal('')),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
```

### 4. Créer l'API Client (`api/productsApi.ts`)

```typescript
import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginationParams } from '@/shared/types/api.types';
import type { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from '../types/product.types';

export const productsApi = {
  /**
   * Récupère tous les produits avec pagination et filtres
   */
  getAll: (params?: PaginationParams & ProductFilters): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>('/products', { params });
  },

  /**
   * Récupère un produit par son ID
   */
  getById: (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Crée un nouveau produit
   */
  create: (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
    return apiClient.post<Product>('/products', data);
  },

  /**
   * Met à jour un produit
   */
  update: (id: string, data: UpdateProductDTO): Promise<ApiResponse<Product>> => {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  /**
   * Supprime un produit
   */
  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
```

### 5. Créer le Service Métier (`services/productService.ts`)

```typescript
import type { Product } from '../types/product.types';

export class ProductService {
  /**
   * Formate le prix avec devise
   */
  static formatPrice(product: Product, currency: string = '€'): string {
    return `${product.price.toFixed(2)} ${currency}`;
  }

  /**
   * Vérifie si un produit est en stock
   */
  static isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  /**
   * Vérifie si un produit est disponible
   */
  static isAvailable(product: Product): boolean {
    return product.status === 'active' && this.isInStock(product);
  }

  /**
   * Calcule le prix avec réduction
   */
  static calculateDiscountedPrice(product: Product, discountPercent: number): number {
    return product.price * (1 - discountPercent / 100);
  }

  /**
   * Filtre les produits selon des critères
   */
  static filterProducts(
    products: Product[],
    filters: { search?: string; category?: string; minPrice?: number; maxPrice?: number }
  ): Product[] {
    let filtered = products;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
    }

    return filtered;
  }
}
```

### 6. Créer le Redux Slice (`store/productsSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product.types';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
  };
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: null,
    minPrice: null,
    maxPrice: null,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (
      state,
      action: PayloadAction<{
        search?: string;
        category?: string | null;
        minPrice?: number | null;
        maxPrice?: number | null;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearProducts: (state) => {
      state.products = [];
      state.currentProduct = null;
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
  setFilters,
  clearProducts,
} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
```

### 7. Créer les Thunks (`store/productsThunks.ts`)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../api/productsApi';
import { notificationService } from '@/shared/services/notificationService';
import type { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from '../types/product.types';
import type { PaginationParams } from '@/shared/types/api.types';

/**
 * Récupère tous les produits
 */
export const fetchProductsThunk = createAsyncThunk(
  'products/fetchAll',
  async (params?: PaginationParams & ProductFilters, { rejectWithValue }) => {
    try {
      const response = await productsApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Récupère un produit par ID
 */
export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Crée un nouveau produit
 */
export const createProductThunk = createAsyncThunk(
  'products/create',
  async (data: CreateProductDTO, { rejectWithValue }) => {
    try {
      const response = await productsApi.create(data);
      notificationService.success('Produit créé avec succès');
      return response.data;
    } catch (error) {
      notificationService.error('Erreur lors de la création du produit');
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Met à jour un produit
 */
export const updateProductThunk = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: string; data: UpdateProductDTO }, { rejectWithValue }) => {
    try {
      const response = await productsApi.update(id, data);
      notificationService.success('Produit mis à jour avec succès');
      return response.data;
    } catch (error) {
      notificationService.error('Erreur lors de la mise à jour du produit');
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Supprime un produit
 */
export const deleteProductThunk = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsApi.delete(id);
      notificationService.success('Produit supprimé avec succès');
      return id;
    } catch (error) {
      notificationService.error('Erreur lors de la suppression du produit');
      return rejectWithValue((error as Error).message);
    }
  }
);
```

### 8. Créer les Selectors (`store/productsSelectors.ts`)

```typescript
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import type { Product } from '../types/product.types';

// Selectors de base
const selectProductsState = (state: RootState) => state.products;

export const selectProducts = createSelector([selectProductsState], (state) => state.products);

export const selectCurrentProduct = createSelector(
  [selectProductsState],
  (state) => state.currentProduct
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (state) => state.loading
);

export const selectProductsError = createSelector([selectProductsState], (state) => state.error);

export const selectProductsFilters = createSelector([selectProductsState], (state) => state.filters);

// Selectors dérivés
export const selectAvailableProducts = createSelector([selectProducts], (products) =>
  products.filter((product) => product.status === 'active' && product.stock > 0)
);

export const selectProductsByCategory = createSelector(
  [selectProducts, (state: RootState, category: string) => category],
  (products, category) => products.filter((product) => product.category === category)
);

export const selectProductById = createSelector(
  [selectProducts, (state: RootState, id: string) => id],
  (products, id) => products.find((product) => product.id === id)
);

export const selectProductsInPriceRange = createSelector(
  [selectProducts, (state: RootState, min: number, max: number) => [min, max]],
  (products, [min, max]) => products.filter((product) => product.price >= min && product.price <= max)
);
```

### 9. Créer le Hook (`hooks/useProducts.ts`)

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchProductsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
  fetchProductByIdThunk,
} from '../store/productsThunks';
import {
  selectProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError,
  selectProductsFilters,
} from '../store/productsSelectors';
import { setFilters } from '../store/productsSlice';
import type { CreateProductDTO, UpdateProductDTO, ProductFilters } from '../types/product.types';
import type { PaginationParams } from '@/shared/types/api.types';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filters = useAppSelector(selectProductsFilters);

  const fetchProducts = useCallback(
    (params?: PaginationParams & ProductFilters) => {
      return dispatch(fetchProductsThunk(params));
    },
    [dispatch]
  );

  const fetchProductById = useCallback(
    (id: string) => {
      return dispatch(fetchProductByIdThunk(id));
    },
    [dispatch]
  );

  const createProduct = useCallback(
    (data: CreateProductDTO) => {
      return dispatch(createProductThunk(data));
    },
    [dispatch]
  );

  const updateProduct = useCallback(
    (id: string, data: UpdateProductDTO) => {
      return dispatch(updateProductThunk({ id, data }));
    },
    [dispatch]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      return dispatch(deleteProductThunk(id));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: {
      search?: string;
      category?: string | null;
      minPrice?: number | null;
      maxPrice?: number | null;
    }) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  return {
    products,
    currentProduct,
    loading,
    error,
    filters,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
  };
};
```

### 10. Créer un Composant (`components/ProductCard/ProductCard.tsx`)

```typescript
'use client';

import { Product } from '../../types/product.types';
import { ProductService } from '../../services/productService';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const formattedPrice = ProductService.formatPrice(product);
  const isAvailable = ProductService.isAvailable(product);

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
      )}
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-blue-600">{formattedPrice}</span>
        <span className={`px-2 py-1 text-xs rounded ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </span>
      </div>
      <div className="flex gap-2 mt-4">
        <span className="px-2 py-1 text-xs rounded bg-gray-100">{product.category}</span>
        <span className="px-2 py-1 text-xs rounded bg-gray-100">Stock: {product.stock}</span>
      </div>
      <div className="flex gap-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Modifier
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
};
```

Créer aussi `components/ProductCard/index.ts` :

```typescript
export { ProductCard } from './ProductCard';
```

### 11. Créer le fichier index.ts (API publique)

```typescript
/**
 * Barrel export pour le feature Products
 * API publique du feature
 */

// Components
export { ProductCard } from './components/ProductCard';

// Hooks
export { useProducts } from './hooks/useProducts';

// Types
export type { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from './types/product.types';

// API
export { productsApi } from './api/productsApi';

// Services
export { ProductService } from './services/productService';

// Validators
export {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from './validators/product.schema';
```

### 12. Ajouter au rootReducer

Éditez `src/app/store/rootReducer.ts` :

```typescript
import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer } from '@/features/users/store/usersSlice';
import { productsReducer } from '@/features/products/store/productsSlice'; // 👈 Ajouter cette ligne

export const rootReducer = combineReducers({
  users: usersReducer,
  products: productsReducer, // 👈 Ajouter cette ligne
});
```

### 13. Ajouter les endpoints API (optionnel)

Éditez `src/shared/lib/constants/api.constants.ts` :

```typescript
export const API_ENDPOINTS = {
  // ... existants
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },
} as const;
```

### 14. Créer une page Next.js (optionnel)

Créez `app/products/page.tsx` :

```typescript
'use client';

import { useProducts } from '@/features/products';
import { ProductCard } from '@/features/products';
import { useEffect } from 'react';

export default function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Produits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## ✅ Checklist

- [ ] Structure de dossiers créée
- [ ] Types définis (`product.types.ts`)
- [ ] Validators créés (`product.schema.ts`)
- [ ] API client créé (`productsApi.ts`)
- [ ] Service métier créé (`productService.ts`)
- [ ] Redux slice créé (`productsSlice.ts`)
- [ ] Thunks créés (`productsThunks.ts`)
- [ ] Selectors créés (`productsSelectors.ts`)
- [ ] Hook créé (`useProducts.ts`)
- [ ] Composant créé (`ProductCard.tsx`)
- [ ] Index.ts créé avec exports
- [ ] Ajouté au `rootReducer.ts`
- [ ] Testé dans une page Next.js

## 🎯 Résumé

Pour créer une nouvelle feature :

1. **Créer la structure** de dossiers
2. **Définir les types** (types.ts)
3. **Créer les validators** (schema.ts)
4. **Créer l'API client** (api.ts)
5. **Créer le service métier** (service.ts)
6. **Créer Redux** (slice, thunks, selectors)
7. **Créer le hook** (useFeature.ts)
8. **Créer les composants** (components/)
9. **Exporter via index.ts**
10. **Ajouter au rootReducer**

Suivez toujours le même pattern que la feature `users` ! 🚀



