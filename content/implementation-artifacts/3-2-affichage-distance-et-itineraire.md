---
title: "Story 3.2 : Affichage Distance & Itinéraire"
description: "Fiche détaillée des pharmacies avec itinéraire et appel téléphonique."
date: 2026-03-21
---

# Story 3.2 : Affichage Distance & Itinéraire

## 🎯 Objectif
Afficher une fiche détaillée pour chaque pharmacie avec possibilité d'appeler et de lancer un itinéraire.

## 🛠️ Implémentation

### `PharmacyDetailSheet`
Bottom sheet modal qui s'ouvre au tap d'une carte de pharmacie dans la liste. Contient :

- **Icône pharmacie** colorée selon le statut de garde (vert = de garde, gris = fermée)
- **Nom** + badge "Ouverte — De garde aujourd'hui"
- **Adresse complète** : rue, quartier, ville
- **Distance** en km (calculée par PostGIS)
- **Téléphone** cliquable → ouvre le composeur
- **Horaires de garde** détaillés
- **Bouton "Appeler"** : lance `tel:` URI
- **Bouton "Itinéraire"** (rempli, couleur corail) : 
  - Tente d'abord `geo:` URI (ouvre Google Maps, Waze, ou l'app de navigation par défaut)
  - Fallback vers Google Maps web si aucune app de navigation installée
