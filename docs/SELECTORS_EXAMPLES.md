# 💡 Exemples pratiques : Selectors

## 🎯 Exemples concrets d'utilisation

### Exemple 1 : Afficher seulement les users actifs

```typescript
// Dans usersSelectors.ts
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter((user) => user.status === 'active')
);

// Dans votre composant
import { useAppSelector } from '@/app/store/hooks';
import { selectActiveUsers } from '@/features/users/store/usersSelectors';

function ActiveUsersList() {
  const activeUsers = useAppSelector(selectActiveUsers);
  
  return (
    <div>
      <h2>Users actifs ({activeUsers.length})</h2>
      {activeUsers.map(user => (
        <div key={user.id}>{user.firstName} {user.lastName}</div>
      ))}
    </div>
  );
}
```

### Exemple 2 : Filtrer par rôle avec paramètre

```typescript
// Dans usersSelectors.ts
export const selectUsersByRole = createSelector(
  [selectUsers, (state: RootState, role: string) => role],
  (users, role) => users.filter((user) => user.role === role)
);

// Dans votre composant
function AdminPanel() {
  const admins = useAppSelector((state) => 
    selectUsersByRole(state, 'admin')
  );
  
  return (
    <div>
      <h2>Administrateurs ({admins.length})</h2>
      {admins.map(admin => (
        <div key={admin.id}>{admin.email}</div>
      ))}
    </div>
  );
}
```

### Exemple 3 : Trouver un user par ID

```typescript
// Dans usersSelectors.ts
export const selectUserById = createSelector(
  [selectUsers, (state: RootState, id: string) => id],
  (users, id) => users.find((user) => user.id === id)
);

// Dans votre composant
function UserProfile({ userId }: { userId: string }) {
  const user = useAppSelector((state) => 
    selectUserById(state, userId)
  );
  
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Exemple 4 : Selector complexe avec plusieurs calculs

```typescript
// Dans usersSelectors.ts
export const selectUsersStats = createSelector(
  [selectUsers],
  (users) => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      active,
      inactive,
      byRole,
    };
  }
);

// Dans votre composant
function UsersDashboard() {
  const stats = useAppSelector(selectUsersStats);
  
  return (
    <div>
      <h2>Statistiques</h2>
      <p>Total: {stats.total}</p>
      <p>Actifs: {stats.active}</p>
      <p>Inactifs: {stats.inactive}</p>
      <div>
        <h3>Par rôle:</h3>
        {Object.entries(stats.byRole).map(([role, count]) => (
          <p key={role}>{role}: {count}</p>
        ))}
      </div>
    </div>
  );
}
```

### Exemple 5 : Selector avec plusieurs dépendances

```typescript
// Dans usersSelectors.ts
export const selectFilteredUsers = createSelector(
  [selectUsers, selectUsersFilters],
  (users, filters) => {
    let filtered = users;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    return filtered;
  }
);

// Dans votre composant
function UsersList() {
  const filteredUsers = useAppSelector(selectFilteredUsers);
  
  return (
    <div>
      {filteredUsers.map(user => (
        <div key={user.id}>{user.firstName} {user.lastName}</div>
      ))}
    </div>
  );
}
```

## 🔄 Comparaison : Avec vs Sans Selectors

### ❌ Sans Selectors (Problèmes)

```typescript
function UsersList() {
  const users = useSelector((state: RootState) => state.users.users);
  const filters = useSelector((state: RootState) => state.users.filters);
  
  // ❌ Recalculé à chaque render
  const filteredUsers = users.filter(user => {
    if (filters.search) {
      return user.firstName.includes(filters.search);
    }
    return true;
  });
  
  // ❌ Recalculé à chaque render
  const activeUsers = filteredUsers.filter(u => u.status === 'active');
  
  // ❌ Recalculé à chaque render
  const count = activeUsers.length;
  
  return <div>{count} users actifs</div>;
}
```

**Problèmes :**
- Recalculs inutiles à chaque render
- Logique métier dans le composant
- Difficile à tester
- Code dupliqué si utilisé ailleurs

### ✅ Avec Selectors (Solution)

```typescript
// Dans usersSelectors.ts
export const selectFilteredUsers = createSelector(
  [selectUsers, selectUsersFilters],
  (users, filters) => {
    // Logique de filtrage
    let filtered = users;
    if (filters.search) {
      filtered = filtered.filter(/* ... */);
    }
    return filtered;
  }
);

export const selectActiveFilteredUsers = createSelector(
  [selectFilteredUsers],
  (users) => users.filter(u => u.status === 'active')
);

export const selectActiveFilteredUsersCount = createSelector(
  [selectActiveFilteredUsers],
  (users) => users.length
);

// Dans votre composant
function UsersList() {
  const count = useAppSelector(selectActiveFilteredUsersCount);
  
  return <div>{count} users actifs</div>;
}
```

**Avantages :**
- ✅ Mémorisation automatique
- ✅ Logique métier isolée
- ✅ Facile à tester
- ✅ Réutilisable partout

## 🎓 Résumé

Les selectors servent à :

1. **Extraire** les données du store Redux
2. **Transformer** les données (filter, map, reduce, etc.)
3. **Mémoriser** les résultats pour optimiser les performances
4. **Réutiliser** la logique dans plusieurs composants
5. **Tester** facilement la logique métier

---

**Astuce** : Si vous faites un calcul dans un composant, créez un selector ! 🚀



