---
title: "Story 3.1 : Recherche des Pharmacies de Garde par GPS"
description: "Localisation GPS et recherche PostGIS des pharmacies de garde à proximité."
date: 2026-03-21
---

# Story 3.1 : Recherche des Pharmacies de Garde par GPS

## 🎯 Objectif
Permettre à l'utilisateur de trouver les pharmacies de garde ouvertes à proximité de sa position GPS.

## 🛠️ Implémentation

### Backend Supabase
- **PostGIS** 3.3.7 déjà installé. La colonne `location` de la table `pharmacy` est de type `geography`.
- **RPC `find_nearby_pharmacies`** : Fonction SQL qui prend les coordonnées GPS, un rayon (défaut 10 km), et retourne les pharmacies triées par distance croissante, avec jointure sur `pharmacy_schedule` pour savoir si elles sont de garde aujourd'hui.
- **7 pharmacies de test** seedées à Libreville (Gabon), dont 3 sont configurées "de garde" pour la date du jour.

### Flutter
- **`geolocator`** : Permission GPS, récupération de la position actuelle.
- **`url_launcher`** : Ouverture de Google Maps pour l'itinéraire et du composeur téléphonique.
- **`PharmacyService`** : Appelle la RPC `find_nearby_pharmacies` et retourne une liste de `PharmacyResult`.
- **`PharmacyProvider`** : Gère les états (loading, loaded, noPermission, error, empty), la permission GPS, et l'extension de rayon à 25 km.
- **`SecoursPage`** : Écran complet avec :
  - Header avec compteur de rayon et bouton refresh
  - Skeleton loader pendant le chargement
  - Gestion de l'état "localisation refusée" avec bouton vers les paramètres
  - Liste de cartes de pharmacies avec badge "De garde" vert, distance, horaires
  - Bouton téléphone (clickable) + bouton itinéraire (Google Maps)
  - État vide avec option "Élargir à 25 km"
