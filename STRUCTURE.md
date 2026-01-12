# 📁 Structure complète du Template

```
template/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Layout principal avec providers
│   ├── page.tsx                      # Page d'accueil (exemple)
│   └── globals.css                   # Styles globaux Tailwind
│
├── src/
│   ├── app/                          # Configuration de l'application
│   │   ├── providers/
│   │   │   ├── ReduxProvider.tsx     # Provider Redux avec persistance
│   │   │   └── ToastProvider.tsx     # Provider pour react-hot-toast
│   │   └── store/
│   │       ├── store.ts              # Configuration Redux store
│   │       ├── rootReducer.ts        # Root reducer combinant tous les slices
│   │       └── hooks.ts              # Hooks Redux typés (useAppDispatch, useAppSelector)
│   │
│   ├── features/                     # Features (domaines métier)
│   │   └── users/                    # Exemple de feature complète
│   │       ├── api/
│   │       │   └── usersApi.ts       # Client API pour users
│   │       ├── components/
│   │       │   └── UserCard/
│   │       │       ├── UserCard.tsx  # Composant de présentation
│   │       │       └── index.ts      # Export
│   │       ├── hooks/
│   │       │   └── useUsers.ts       # Hook UI connecté à Redux
│   │       ├── services/
│   │       │   └── userService.ts    # Services métier (logique pure)
│   │       ├── store/
│   │       │   ├── usersSlice.ts    # Redux slice
│   │       │   ├── usersThunks.ts   # Actions async (thunks)
│   │       │   └── usersSelectors.ts # Selectors memoized
│   │       ├── types/
│   │       │   └── user.types.ts     # Types TypeScript
│   │       ├── validators/
│   │       │   └── user.schema.ts    # Schémas Zod de validation
│   │       └── index.ts              # API publique du feature
│   │
│   ├── shared/                       # Code partagé
│   │   ├── api/
│   │   │   ├── client.ts             # Client API centralisé
│   │   │   ├── interceptors.ts       # Intercepteurs pour requêtes/réponses
│   │   │   └── index.ts               # Barrel export
│   │   │
│   │   ├── components/               # Composants réutilisables
│   │   │   └── ui/
│   │   │       ├── Button/
│   │   │       │   ├── Button.tsx    # Composant Button
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/                    # Hooks partagés
│   │   │   ├── useDebounce.ts        # Hook pour debouncer
│   │   │   ├── useLocalStorage.ts    # Hook pour localStorage
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                      # Bibliothèques et configurations
│   │   │   ├── constants/
│   │   │   │   ├── api.constants.ts  # Constantes endpoints API
│   │   │   │   ├── routes.constants.ts # Constantes routes
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── date.utils.ts     # Utilitaires dates
│   │   │       ├── validation.utils.ts # Utilitaires validation
│   │   │       └── index.ts
│   │   │
│   │   ├── services/                 # Services partagés
│   │   │   ├── errorHandler.ts       # Gestion d'erreurs (classes d'erreur)
│   │   │   ├── notificationService.ts # Service de notifications
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                    # Types partagés
│   │   │   ├── api.types.ts          # Types API (ApiResponse, Pagination, etc.)
│   │   │   ├── common.types.ts       # Types communs (BaseEntity, Status, etc.)
│   │   │   └── index.ts
│   │   │
│   │   └── validators/               # Validateurs partagés
│   │       ├── common.schema.ts      # Schémas Zod communs
│   │       └── index.ts
│   │
│   └── widgets/                      # Widgets complexes (optionnel)
│       └── (vide pour l'instant)
│
├── docs/                             # Documentation
│   ├── ARCHITECTURE_README.md         # Vue d'ensemble architecture
│   ├── ARCHITECTURE_CONCEPTS.md       # Concepts détaillés
│   └── ARCHITECTURE_PROPOSAL.md       # Propositions d'amélioration
│
├── public/                           # Assets statiques
│
├── .eslintrc.json                    # Configuration ESLint
├── .gitignore                        # Fichiers ignorés par Git
├── .npmrc                            # Configuration npm
├── .prettierrc                       # Configuration Prettier
├── next.config.js                    # Configuration Next.js
├── package.json                      # Dépendances et scripts
├── postcss.config.js                 # Configuration PostCSS
├── tailwind.config.js                # Configuration Tailwind CSS
├── tsconfig.json                     # Configuration TypeScript
│
├── README.md                         # Documentation principale
├── QUICK_START.md                    # Guide de démarrage rapide
├── TEMPLATE_GUIDE.md                 # Guide d'utilisation du template
└── STRUCTURE.md                      # Ce fichier
```

## 🎯 Organisation par couches

### Presentation Layer (UI)
- `features/*/components/` - Composants React
- `features/*/hooks/` - Hooks UI
- `app/` - Pages Next.js

### Business Logic Layer
- `features/*/services/` - Services métier
- `features/*/validators/` - Validation Zod

### Data Access Layer
- `features/*/api/` - Clients API spécifiques
- `shared/api/` - Client API centralisé

### Infrastructure Layer
- `shared/services/` - Services partagés (errorHandler, notificationService)
- `shared/lib/utils/` - Utilitaires généraux
- `shared/lib/constants/` - Constantes

## 📦 Features

Chaque feature suit cette structure :

```
feature-name/
├── api/              # Data Access Layer
├── components/       # Presentation Layer
├── hooks/            # Presentation Layer
├── services/         # Business Logic Layer
├── store/            # State Management (Redux)
├── types/            # Types TypeScript
├── validators/       # Validation Zod
└── index.ts          # API publique
```

## 🔄 Flux de données

```
Component (UI)
    ↓
Hook (useFeature)
    ↓
Thunk (async action)
    ↓
API Client (apiClient)
    ↓
Backend API
    ↓
Response
    ↓
Redux Store (via slice)
    ↓
Selector (memoized)
    ↓
Component (re-render)
```

## 📝 Exemple d'utilisation

Voir `src/features/users/` pour un exemple complet de feature avec toutes les couches.



