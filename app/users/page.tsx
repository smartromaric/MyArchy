/**
 * Page : Liste des utilisateurs
 * Route: /users
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useUsers } from '@/features/users';
import { UserCard } from '@/features/users';
import { SearchInput, Pagination } from '@/shared/components/ui';

const ITEMS_PER_PAGE = 9;

export default function UsersPage() {
  const { users, loading, error, fetchUsers, filters, updateFilters } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtrer les users selon la recherche
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters({ search: value });
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Utilisateurs
          </h1>
          <p className="text-gray-600">
            Liste des utilisateurs depuis JSONPlaceholder API
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher par nom, email ou username..."
          />
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Chargement des utilisateurs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredUsers.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
                    {searchQuery && ` trouvé${filteredUsers.length > 1 ? 's' : ''}`}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {paginatedUsers.map((user) => (
                    <Link key={user.id} href={`/users/${user.id}`}>
                      <UserCard user={user} />
                    </Link>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={filteredUsers.length}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? `Aucun utilisateur trouvé pour "${searchQuery}"`
                    : 'Aucun utilisateur trouvé'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Réinitialiser la recherche
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

