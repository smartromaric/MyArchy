# ⚡ Quick Start

Guide rapide pour démarrer avec le template.

## 🚀 Installation rapide

```bash
# 1. Copier le template
cp -r template/ mon-projet/
cd mon-projet/

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api" > .env.local

# 4. Lancer le serveur
npm run dev
```

## 📝 Première feature

1. **Lire le guide complet** : `docs/CREATE_FEATURE_GUIDE.md` ⭐

2. Créer la structure :
```bash
mkdir -p src/features/products/{api,components,hooks,services,store,types,validators}
```

3. Suivre l'exemple dans `src/features/users/` ou le guide détaillé

4. Ajouter au `rootReducer.ts`

## ✅ Checklist

- [ ] Installer les dépendances
- [ ] Configurer `.env.local`
- [ ] Créer votre première feature
- [ ] Tester avec `npm run dev`

## 📚 Documentation

- `README.md` - Documentation complète
- `TEMPLATE_GUIDE.md` - Guide détaillé
- `docs/` - Documentation architecture

---

**C'est parti ! 🎉**

