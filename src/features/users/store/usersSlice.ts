/**
 * Redux slice pour Users
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user.types';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from './usersThunks';

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    role: string | null;
  };
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    role: null,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => String(u.id) !== action.payload);
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
      action: PayloadAction<{ search?: string; role?: string | null }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearUsers: (state) => {
      state.users = [];
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUsersThunk
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchUserByIdThunk
    builder
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createUserThunk
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      state.users.push(action.payload);
    });

    // updateUserThunk
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    });

    // deleteUserThunk
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => String(u.id) !== action.payload);
    });
  },
});

export const {
  setUsers,
  setCurrentUser,
  addUser,
  updateUser,
  removeUser,
  setLoading,
  setError,
  setFilters,
  clearUsers,
} = usersSlice.actions;

export const usersReducer = usersSlice.reducer;



