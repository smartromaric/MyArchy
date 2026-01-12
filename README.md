# 🏗️ Next.js Architecture Template

Template de projet Next.js avec une architecture moderne combinant **Feature-Sliced Design**, **Layered Architecture**, **Domain-Driven Design** et **Clean Architecture**.

## 📋 Table des matières

- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
- [Utilisation](#utilisation)
- [Créer une nouvelle feature](#créer-une-nouvelle-feature)
- [Documentation](#documentation)

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start
```

## 📁 Structure du projet

```
template/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
│
├── src/
│   ├── app/                # Configuration de l'application
│   │   ├── providers/      # Providers React (Redux, Toast, etc.)
│   │   └── store/          # Configuration Redux
│   │
│   ├── features/           # Features (domaines métier)
│   │   └── users/          # Exemple de feature complète
│   │       ├── api/        # API spécifique
│   │       ├── components/ # Composants spécifiques
│   │       ├── hooks/      # Hooks spécifiques
│   │       ├── services/   # Services métier
│   │       ├── store/      # Redux slice
│   │       ├── types/      # Types spécifiques
│   │       ├── validators/ # Schémas Zod
│   │       └── index.ts    # API publique
│   │
│   ├── shared/             # Code partagé
│   │   ├── api/            # Client API centralisé
│   │   ├── components/     # Composants réutilisables
│   │   ├── hooks/          # Hooks partagés
│   │   ├── lib/            # Utilitaires et configs
│   │   ├── services/       # Services partagés
│   │   └── types/           # Types partagés
│   │
│   └── widgets/             # Widgets complexes (optionnel)
│
├── public/                  # Assets statiques
└── docs/                    # Documentation
```

## 🏛️ Architecture

Cette architecture combine plusieurs patterns :

1. **Feature-Sliced Design (FSD)** - Organisation par domaines métier
2. **Layered Architecture** - Séparation en couches
3. **Domain-Driven Design (DDD)** - Focus sur le domaine métier
4. **Clean Architecture** - Séparation des responsabilités

### Les 4 Couches

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)            │
│   - Pages, Components, Hooks UI     │
├─────────────────────────────────────┤
│   Business Logic Layer               │
│   - Services, Use Cases, Validators │
├─────────────────────────────────────┤
│   Data Access Layer                  │
│   - API Clients, Repositories        │
├─────────────────────────────────────┤
│   Infrastructure Layer               │
│   - HTTP Client, Storage, Utils     │
└─────────────────────────────────────┘
```

## 💻 Utilisation

### Utiliser une feature

```typescript
import { useUsers, UserCard } from '@/features/users';

function MyComponent() {
  const { users, loading, fetchUsers } = useUsers();
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Utiliser l'API client

```typescript
import { apiClient } from '@/shared/api/client';

const response = await apiClient.get<User[]>('/users');
const users = response.data;
```

### Utiliser les services

```typescript
import { notificationService } from '@/shared/services/notificationService';

notificationService.success('Opération réussie !');
notificationService.error('Une erreur est survenue');
```

## 🎯 Créer une nouvelle feature

Pour créer une nouvelle feature, suivez cette structure :

```
src/features/ma-feature/
├── api/
│   └── maFeatureApi.ts      # Client API
├── components/
│   └── MaFeatureCard/       # Composants
├── hooks/
│   └── useMaFeature.ts      # Hooks UI
├── services/
│   └── maFeatureService.ts  # Services métier
├── store/
│   ├── maFeatureSlice.ts    # Redux slice
│   ├── maFeatureThunks.ts   # Actions async
│   └── maFeatureSelectors.ts # Selectors
├── types/
│   └── maFeature.types.ts   # Types
├── validators/
│   └── maFeature.schema.ts  # Schémas Zod
└── index.ts                 # API publique
```

### Exemple complet

Voir le feature `users` dans `src/features/users/` pour un exemple complet.

## 📚 Documentation

- [ARCHITECTURE_README.md](./docs/ARCHITECTURE_README.md) - Vue d'ensemble de l'architecture
- [ARCHITECTURE_CONCEPTS.md](./docs/ARCHITECTURE_CONCEPTS.md) - Concepts détaillés
- [ARCHITECTURE_PROPOSAL.md](./docs/ARCHITECTURE_PROPOSAL.md) - Propositions d'amélioration
- [APP_ROUTER_GUIDE.md](./docs/APP_ROUTER_GUIDE.md) - Guide App Router de Next.js
- [CREATE_FEATURE_GUIDE.md](./docs/CREATE_FEATURE_GUIDE.md) - **Guide pour créer une nouvelle feature** ⭐

## 🛠️ Technologies

- **Next.js 15** - Framework React avec **App Router**
- **TypeScript** - Typage statique
- **Redux Toolkit** - Gestion d'état
- **Zod** - Validation de schémas
- **react-hot-toast** - Notifications
- **Tailwind CSS** - Styling

## 🚀 App Router de Next.js

Ce template utilise le **App Router** de Next.js 15 (pas le Pages Router).

- ✅ Dossier `app/` pour les routes
- ✅ Server Components par défaut
- ✅ Client Components avec `'use client'`
- ✅ Metadata API intégrée

Voir [docs/APP_ROUTER_GUIDE.md](./docs/APP_ROUTER_GUIDE.md) pour plus de détails.

## 📝 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Linter ESLint
- `npm run type-check` - Vérification TypeScript
- `npm run format` - Formatage Prettier

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Path Aliases

Les alias suivants sont configurés dans `tsconfig.json` :

- `@/*` → `./src/*`
- `@/features/*` → `./src/features/*`
- `@/shared/*` → `./src/shared/*`
- `@/app/*` → `./src/app/*`

## 📖 Bonnes pratiques

1. **Séparation des responsabilités** : Chaque couche a un rôle précis
2. **Types explicites** : Éviter `any`, utiliser TypeScript strict
3. **Validation** : Utiliser Zod pour valider les données
4. **Barrel exports** : Exporter via `index.ts` pour une API propre
5. **Tests** : Ajouter des tests unitaires et d'intégration

## 🚀 Prochaines étapes

1. Personnaliser les constantes dans `src/shared/lib/constants/`
2. Configurer votre API dans `src/shared/api/client.ts`
3. Créer vos features dans `src/features/`
4. Ajouter vos composants partagés dans `src/shared/components/`

## 📄 Licence

Ce template est libre d'utilisation pour vos projets.

---

**Bon développement ! 🚀**

# MyArchy
