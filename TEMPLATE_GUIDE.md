# 📘 Guide d'utilisation du Template

Ce guide vous explique comment utiliser ce template pour initialiser vos nouveaux projets.

## 🚀 Initialisation d'un nouveau projet

### Option 1 : Copier le template

```bash
# Copier le dossier template dans votre nouveau projet
cp -r template/ mon-nouveau-projet/
cd mon-nouveau-projet/

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Option 2 : Utiliser comme template Git

```bash
# Cloner le template
git clone <url-du-template> mon-nouveau-projet
cd mon-nouveau-projet/

# Supprimer le .git existant
rm -rf .git

# Initialiser un nouveau repo
git init
git add .
git commit -m "Initial commit from template"

# Installer les dépendances
npm install
```

## 🔧 Configuration initiale

### 1. Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 2. Configuration Redux

Éditez `src/app/store/rootReducer.ts` pour ajouter vos slices :

```typescript
import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer } from '@/features/users/store/usersSlice';
// Ajoutez vos autres slices

export const rootReducer = combineReducers({
  users: usersReducer,
  // Ajoutez vos autres reducers
});
```

### 3. Configuration API

Éditez `src/shared/lib/constants/api.constants.ts` pour ajouter vos endpoints :

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
  },
  // Ajoutez vos endpoints
} as const;
```

### 4. Personnaliser le layout

Éditez `app/layout.tsx` pour personnaliser le layout de votre application.

## 📦 Créer une nouvelle feature

### Étape 1 : Créer la structure

```bash
mkdir -p src/features/ma-feature/{api,components,hooks,services,store,types,validators}
```

### Étape 2 : Créer les fichiers de base

1. **Types** (`types/maFeature.types.ts`)
```typescript
export interface MaFeature {
  id: string;
  name: string;
}
```

2. **Validators** (`validators/maFeature.schema.ts`)
```typescript
import { z } from 'zod';

export const createMaFeatureSchema = z.object({
  name: z.string().min(2),
});
```

3. **API** (`api/maFeatureApi.ts`)
```typescript
import { apiClient } from '@/shared/api/client';

export const maFeatureApi = {
  getAll: () => apiClient.get('/ma-feature'),
  getById: (id: string) => apiClient.get(`/ma-feature/${id}`),
};
```

4. **Service** (`services/maFeatureService.ts`)
```typescript
export class MaFeatureService {
  static formatName(feature: MaFeature): string {
    return feature.name.toUpperCase();
  }
}
```

5. **Redux Slice** (`store/maFeatureSlice.ts`)
```typescript
import { createSlice } from '@reduxjs/toolkit';

const maFeatureSlice = createSlice({
  name: 'maFeature',
  initialState: { items: [] },
  reducers: {},
});

export const { maFeatureReducer } = maFeatureSlice;
```

6. **Thunks** (`store/maFeatureThunks.ts`)
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { maFeatureApi } from '../api/maFeatureApi';

export const fetchMaFeatureThunk = createAsyncThunk(
  'maFeature/fetchAll',
  async () => {
    const response = await maFeatureApi.getAll();
    return response.data;
  }
);
```

7. **Selectors** (`store/maFeatureSelectors.ts`)
```typescript
import { createSelector } from '@reduxjs/toolkit';

export const selectMaFeature = (state: RootState) => state.maFeature.items;
```

8. **Hook** (`hooks/useMaFeature.ts`)
```typescript
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

export const useMaFeature = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectMaFeature);
  
  return { items };
};
```

9. **Component** (`components/MaFeatureCard/MaFeatureCard.tsx`)
```typescript
export const MaFeatureCard = ({ feature }) => {
  return <div>{feature.name}</div>;
};
```

10. **Index** (`index.ts`)
```typescript
export { useMaFeature } from './hooks/useMaFeature';
export { MaFeatureCard } from './components/MaFeatureCard';
export type { MaFeature } from './types/maFeature.types';
```

### Étape 3 : Ajouter au rootReducer

```typescript
import { maFeatureReducer } from '@/features/ma-feature/store/maFeatureSlice';

export const rootReducer = combineReducers({
  // ...
  maFeature: maFeatureReducer,
});
```

## 🎨 Personnalisation

### Styles

- Modifiez `app/globals.css` pour vos styles globaux
- Utilisez Tailwind CSS pour le styling (déjà configuré)

### Composants UI

Ajoutez vos composants réutilisables dans `src/shared/components/ui/`

### Hooks partagés

Ajoutez vos hooks réutilisables dans `src/shared/hooks/`

## 📝 Checklist de démarrage

- [ ] Copier le template
- [ ] Installer les dépendances (`npm install`)
- [ ] Configurer les variables d'environnement (`.env.local`)
- [ ] Personnaliser `package.json` (nom, description)
- [ ] Configurer Redux (`rootReducer.ts`)
- [ ] Configurer les endpoints API (`api.constants.ts`)
- [ ] Personnaliser le layout (`app/layout.tsx`)
- [ ] Créer votre première feature
- [ ] Tester que tout fonctionne (`npm run dev`)

## 🐛 Résolution de problèmes

### Erreur de path alias

Vérifiez que `tsconfig.json` contient bien les paths configurés.

### Erreur Redux

Vérifiez que votre slice est bien ajouté dans `rootReducer.ts`.

### Erreur API

Vérifiez que `NEXT_PUBLIC_API_BASE_URL` est bien défini dans `.env.local`.

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zod](https://zod.dev/)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

**Bon développement ! 🚀**



