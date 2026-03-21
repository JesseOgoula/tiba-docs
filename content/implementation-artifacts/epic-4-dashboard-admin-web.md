---
title: "Epic 4 : Dashboard Admin Web"
description: "Portail Next.js d'administration pour la gestion des pharmacies, notices et signalements."
date: 2026-03-21
---

# Epic 4 : La Tour de Contrôle Opérationnelle

## 🎯 Objectif
Portail web Next.js connecté à Supabase permettant aux opérateurs Tiba de gérer les pharmacies, notices médicamenteuses et signalements utilisateurs.

## 🛠️ Stack technique
- **Next.js 16** (App Router, TailwindCSS 4, TypeScript)
- **Supabase SSR** (`@supabase/ssr`) avec cookies HTTP-only
- **Middleware** de session + redirection auth automatique
- Repo dédié : `JesseOgoula/tiba-admin`

## 📋 Stories implémentées

### Story 4.1 : Scaffold & Authentification ✅
- Page login avec branding Tiba (gradient, logo cœur, formulaire)
- Middleware Next.js : redirect `/login` si non authentifié
- Supabase Auth email/mot de passe
- Layout admin avec sidebar (Dashboard, Pharmacies, Notices, Signalements)
- Dashboard home avec compteurs (pharmacies, notices, signalements)

### Story 4.2 : Notices (CRUD complet) ✅
- Table interactive avec recherche par nom/code-barres
- Colonnes : nom, catégorie thérapeutique, code-barres, version, statut
- Modal ajout/modification complète :
  - Nom du médicament (obligatoire)
  - Code-barres (optionnel)
  - Catégorie thérapeutique
  - Texte complet de la notice (textarea)
  - Source officielle (obligatoire)
- Soft delete (Retirer/Réactiver) sans suppression physique
- Versionnage : incrémentation automatique à chaque modification

### Story 4.3 : Signalements avec workflow ✅
- Table des signalements depuis `user_report` avec jointures `ai_audit_log` → `medication`
- Filtre par statut (En attente / Examiné / Résolu)
- Labels colorés par raison (Incorrect / Dangereux / Autre)
- Workflow de traitement : En attente → Examiné → Résolu
- Boutons d'action contextuels selon le statut

### Story 4.4 : Pharmacies de Garde ✅
- Table complète avec recherche par nom et filtre par ville
- Modal ajout/modification (nom, adresse, ville, quartier, téléphone, coordonnées GPS)
- Toggle Active/Inactif
- Modal planning de garde : ajout/suppression de dates avec plages horaires
- Statut visuel (badge Actif vert / Inactif rouge)

## 🗂️ Structure du projet
```
src/
├── app/
│   ├── globals.css          # Design tokens Tiba
│   ├── layout.tsx           # Root layout (Google Fonts)
│   ├── login/page.tsx       # Page de connexion
│   └── (dashboard)/
│       ├── layout.tsx       # Vérifie auth + sidebar
│       ├── page.tsx         # Dashboard (stats)
│       ├── pharmacies/      # CRUD pharmacies + gardes
│       ├── notices/         # CRUD notices complet
│       └── signalements/    # Workflow signalements
├── components/sidebar.tsx
├── lib/supabase/
│   ├── server.ts            # Client SSR
│   ├── client.ts            # Client browser
│   └── middleware.ts        # Session + redirects
└── middleware.ts             # Point d'entrée middleware
```
