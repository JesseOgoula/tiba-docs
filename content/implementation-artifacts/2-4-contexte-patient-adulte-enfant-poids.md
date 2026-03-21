---
title: "Story 2.4 : Contexte Patient (Adulte/Enfant/Poids)"
description: "Implémentation de la personnalisation des réponses de l'IA selon le profil du patient (Adulte/Enfant, avec âge et poids optionnels)."
author: Tiba Engineering
date: 2026-03-21
priority: high
tags:
  - "ai"
  - "context"
  - "ui"
  - "chat"
---

# Implémentation du Contexte Patient (Story 2.4)

## Objectifs
- Permettre à l'utilisateur de préciser le profil du patient (Adulte/Enfant, âge, poids) pour la consultation d'une notice via l'IA.
- Personnaliser les requêtes RAG et les réponses du LLM en injectant ces données démographiques.
- Fournir un indicateur visuel clair du profil utilisé pendant la session de chat.

## Composants Développés

### 1. Modèle et État
- **`PatientContext`** : Modèle existant réutilisé, incluant `type` ('adulte' ou 'enfant'), `age` (entier, optionnel) et `weight` (décimal, optionnel).
- **`ChatState` et `ChatProvider`** : Mise à jour de l'état du chat pour conserver le profil choisi via `setPatientContext(PatientContext? context)`.
- **`AiQueryService`** : Transmission du `patientContext` à la Edge Function `ai-query` lors de l'appel à l'API.

### 2. Composants UI
- **`PatientContextDialog`** : 
  - Une *Bottom Sheet* modale permettant à l'utilisateur de choisir "Adulte" ou "Enfant".
  - Deux champs optionnels "Âge (ans)" et "Poids (kg)".
  - Bouton de validation pour enregistrer le profil dans le `ChatState`.
- **`ChatSheet` Header** :
  - Ajout d'une "puce" (chip) cliquable à côté du titre "Tiba IA".
  - La puce change de couleur (`greenBg` et `green`) lorsqu'un profil est défini.
  - Affiche "Adulte" ou "Enfant" selon le type sélectionné, ou "Profil" par défaut.
  - Un clic sur la puce ouvre le `PatientContextDialog`.

## Logique IA (Edge Function)
La fonction serveur `ai-query` (déployée précédemment) gère déjà l'inclusion du profil patient dans le prompt du LLM `gpt-4o-mini`. 
Exemple d'injection dans le prompt système RAG :
> "CONTEXTE PATIENT : enfant, âge: 8 ans, poids: 25 kg"

Le modèle ajuste automatiquement ses explications en utilisant ces variables, notamment pour le calcul mental ou l'isolement des sections "Mises en garde" destinées aux enfants dans la notice du médicament.

## Prochaines Étapes Prévues (Epic 2)
1. **Story 2.5** : Pare-feu Anti-Diagnostic & Messages de Sécurité
2. **Story 2.6** : Mode Global IA (Sans Scan)
3. **Story 2.7** : Audit Logging (déjà partiellement en place dans la DB)
4. **Story 2.8** : Voix Naturelle IA (ElevenLabs TTS)
