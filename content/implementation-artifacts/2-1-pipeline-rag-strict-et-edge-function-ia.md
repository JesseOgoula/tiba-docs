# Story 2.1: Pipeline RAG Strict & Edge Function IA

## Objectif
Mettre en place le pipeline backend RAG avec pgvector pour répondre exclusivement à partir des notices certifiées avec une température de 0.0 (aucune hallucination).

## Spécifications
* **Given** une notice certifiée est dans la BDD Supabase
* **When** une requête utilisateur est envoyée à l'Edge Function `ai-query`
* **Then** le système effectue un embedding search (pgvector) sur les chunks de la notice
* **And** seul le contenu de la notice est utilisé comme contexte du LLM (temperature 0.0)
* **And** la réponse est journalisée dans `ai_audit_log`

## Implémentation
* **SQL** : Fonction `match_notice_chunks` avec index HNSW pour la similarité cosinus.
* **Edge Function `embed-notice`** : Découpe la notice en chunks → génère les embeddings via OpenAI `text-embedding-3-small` → stocke dans `notice_chunk`.
* **Edge Function `ai-query`** : Embed la question → recherche vectorielle → appel LLM (`gpt-4o-mini`, temp 0.0) avec prompt système strict → log dans `ai_audit_log` → réponse structurée.
* **Flutter** : `AiQueryService` avec support du contexte patient, `aiQueryServiceProvider` Riverpod.
* **Données seed** : Doliprane 500mg et Amoxicilline 500mg avec notices complètes.

**Status :** Terminée ✅
