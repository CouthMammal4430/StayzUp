# StayzUp 🎮

**StayzUp** est un tracker d'habitudes moderne avec un système de gamification complet. Gagnez de l'XP, suivez vos streaks, et développez vos habitudes de manière ludique et motivante.

## 🎯 Fonctionnalités

### Phase 1 - MVP (En développement)
- ✅ Authentification utilisateur avec Supabase
- ✅ Dashboard moderne et intuitif
- ✅ Création et gestion des habitudes
- ✅ Système de gamification (XP, niveaux, streaks)
- ✅ Suivi des complétions
- ✅ PWA pour installation mobile

### Phase 2 - Fonctionnalités avancées (À venir)
- 📊 Statistiques détaillées et graphiques
- 🎨 Personnalisation des habitudes (icônes, couleurs)
- 🔔 Notifications et rappels
- 📱 Applications natives (Android & iOS)
- 💳 Système d'abonnement complet
- 🌍 Multi-langues (FR/EN)

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** (App Router) - Framework React
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **framer-motion** - Animations
- **Zustand** - State management
- **React Hook Form + Zod** - Formulaires et validation
- **date-fns** - Gestion des dates

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions (à venir)

### Déploiement
- **Vercel** - Hébergement et CI/CD

## 📁 Structure du Projet

```
StayzUp/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes d'authentification
│   ├── dashboard/         # Routes du dashboard
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants UI de base (shadcn)
│   └── ...               # Composants métier
├── lib/                   # Bibliothèques et utilitaires
│   ├── supabase/         # Clients Supabase
│   └── utils.ts          # Utilitaires
├── store/                 # Stores Zustand
├── types/                 # Types TypeScript
├── public/                # Fichiers statiques
│   └── manifest.json     # PWA manifest
└── middleware.ts          # Middleware Next.js (auth)
```

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm/yarn/pnpm
- Compte Supabase (gratuit)

### Étapes

1. **Cloner le projet** (si applicable)
   ```bash
   git clone <repository-url>
   cd StayzUp
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Remplir `.env.local` avec vos clés Supabase :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Créer les tables Supabase**
   
   Créez votre projet Supabase et exécutez les migrations SQL (à venir dans `/supabase/migrations`)

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📊 Base de Données

### Tables principales
- `users` (gérée par Supabase Auth)
- `habits` - Habitudes des utilisateurs
- `habit_completions` - Historique des complétions
- `user_stats` - Statistiques et gamification
- `subscriptions` - Gestion des abonnements
- `user_settings` - Paramètres utilisateur

## 🎮 Système de Gamification

### XP et Niveaux
- Chaque habitude complétée donne des **XP**
- Les **niveaux** augmentent en fonction de l'XP total
- Animations et feedback visuels lors des gains d'XP

### Scores
Le système calcule plusieurs scores :
- **Cohérence** : Régularité dans les complétions
- **Persévérance** : Maintenance des streaks
- **Diversification** : Variété des habitudes
- **Progression** : Évolution dans le temps
- **Score global** : Moyenne pondérée

### Streaks
- Suivi des jours consécutifs pour chaque habitude
- Streak le plus long enregistré
- Bonus XP pour les streaks élevés

## 🔐 Authentification

L'authentification est gérée par Supabase Auth avec :
- Inscription par email/mot de passe
- Connexion/déconnexion
- Protection des routes via middleware
- Sessions persistantes

## 📱 PWA

StayzUp est configuré comme une Progressive Web App :
- Manifest.json configuré
- Installable sur mobile
- Mode standalone
- Icônes nécessaires (à ajouter dans `/public`)

## 🔄 Prochaines Étapes

1. ✅ Structure de base du projet
2. ⏳ Schéma de base de données et migrations
3. ⏳ Pages d'authentification (login/signup)
4. ⏳ Dashboard principal
5. ⏳ Gestion des habitudes (CRUD)
6. ⏳ Système de complétion et calcul XP
7. ⏳ Statistiques et graphiques
8. ⏳ Système d'abonnement
9. ⏳ Optimisations et tests

## 📝 Notes de Développement

- Le projet est en cours de développement actif
- La structure est organisée pour faciliter la maintenance
- TypeScript est utilisé pour la robustesse
- Les composants sont réutilisables et modulaires

## 🤝 Contribution

Pour l'instant, le projet est en développement privé.

## 📄 Licence

(À définir)

---

**StayzUp** - Développez vos habitudes avec style ! 🚀

