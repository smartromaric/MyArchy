# 🎯 Explication : Les Selectors Redux

## 📋 Qu'est-ce qu'un Selector ?

Un **selector** est une fonction qui extrait une partie spécifique de l'état Redux. C'est comme une "fenêtre" sur votre store Redux.

## 🎯 Pourquoi utiliser des Selectors ?

### ❌ Sans Selectors (Mauvais)

```typescript
// Dans votre composant
const users = useSelector((state: RootState) => state.users.users);
const loading = useSelector((state: RootState) => state.users.loading);
const error = useSelector((state: RootState) => state.users.error);

// Problèmes :
// 1. Accès direct à la structure interne (couplage fort)
// 2. Pas de mémorisation (recalcul à chaque render)
// 3. Si la structure change, il faut modifier tous les composants
```

### ✅ Avec Selectors (Bon)

```typescript
// Dans votre composant
const users = useAppSelector(selectUsers);
const loading = useAppSelector(selectUsersLoading);
const error = useAppSelector(selectUsersError);

// Avantages :
// 1. Abstraction : le composant ne connaît pas la structure interne
// 2. Mémorisation : ne recalcule que si les données changent
// 3. Réutilisable : même selector partout
// 4. Facile à tester
```

## 🔍 Analyse du fichier `usersSelectors.ts`

### 1. Selectors de base (lignes 11-27)

Ces selectors extraient directement les valeurs du state :

```typescript
// Ligne 11 : Selector de base pour accéder au state users
const selectUsersState = (state: RootState) => state.users;

// Ligne 13 : Sélectionne la liste des users
export const selectUsers = createSelector(
  [selectUsersState],           // Dépendances (inputs)
  (state) => state.users         // Fonction de transformation
);

// Ligne 15-18 : Sélectionne l'utilisateur actuel
export const selectCurrentUser = createSelector(
  [selectUsersState],
  (state) => state.currentUser
);

// Ligne 20-23 : Sélectionne l'état de chargement
export const selectUsersLoading = createSelector(
  [selectUsersState],
  (state) => state.loading
);
```

**Exemple d'utilisation :**
```typescript
// Dans un composant
const { users, loading } = useUsers();
// users vient de selectUsers
// loading vient de selectUsersLoading
```

### 2. Selectors dérivés (lignes 29-42)

Ces selectors **transforment** les données de base :

#### `selectActiveUsers` (lignes 30-32)

```typescript
export const selectActiveUsers = createSelector(
  [selectUsers],                    // Dépend de selectUsers
  (users) => users.filter(          // Filtre les users actifs
    (user) => user.status === 'active'
  )
);
```

**Pourquoi c'est important ?**
- ✅ **Mémorisation** : Si `users` ne change pas, le résultat est mis en cache
- ✅ **Performance** : Pas de recalcul inutile à chaque render
- ✅ **Réutilisable** : Utilisable dans plusieurs composants

**Exemple d'utilisation :**
```typescript
// Dans un composant
const activeUsers = useAppSelector(selectActiveUsers);

// Affiche seulement les users avec status === 'active'
// Si users ne change pas, activeUsers est mis en cache
```

#### `selectUsersByRole` (lignes 34-37)

```typescript
export const selectUsersByRole = createSelector(
  [selectUsers, (state: RootState, role: string) => role],
  //      ↑                              ↑
  //   Input 1                      Input 2 (paramètre)
  (users, role) => users.filter((user) => user.role === role)
);
```

**Ce selector accepte un paramètre !**

**Exemple d'utilisation :**
```typescript
// Dans un composant
const admins = useAppSelector((state) => 
  selectUsersByRole(state, 'admin')
);

// Ou avec un hook personnalisé
const useUsersByRole = (role: string) => {
  return useAppSelector((state) => selectUsersByRole(state, role));
};

// Utilisation
const admins = useUsersByRole('admin');
const doctors = useUsersByRole('doctor');
```

#### `selectUserById` (lignes 39-42)

```typescript
export const selectUserById = createSelector(
  [selectUsers, (state: RootState, id: string) => id],
  (users, id) => users.find((user) => user.id === id)
);
```

**Exemple d'utilisation :**
```typescript
// Dans un composant
const userId = '123';
const user = useAppSelector((state) => 
  selectUserById(state, userId)
);
```

