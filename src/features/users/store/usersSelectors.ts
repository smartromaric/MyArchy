/**
 * Redux selectors pour Users
 * Selectors memoized pour optimiser les performances
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';

// Selectors de base
const selectUsersState = (state: RootState) => state.users;

export const selectUsers = createSelector([selectUsersState], (state) => state.users);

export const selectCurrentUser = createSelector(
  [selectUsersState],
  (state) => state.currentUser
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (state) => state.loading
);

export const selectUsersError = createSelector([selectUsersState], (state) => state.error);

export const selectUsersFilters = createSelector([selectUsersState], (state) => state.filters);

// Selectors dérivés
export const selectActiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.status === 'active')
);

export const selectUsersByRole = createSelector(
  [selectUsers, (state: RootState, role: string) => role],
  (users, role) => users.filter((user) => user.role === role)
);

export const selectUserById = createSelector(
  [selectUsers, (state: RootState, id: string) => id],
  (users, id) => users.find((user) => user.id === id)
);

