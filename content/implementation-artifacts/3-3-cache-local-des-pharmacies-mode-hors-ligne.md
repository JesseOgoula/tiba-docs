---
title: "Story 3.3 : Cache Local des Pharmacies (Mode Hors-ligne)"
description: "Fonctionnement hors-ligne des pharmacies de garde via Drift SQLite."
date: 2026-03-21
---

# Story 3.3 : Cache Local des Pharmacies (Mode Hors-ligne)

## 🎯 Objectif
Permettre à l'utilisateur de consulter les pharmacies de garde **même sans connexion internet**, avec un cache local SQLite (Drift).

## 🛠️ Implémentation

### Table Drift `CachedPharmacy`
Stocke tous les champs nécessaires pour afficher les pharmacies hors-ligne :
- `id`, `name`, `address`, `city`, `district`, `phone`
- `latitude`, `longitude`, `distanceKm`
- `isOnGuard`, `guardStart`, `guardEnd`
- `cachedAt` (horodatage du cache)

### Schéma v2
Migration automatique de v1 → v2 (crée la nouvelle table sans impacter les données existantes).

### Flux Offline-First (`PharmacyProvider`)
1. **Online** : Appelle Supabase RPC → affiche les résultats → **sauvegarde tout dans Drift**
2. **Offline** : Détecte via `connectivity_plus` → **charge directement depuis Drift** en < 0.5s
3. **Erreur réseau** : Fallback automatique vers le cache local

### Indicateurs Visuels
- **Bannière bleue** ☁️ : "Données hors-ligne (mises à jour le [date])"
- **Bannière jaune** ⚠️ : "Données datant de plus de 7 jours. Connectez-vous pour actualiser."
- Les données restent consultables même après 7 jours (avec avertissement)
