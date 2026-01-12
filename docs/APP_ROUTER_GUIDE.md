# 🚀 Guide App Router - Next.js 15

Ce guide explique comment utiliser le **App Router** de Next.js avec cette architecture.

## ✅ Oui, le template utilise le App Router !

Le template utilise bien le **App Router** de Next.js 15 (pas le Pages Router).

## 📁 Structure App Router

```
app/                          # Dossier App Router (Next.js 15)
├── layout.tsx                # Layout racine (Server Component)
├── page.tsx                  # Page d'accueil (route "/")
├── globals.css               # Styles globaux
│
├── (auth)/                   # Route group (n'affecte pas l'URL)
│   ├── login/
│   │   └── page.tsx          # Route "/login"
│   └── register/
│       └── page.tsx          # Route "/register"
│
├── (dashboard)/              # Route group
│   ├── layout.tsx            # Layout pour le dashboard
│   ├── dashboard/
│   │   └── page.tsx          # Route "/dashboard"
│   └── profile/
│       └── page.tsx          # Route "/profile"
│
└── api/                      # API Routes (optionnel)
    └── users/
        └── route.ts         # API route "/api/users"
```

## 🎯 Différences App Router vs Pages Router

### App Router (ce template)
- ✅ Dossier `app/` à la racine
- ✅ `layout.tsx` pour les layouts
- ✅ `page.tsx` pour les pages
- ✅ Server Components par défaut
- ✅ `'use client'` pour les Client Components
- ✅ Metadata API intégrée
- ✅ Streaming et Suspense natifs

### Pages Router (ancien)
- ❌ Dossier `pages/` à la racine
- ❌ `_app.tsx` pour le layout
- ❌ Tous les composants sont clients par défaut

## 📝 Organisation des routes avec cette architecture

### Structure recommandée

```
app/
├── layout.tsx                    # Layout racine
├── page.tsx                      # Page d'accueil "/"
│
├── (auth)/                       # Route group pour l'authentification
│   ├── login/
│   │   └── page.tsx             # "/login"
│   └── register/
│       └── page.tsx             # "/register"
│
├── (dashboard)/                   # Route group pour le dashboard
│   ├── layout.tsx                # Layout du dashboard
│   ├── dashboard/
│   │   └── page.tsx             # "/dashboard"
│   │
│   └── features/                 # Routes par feature
│       ├── users/
│       │   ├── page.tsx        # "/features/users"
│       │   └── [id]/
│       │       └── page.tsx     # "/features/users/[id]"
│       │
│       └── products/
│           └── page.tsx         # "/features/products"
│
└── api/                          # API Routes (optionnel)
    └── users/
        └── route.ts             # "/api/users"
```

## 🔄 Server Components vs Client Components

### Server Components (par défaut)

```typescript
// app/users/page.tsx
// Server Component - pas de 'use client'

import { usersApi } from '@/features/users/api/usersApi';

export default async function UsersPage() {
  // Fetch côté serveur
  const response = await usersApi.getAll();
  const users = response.data;

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Client Components (avec hooks, Redux, etc.)

```typescript
// app/users/page.tsx
'use client';

import { useUsers } from '@/features/users';

export default function UsersPage() {
  const { users, loading, fetchUsers } = useUsers();

  return (
    <div>
      <h1>Users</h1>
      {loading ? <p>Loading...</p> : (
        users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))
      )}
    </div>
  );
}
```

## 🎨 Exemple : Page avec feature

### Option 1 : Server Component (recommandé pour SEO)

```typescript
// app/users/page.tsx
import { usersApi } from '@/features/users/api/usersApi';
import { UserCard } from '@/features/users';

export const metadata = {
  title: 'Users',
  description: 'Liste des utilisateurs',
};

export default async function UsersPage() {
  const response = await usersApi.getAll();
  const users = response.data;

  return (
    <div>
      <h1>Users</h1>
      <div className="grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
```

### Option 2 : Client Component (pour interactivité)

```typescript
// app/users/page.tsx
'use client';

import { useUsers } from '@/features/users';
import { UserCard } from '@/features/users';
import { useEffect } from 'react';

export default function UsersPage() {
  const { users, loading, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Users</h1>
      <div className="grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
```

## 🏗️ Layouts imbriqués

```typescript
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/widgets/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## 📊 Metadata et SEO

```typescript
// app/users/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Liste des utilisateurs',
  openGraph: {
    title: 'Users',
    description: 'Liste des utilisateurs',
  },
};

export default function UsersPage() {
  // ...
}
```

## 🔄 Loading et Error States

```typescript
// app/users/loading.tsx
export default function Loading() {
  return <div>Loading users...</div>;
}

// app/users/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## 🎯 Bonnes pratiques

### 1. Utiliser Server Components quand possible
- Meilleur pour le SEO
- Moins de JavaScript côté client
- Fetch direct depuis le serveur

### 2. Client Components seulement si nécessaire
- Hooks React (useState, useEffect)
- Redux (useAppSelector, useAppDispatch)
- Événements (onClick, onChange)
- Context API

### 3. Organiser par features
```
app/
├── (dashboard)/
│   └── features/
│       ├── users/
│       └── products/
```

### 4. Utiliser les Route Groups
- `(auth)/` - Routes d'authentification
- `(dashboard)/` - Routes du dashboard
- N'affectent pas l'URL finale

## 📚 Ressources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

**Le template est configuré pour le App Router ! 🚀**



