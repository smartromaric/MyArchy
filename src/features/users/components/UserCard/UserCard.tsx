/**
 * Composant UserCard
 * Exemple de composant de présentation
 */

'use client';

import { User } from '../../types/user.types';
import { UserService } from '../../services/userService';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  const fullName = UserService.formatFullName(user);
  const initials = UserService.getInitials(user);

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img src={user.avatar} alt={fullName} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{fullName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.username && (
            <p className="text-xs text-gray-500">@{user.username}</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
              {user.role || 'user'}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${
                (user.status || 'active') === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.status || 'active'}
            </span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(user);
                }}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(String(user.id));
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

