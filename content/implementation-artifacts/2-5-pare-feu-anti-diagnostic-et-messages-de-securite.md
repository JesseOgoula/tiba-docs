---
title: "Story 2.5 : Pare-feu Anti-Diagnostic & Messages de Sécurité"
description: "Documentation de l'implémentation du pare-feu médical (anti-diagnostic) avec rendu JSON strict."
date: 2026-03-21
---

# Story 2.5 : Pare-feu Anti-Diagnostic & Messages de Sécurité

## 🎯 Objectif
S'assurer que l'IA ne dévie jamais vers le diagnostic ou la prescription, et que tout refus de répondre pour des raisons de sécurité soit clairement affiché à l'utilisateur via une UI d'alerte spécifique, différente d'une réponse normale.

## 🛠️ Implémentation Backend (Deno Edge Function)
- Le modèle Gpt-4o-mini est désormais forcé de répondre en JSON (via l'option `response_format: { type: "json_object" }`).
- Le `SYSTEM_PROMPT` exige que chaque réponse précise :
  ```json
  {
    "response": "Texte généré...",
    "is_blocked": true/false,
    "block_reason": "diagnostic" | "prescription" | "not_in_notice" | null
  }
  ```
- L'Edge Function parse ce JSON sécurisé, sauvegarde le vrai statut `was_blocked` et la raison dans la table d'audit Supabase (`ai_audit_log`), et renvoie les booléens au client mobile.

## 📱 Implémentation Frontend (Flutter)
- **Modèles & Provider** : `ChatMessage` intègre `isBlocked` et `blockReason`. Le `ChatNotifier` passe ces données à partir de l'objet `AiQueryResponse`.
- **UI (ChatSheet)** : La méthode `_buildMessageBubble` a été transformée pour le rendu visuel. Si `isBlocked` est `true` :
  - La couleur de fond vert classique est remplacée par un fond `Coral` clair.
  - La bordure de la bulle devient visible (`TibaColors.coral.withOpacity(0.3)`).
  - L'icône du "robot" Tiba est remplacée par un **Warning (⚠️)** sur fond rouge/corail (`Icons.warning_amber_rounded`).
- **Nettoyage** : Le fichier mort `patient_context_dialog.dart` a été définitivement supprimé pour garder l'arbre de code clair depuis le passage au mode multi-tours.

## 📊 Résultat
Lorsqu'un utilisateur demande : "Qu'est-ce que j'ai si j'ai mal à la tête ?", l'IA génère sa réponse habituelle de refus, MAIS la bulle de chat Flutter est affichée comme un avertissement de sécurité. Ceci clarifie immédiatement le rôle non constructeur de profil médical de l'application Tiba.
