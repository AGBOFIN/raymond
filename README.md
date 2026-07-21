# Rehab Connect

Site web moderne et professionnel pour un cabinet de kinésithérapie avec système de gestion complet (CMS) et suivi des patients. Développé avec Next.js, TypeScript, Tailwind CSS et Framer Motion.

## 🎨 Caractéristiques

- **Design moderne et épuré** avec une charte graphique médicale (bleu, blanc, vert)
- **100% responsive** - s'adapte parfaitement à tous les appareils (mobile, tablette, desktop)
- **Animations fluides** avec Framer Motion
- **CMS complet** - modifier le contenu sans toucher au code
- **Gestion des patients** - CRUD complet avec historique
- **Gestion des séances** - suivi complet avec statuts et paiements
- **Tableau de bord** - KPIs en temps réel (patients, séances, revenus)
- **Galerie d'images** - upload et gestion des images
- **Témoignages** - modération et affichage public
- **Base de données SQLite** pour stocker toutes les données
- **SEO optimisé** avec métadonnées appropriées
- **Accessible** avec des pratiques WCAG

## 🚀 Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Base de données**: SQLite (better-sqlite3)
- **Authentification**: bcryptjs

## 📋 Prérequis

- Node.js 20+ 
- npm ou yarn

## 🛠️ Installation

1. Installer les dépendances:
```bash
npm install
```

2. Lancer le serveur de développement:
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 👨‍💼 Accès à l'administration

L'accès à l'administration se fait uniquement via l'URL directe:
- **URL**: `/admin` (ex: http://localhost:3000/admin)
- **Identifiants par défaut**:
  - Nom d'utilisateur: `admin`
  - Mot de passe: `admin123`

⚠️ **Important**: 
- Le bouton "Admin" n'est PAS visible sur le site public pour des raisons de sécurité
- Changez ces identifiants en production!

## 📝 Modifier le contenu du site

Depuis le tableau de bord d'administration, vous pouvez modifier:

### Onglet Général
- Titre de la page d'accueil
- Sous-titre de la page d'accueil

### Onglet Kinésithérapeute
- Nom complet
- Titre professionnel
- Biographie
- Formation
- Mention
- Établissement

### Onglet Services
- Ajouter, modifier, supprimer des services
- Titre, description, icône de chaque service

### Onglet Contact
- Téléphone
- WhatsApp
- Email
- Adresse
- Liens des réseaux sociaux (Facebook, Instagram, LinkedIn)

Toutes les modifications sont sauvegardées en base de données et visibles immédiatement sur le site public sans rechargement.

## 🖼️ Gestion des images

Depuis l'onglet "Images" du dashboard:
- **Upload**: Cliquez sur "Choisir une image" ou glissez-déposez
- **Formats acceptés**: JPG, PNG, WebP, GIF
- **Taille maximale**: 5MB
- **Catégories**: therapist, gallery, services
- **Suppression**: Cliquez sur l'icône corbeille au survol de l'image

Les images sont stockées dans `public/uploads/` et organisées par catégorie.

## 👥 Gestion des patients

Depuis l'onglet "Patients":
- **Ajouter**: Cliquez sur "Nouveau patient" et remplissez le formulaire
- **Modifier**: Cliquez sur l'icône crayon
- **Supprimer**: Cliquez sur l'icône corbeille
- **Voir les séances**: Cliquez sur l'icône calendrier pour voir les séances d'un patient

**Informations du patient**:
- Prénom, Nom
- Date de naissance
- Téléphone (requis)
- Email
- Adresse
- Contact urgence (nom et téléphone)
- Antécédents médicaux
- Notes

## 📅 Gestion des séances

Depuis l'onglet "Séances":
- **Ajouter**: Cliquez sur "Nouvelle séance" et sélectionnez un patient
- **Modifier**: Cliquez sur l'icône crayon
- **Supprimer**: Cliquez sur l'icône corbeille

**Informations de la séance**:
- Patient
- Date de la séance
- Type de séance (Rééducation, Massage, Post-opératoire, Sportive)
- Statut (Prévue, Réalisée, Annulée)
- Notes
- Prix (FCFA)
- Montant payé (FCFA)
- Statut du paiement (En attente, Payé)
- Date du paiement

Les statistiques se mettent à jour automatiquement lorsque l'état d'une séance est modifié.

## 💰 Gestion financière

Le système de paiement est manuel pour le moment, mais structuré pour faciliter l'intégration future d'une API de paiement:
- Prix saisi manuellement par séance
- Montant payé saisi manuellement
- Statut du paiement (Payé/En attente)
- Date du paiement

**Pour intégrer un système de paiement futur**:
- La structure de la base de données est prête
- Il suffira d'ajouter les endpoints API pour le fournisseur de paiement choisi
- Compatible avec Stripe, PayPal, Orange Money, MTN Mobile Money, etc.

## 📊 Tableau de bord (Dashboard)

Le tableau de bord affiche automatiquement:
- **Patients totaux** - Nombre de patients suivis
- **Séances aujourd'hui** - Séances réalisées aujourd'hui
- **Séances ce mois** - Séances réalisées ce mois-ci
- **Revenus du jour** - Somme des paiements du jour
- **Revenus du mois** - Somme des paiements du mois
- **Patients récents** - 5 derniers patients ajoutés
- **Séances à venir** - Séances prévues dans les 7 prochains jours

## ⭐ Témoignages

Les visiteurs peuvent:
- Voir les témoignages approuvés sur le site public
- Soumettre un témoignage via le formulaire

L'administrateur peut:
- Approuver ou rejeter les témoignages
- Supprimer les témoignages inappropriés
- Voir toutes les soumissions en attente

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── admin/       # Admin endpoints (login, stats)
│   │   │   ├── content/     # Site content CRUD
│   │   │   ├── services/    # Services CRUD
│   │   │   ├── patients/    # Patients CRUD
│   │   │   ├── sessions/    # Sessions CRUD
│   │   │   ├── images/      # Images upload/management
│   │   │   ├── testimonials/# Testimonials management
│   │   │   ├── gallery/     # Gallery management
│   │   │   └── contact/     # Contact form
│   │   ├── admin/           # Admin pages
│   │   │   ├── page.tsx     # Login page
│   │   │   └── dashboard/   # Dashboard
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/           # React components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Gallery.tsx      # Gallery component
│   │   ├── Testimonials.tsx # Testimonials component
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── db.ts            # Database configuration
│   └── middleware.ts        # Route protection
├── public/
│   └── uploads/             # Uploaded images
│       ├── therapist/
│       ├── gallery/
│       └── services/
├── data/                    # SQLite database (auto-created)
└── package.json
```

## 🚀 Déploiement

### Build pour production
```bash
npm run build
npm start
```

### Vercel (recommandé)

1. Push le code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement si nécessaire
4. Déployer

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js (Netlify, Railway, etc.)

**Note pour le déploiement**:
- Le dossier `data/` contenant la base de données SQLite doit être persistant
- Le dossier `public/uploads/` doit être persistant pour les images uploadées
- En production, utilisez une base de données externe (PostgreSQL, MySQL) pour une meilleure scalabilité

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'admin est protégé par authentification avec cookies
- Middleware Next.js pour protéger les routes admin
- Validation des entrées côté serveur
- Sanitization des uploads (type MIME, taille max)
- Protection contre SQL injection (requêtes paramétrées)
- Pas de bouton admin visible publiquement

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.
