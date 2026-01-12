/**
 * Barrel export pour le feature Users
 * API publique du feature
 */

// Components
export { UserCard } from './components/UserCard';

// Hooks
export { useUsers } from './hooks/useUsers';

// Types
export type { User, CreateUserDTO, UpdateUserDTO, UserRole, UserFilters } from './types/user.types';

// API
export { usersApi } from './api/usersApi';

// Services
export { UserService } from './services/userService';

// Validators
export {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from './validators/user.schema';

// Store (optionnel, généralement on n'exporte pas le store directement)
// export { usersReducer } from './store/usersSlice';
// export * from './store/usersThunks';
// export * from './store/usersSelectors';

