/**
 * Root reducer combinant tous les slices
 */

import { combineReducers } from '@reduxjs/toolkit';
// Importez vos slices ici
// import { authReducer } from '@/features/auth/store/authSlice';
import { usersReducer } from '@/features/users/store/usersSlice';

export const rootReducer = combineReducers({
  // auth: authReducer,
  users: usersReducer,
  // Ajoutez vos autres slices ici
});

export type RootState = ReturnType<typeof rootReducer>;