## 🔄 Flux de données avec Selectors

```
┌─────────────────────────────────────────┐
│   Redux Store                          │
│   {                                    │
│     users: {                           │
│       users: [...],                    │
│       loading: false,                  │
│       error: null                      │
│     }                                  │
│   }                                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Selectors (usersSelectors.ts)        │
│   - selectUsers                        │
│   - selectUsersLoading                │
│   - selectActiveUsers                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Hook (useUsers.ts)                   │
│   const users = useAppSelector(...)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Composant React                      │
│   const { users } = useUsers();        │
└─────────────────────────────────────────┘
```

## 💡 Avantages de la mémorisation

### Sans mémorisation (problème)

```typescript
// Dans un composant
const activeUsers = users.filter(u => u.status === 'active');

// Problème : Ce filtre est recalculé à CHAQUE render
// Même si users n'a pas changé !
```

### Avec createSelector (solution)

```typescript
// Dans usersSelectors.ts
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(u => u.status === 'active')
);

// Dans le composant
const activeUsers = useAppSelector(selectActiveUsers);

// ✅ Le filtre n'est recalculé QUE si users change
// ✅ Si users est identique, retourne le résultat en cache
```

## 📊 Exemple concret : Performance

### Scénario : 1000 users, composant qui se re-render souvent

**Sans selector mémorisé :**
```typescript
// Recalculé 100 fois (à chaque render)
const activeUsers = users.filter(u => u.status === 'active');
// Temps : 100 × 5ms = 500ms
```

**Avec selector mémorisé :**
```typescript
// Calculé 1 fois, puis mis en cache
const activeUsers = useAppSelector(selectActiveUsers);
// Temps : 1 × 5ms = 5ms (100x plus rapide !)
```

## 🎯 Bonnes pratiques

### 1. Toujours utiliser createSelector pour les calculs

```typescript
// ✅ Bon
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(u => u.status === 'active')
);

// ❌ Mauvais (pas de mémorisation)
export const selectActiveUsers = (state: RootState) => 
  state.users.users.filter(u => u.status === 'active');
```

### 2. Créer des selectors réutilisables

```typescript
// ✅ Bon : Réutilisable partout
export const selectUsers = createSelector(...);

// ❌ Mauvais : Dupliqué dans chaque composant
const users = useSelector(state => state.users.users);
```

### 3. Selectors avec paramètres

```typescript
// ✅ Bon : Paramètre explicite
export const selectUserById = createSelector(
  [selectUsers, (state, id) => id],
  (users, id) => users.find(u => u.id === id)
);

// Utilisation
const user = useAppSelector(state => selectUserById(state, '123'));
```

## 🔧 Comment utiliser dans vos composants

### Option 1 : Via le hook useUsers (recommandé)

```typescript
import { useUsers } from '@/features/users';

function MyComponent() {
  const { users, loading, error } = useUsers();
  // users vient de selectUsers
  // loading vient de selectUsersLoading
  // error vient de selectUsersError
}
```

### Option 2 : Directement avec useAppSelector

```typescript
import { useAppSelector } from '@/app/store/hooks';
import { selectActiveUsers, selectUsersByRole } from '@/features/users/store/usersSelectors';

function MyComponent() {
  const activeUsers = useAppSelector(selectActiveUsers);
  const admins = useAppSelector(state => selectUsersByRole(state, 'admin'));
}
```

## 📝 Résumé

| Concept | Description |
|---------|-------------|
| **Selector** | Fonction qui extrait une partie du state Redux |
| **createSelector** | Crée un selector mémorisé (cache le résultat) |
| **Selector de base** | Extrait directement une valeur (ex: `selectUsers`) |
| **Selector dérivé** | Transforme les données (ex: `selectActiveUsers`) |
| **Mémorisation** | Ne recalcule que si les dépendances changent |

## ✅ Checklist

- [x] Selectors de base pour chaque propriété du state
- [x] Selectors dérivés pour les calculs (filter, map, etc.)
- [x] Utilisation de `createSelector` pour la mémorisation
- [x] Selectors réutilisables (pas de duplication)
- [x] Types TypeScript corrects

---

**En résumé** : Les selectors sont des fonctions qui extraient et transforment les données du store Redux de manière optimisée et réutilisable ! 🚀

