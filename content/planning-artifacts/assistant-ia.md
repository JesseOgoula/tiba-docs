---
title: "Documentation : Assistant IA (RAG Strict & Multi-tours)"
description: "Architecture, flux de données et prompt engineering de l'assistant médical IA Tiba."
author: Tiba Engineering
date: 2026-03-21
priority: high
tags:
  - "architecture"
  - "ai"
  - "rag"
  - "prompt"
---

# 🤖 Assistant IA Tiba : Architecture et Fonctionnement

Cette documentation détaille le fonctionnement du cœur de Tiba : le Pharmacien Digital IA. L'intelligence artificielle de Tiba repose sur un principe fondamental : **Le RAG (Retrieval-Augmented Generation) Strict**.

---

## 🏗️ 1. L'Architecture Globale (Pipeline RAG)

Tiba n'utilise jamais les connaissances générales du modèle d'IA pour répondre aux questions médicales. Tout est sourcé à partir de la **base de données vectorielle** des notices de médicaments.

### Le processus RAG :
1. **Application Mobile** : L'utilisateur pose une question (via texte ou voix).
2. **Edge Function (`ai-query`)** : La requête est envoyée à Supabase via Deno.
3. **Embedding** : La requête est transformée en vecteur via `text-embedding-3-small` (OpenAI via OpenRouter).
4. **Similarity Search (PostGIS/pgvector)** : La fonction `match_notice_chunks` fouille la notice du médicament cible pour trouver les 5 blocs de texte les plus pertinents (Cosine Similarity > 0.3).
5. **Prompting** : Les blocs trouvés sont injectés dans le prompt système comme *unique source de vérité*.
6. **Génération LLM** : `gpt-4o-mini` (temperature = 0.1) génère la réponse finale en suivant des règles strictes.

---

## 🗣️ 2. Approche Conversationnelle (Multi-tours)

Initialement, le contexte patient (âge, poids) devait être rempli via un formulaire avant de chatter. Après révision ergonomique, Tiba utilise une **approche purement conversationnelle**.

### Fonctionnement :
- Le client Flutter conserve un `ChatState` avec l'historique complet de la session.
- Avant chaque appel à l'Edge Function, la méthode `_buildConversationHistory()` extrait les **4 derniers échanges** (8 messages : paires utilisateur/assistant) et les envoie sous forme de `conversation_history`.
- Le prompt système a été adapté avec une consigne claire : 
  > *Si l'utilisateur pose une question de posologie mais que tu ignores si c'est pour un adulte ou un enfant, ou son poids, pose-lui la question avant de répondre.*

Cette approche permet une interaction vocale ("Voice-First") ou textuelle beaucoup plus fluide et naturelle.

---

## 🔒 3. Le Prompt Système (Règles Absolues)

Voici les instructions fondamentales injectées à chaque requête. Elles garantissent la sécurité médicale (Pare-feu) :

1. Tu ne réponds QU'À PARTIR du contexte de la notice.
2. Tu ne poses JAMAIS de diagnostic.
3. Tu ne prescris JAMAIS de traitement.
4. Si l'information manque : "Cette information n'est pas disponible dans la notice."
5. Si diagnostic demandé : "⚠️ Tiba ne peut pas poser de diagnostic. Consultez un médecin."
6. CONTEXTE PATIENT : Demande naturellement l'âge/poids/type si non spécifié dans l'historique avant de donner une posologie.

*(La sécurité sera encore renforcée à l'Avenir avec un modèle de classification en amont pour bloquer les requêtes à haut risque : Story 2.5).*

---

## 🎙️ 4. Flux Vocal (Voice Orb)

La fonctionnalité vocale (`VoiceOrb`) intègre l'écoute interactive et le retour vocal (TTS) :
- **Appui long ("Hold-to-Talk")** : Démarre le plugin natif `speech_to_text` avec des ondes visuelles animées via un `CustomPainter` et retour haptique.
- **Envoi automatique** : Au relâchement, le texte transcrit est envoyé au chat.
- **Retour TTS Auto** : Le Riverpod `ChatNotifier` écoute les changements d'état. Si la réponse provient de l'IA (après une requête vocale), le plugin `flutter_tts` s'active automatiquement pour lire la réponse à voix haute.

---

## 📝 5. Table d'Audit (`ai_audit_log`)

Chaque interaction avec l'Edge Function IA est loggée dans Supabase pour des raisons légales et statistiques :
- `medication_id` concerné
- `query_text` (Question brute de l'utilisateur)
- `response_text` (Réponse générée)
- `was_blocked` (Booléen : la requête a-t-elle été rejetée par le RAG ou l'anti-diagnostic ?)
- `block_reason` (ex: "no_matching_context")
- `source_type` ("text" ou "voice")

*Les `user_id` ne sont pas stockés en clair, mais sous forme de hash anonymisé pour respecter la vie privée (Epic 6).*
