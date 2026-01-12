/**
 * Page : Détails d'un produit
 * Route: /products/[id]
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/features/products/api/productsApi';
import type { Product } from '@/features/products/types/product.types';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await productsApi.getById(productId);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-500">Chargement des détails...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Retour à la liste
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur :</strong> {error}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Retour à la liste
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Produit non trouvé</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Retour à la liste
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {product.image && (
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-green-600 mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock disponible</span>
                  <span
                    className={`font-semibold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock} unité{product.stock > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span
                    className={`px-3 py-1 text-sm rounded ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
              <button className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

