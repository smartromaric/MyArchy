/**
 * Hook pour gérer les users
 * Couche Presentation - Connecte Redux à l'UI
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchUsersThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
  fetchUserByIdThunk,
} from '../store/usersThunks';
import {
  selectUsers,
  selectCurrentUser,
  selectUsersLoading,
  selectUsersError,
  selectUsersFilters,
} from '../store/usersSelectors';
import { setFilters } from '../store/usersSlice';
import type { CreateUserDTO, UpdateUserDTO, UserFilters } from '../types/user.types';
import type { PaginationParams } from '@/shared/types/api.types';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const filters = useAppSelector(selectUsersFilters);

  const fetchUsers = useCallback(
    (params?: PaginationParams & UserFilters) => {
      return dispatch(fetchUsersThunk(params));
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    (id: string) => {
      return dispatch(fetchUserByIdThunk(id));
    },
    [dispatch]
  );

  const createUser = useCallback(
    (data: CreateUserDTO) => {
      return dispatch(createUserThunk(data));
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (id: string, data: UpdateUserDTO) => {
      return dispatch(updateUserThunk({ id, data }));
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    (id: string) => {
      return dispatch(deleteUserThunk(id));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: { search?: string; role?: string | null }) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  return {
    users,
    currentUser,
    loading,
    error,
    filters,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    updateFilters,
  };
};

