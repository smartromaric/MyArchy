/**
 * Redux thunks pour Users
 * Gère les actions asynchrones
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../api/usersApi';
import { notificationService } from '@/shared/services/notificationService';
import type { CreateUserDTO, UpdateUserDTO, UserFilters } from '../types/user.types';
import type { PaginationParams } from '@/shared/types/api.types';

/**
 * Récupère tous les users
 */
export const fetchUsersThunk = createAsyncThunk(
  'users/fetchAll',
  async (params: (PaginationParams & UserFilters) | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await usersApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Récupère un user par ID
 */
export const fetchUserByIdThunk = createAsyncThunk(
  'users/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await usersApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Crée un nouveau user
 */
export const createUserThunk = createAsyncThunk(
  'users/create',
  async (data: CreateUserDTO, { rejectWithValue }) => {
    try {
      const response = await usersApi.create(data);
      notificationService.success('Utilisateur créé avec succès');
      return response.data;
    } catch (error) {
      notificationService.error('Erreur lors de la création de l\'utilisateur');
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Met à jour un user
 */
export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: UpdateUserDTO }, { rejectWithValue }) => {
    try {
      const response = await usersApi.update(id, data);
      notificationService.success('Utilisateur mis à jour avec succès');
      return response.data;
    } catch (error) {
      notificationService.error('Erreur lors de la mise à jour de l\'utilisateur');
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Supprime un user
 */
export const deleteUserThunk = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await usersApi.delete(id);
      notificationService.success('Utilisateur supprimé avec succès');
      return id;
    } catch (error) {
      notificationService.error('Erreur lors de la suppression de l\'utilisateur');
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Récupère le profil de l'utilisateur connecté
 */
export const fetchProfileThunk = createAsyncThunk(
  'users/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

