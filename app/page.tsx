/**
 * Page d'accueil
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Next.js Architecture Template
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Template avec Feature-Sliced Design + Layered Architecture
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/users"
                className="block p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  👥 Utilisateurs
                </h3>
                <p className="text-gray-600">
                  Liste des utilisateurs depuis JSONPlaceholder API
                </p>
              </Link>

              <Link
                href="/products"
                className="block p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  🛍️ Produits
                </h3>
                <p className="text-gray-600">
                  Liste des produits depuis Fake Store API
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-800">
              <strong>📡 APIs publiques utilisées :</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• JSONPlaceholder : https://jsonplaceholder.typicode.com</li>
              <li>• Fake Store API : https://fakestoreapi.com</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
