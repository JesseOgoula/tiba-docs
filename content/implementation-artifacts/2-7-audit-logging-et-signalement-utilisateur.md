---
title: "Story 2.7 : Audit Logging & Signalement Utilisateur"
description: "Traçabilité des interactions IA et signalement utilisateur."
date: 2026-03-21
---

# Story 2.7 : Audit Logging & Signalement Utilisateur

## 🎯 Objectif
Permettre la traçabilité complète de chaque interaction IA (audit log immuable) et donner la possibilité aux utilisateurs de **signaler une réponse incorrecte ou dangereuse**.

## 🛠️ Implémentation

### Backend (Edge Function v12)
- L'insertion dans `ai_audit_log` utilise désormais `.select('id').single()` pour récupérer l'`audit_log_id` généré.
- Ce champ est retourné au client dans la réponse JSON.

### Flutter — Modèles
- `ChatMessage.auditLogId` : chaque réponse IA porte l'ID de son entrée d'audit.
- `AiQueryResponse.auditLogId` : parsé depuis la réponse de l'Edge Function.

### Flutter — Service (`AiQueryService`)
- Nouvelle méthode `submitReport(auditLogId, reason, description?)` qui insère directement dans la table `user_report` via Supabase.

### Flutter — UI
- **Bouton "Signaler"** : Discret, en gris clair sous chaque bulle IA (icône drapeau + texte). N'apparaît que si l'`auditLogId` est disponible.
- **ReportDialog** : Dialog élégant avec 3 options radio (Information incorrecte / dangereuse / Autre) + champ libre optionnel. Affiche une animation de succès avant de se fermer.

## 📊 Tables Supabase utilisées
- `ai_audit_log` : INSERT ONLY, rétention 24 mois, champs `user_hash`, `medication_id`, `query_text`, `response_text`, `was_blocked`, `block_reason`, `source_type`.
- `user_report` : FK vers `ai_audit_log.id`, raisons `incorrect` / `dangerous` / `other`, statut `pending` / `reviewed` / `resolved`.
