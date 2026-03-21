---
title: "Story 3.4 : Suggestion Automatique Post-Scan/IA"
description: "Suggestion contextuelle de la pharmacie de garde la plus proche après un scan ou une interaction IA."
date: 2026-03-21
---

# Story 3.4 : Suggestion Automatique Post-Scan/IA

## 🎯 Objectif
Après un scan de médicament, suggérer automatiquement la pharmacie de garde la plus proche pour faciliter l'acchat.

## 🛠️ Implémentation

### `PharmacySuggestionCard` (widget réutilisable)
- Lit l'état du `pharmacyProvider` pour trouver la pharmacie de garde la plus proche
- Affiche : icône pharmacie, nom, distance en km
- Mention "(données hors-ligne)" si les données viennent du cache Drift
- Au tap → ouvre la `PharmacyDetailSheet` (Story 3.2)
- Style Design System : fond Sable, bordure Vert Santé, 16px radius

### Intégration
- **MedicalPillSheet** : le card apparaît sous la section "Public visé" après un scan réussi
- Le widget est auto-suffisant (ConsumerWidget) et ne nécessite aucun paramètre

## 📋 Récap Epic 3

| Story | Statut |
|-------|--------|
| 3.1 Pharmacies GPS | ✅ |
| 3.2 Fiche & Itinéraire | ✅ |
| 3.3 Cache Hors-ligne | ✅ |
| 3.4 Suggestion Post-Scan | ✅ |

**Epic 3 : Le Filet de Sécurité Local — TERMINÉ** 🎉
