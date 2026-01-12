/**
 * Page : Détails d'un utilisateur
 * Route: /users/[id]
 */

'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUsers } from '@/features/users';
import { UserService } from '@/features/users';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { currentUser, loading, error, fetchUserById } = useUsers();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            href="/users"
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

  if (!currentUser) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/users"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Retour à la liste
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Utilisateur non trouvé</p>
          </div>
        </div>
      </main>
    );
  }

  const fullName = UserService.formatFullName(currentUser);
  const initials = UserService.getInitials(currentUser);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/users"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Retour à la liste
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start gap-6 mb-6">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={fullName}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
                {initials}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {fullName}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{currentUser.email}</p>
              {currentUser.username && (
                <p className="text-sm text-gray-500">@{currentUser.username}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Informations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              {currentUser.phone && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                  <p className="font-medium">{currentUser.phone}</p>
                </div>
              )}
              {currentUser.website && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Site web</p>
                  <a
                    href={`https://${currentUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {currentUser.website}
                  </a>
                </div>
              )}
              {currentUser.address && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Adresse</p>
                  <p className="font-medium">
                    {currentUser.address.street}, {currentUser.address.city}{' '}
                    {currentUser.address.zipcode}
                  </p>
                </div>
              )}
              {currentUser.company && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Entreprise</p>
                  <p className="font-medium">{currentUser.company.name}</p>
                  <p className="text-sm text-gray-600">
                    {currentUser.company.catchPhrase}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

