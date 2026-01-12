# 🏗️ Architecture du Projet - Template

Ce document présente l'architecture du template et comment l'utiliser.

## 📚 Documentation disponible

- **[ARCHITECTURE_CONCEPTS.md](./ARCHITECTURE_CONCEPTS.md)** - Concepts détaillés
- **[ARCHITECTURE_PROPOSAL.md](./ARCHITECTURE_PROPOSAL.md)** - Propositions d'amélioration

## 🎯 Principes de l'architecture

1. **Feature-Sliced Design** - Organisation par domaines métier
2. **Layered Architecture** - Séparation en couches
3. **Domain-Driven Design** - Focus sur le domaine métier
4. **Clean Architecture** - Séparation des responsabilités

## 📁 Structure des features

Chaque feature suit cette structure :

```
feature-name/
├── api/              # Data Access Layer
├── components/       # Presentation Layer
├── hooks/            # Presentation Layer
├── services/         # Business Logic Layer
├── store/            # State Management
├── types/            # Types TypeScript
├── validators/       # Validation Zod
└── index.ts          # API publique
```

## 🔄 Flux de données

```
Component → Hook → Thunk → API → Backend
    ↓         ↓       ↓
  Redux ← Selector ← Slice
```

## 📝 Exemple d'utilisation

Voir le feature `users` dans `src/features/users/` pour un exemple complet.



