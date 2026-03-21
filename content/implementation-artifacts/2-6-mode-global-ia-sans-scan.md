---
title: "Story 2.6 : Mode Global IA (Sans Scan)"
description: "Accès à l'assistant IA depuis n'importe quel écran, sans scanner de médicament."
date: 2026-03-21
---

# Story 2.6 : Mode Global IA (Sans Scan)

## 🎯 Objectif
Permettre à l'utilisateur d'accéder à l'assistant IA pharmaceutique **sans avoir scanné de médicament** au préalable. L'IA demande quel médicament l'utilisateur souhaite connaître, puis charge la notice automatiquement.

## 🛠️ Implémentation

### 1. FAB Central (AppShell)
- La `BottomNavigationBar` classique a été remplacée par un `BottomAppBar` avec un `CircularNotchedRectangle`.
- Un `FloatingActionButton` vert (icône robot Tiba) est placé au centre.
- Au tap, il ouvre le `ChatSheet` en **mode global** (sans `medicationId`).

### 2. ChatSheet (Mode Global)
- `medicationId` et `medicationName` sont désormais **optionnels**.
- Si non fournis, `initGlobalMode()` est appelé, affichant : *"Bonjour ! 👋 Quel médicament souhaitez-vous connaître ?"*
- Le sous-titre du header affiche "Mode Global" au lieu du nom du médicament.
- Quand un médicament est résolu, le sous-titre se met à jour dynamiquement via `ref.watch`.

### 3. Recherche de Médicament (AiQueryService)
- Nouvelle méthode `searchMedication(String query)` qui interroge la table `medications` avec un `ilike` pour du matching flou par nom.
- Retourne `{ id, name }` du premier résultat ou `null`.

### 4. Flux dans ChatProvider
- Quand `isGlobalMode == true` et `medicationId == null`, le premier message de l'utilisateur est traité comme une **recherche de médicament**.
- Si trouvé → le contexte est chargé silencieusement et la question est envoyée au RAG.
- Si non trouvé → message d'erreur friendly avec suggestion de scanner.

### 5. Edge Function (v11)
- Accepte `medication_id: null`. Si absent, retourne un message d'orientation plutôt qu'une erreur 400.
