# Story 2.2: Chat Textuel sur la Notice

## Objectif
Permettre à l'utilisateur de poser des questions écrites sur le médicament scanné, avec réponses IA strict RAG en temps réel.

## Implémentation
* **`ChatMessage`** : Modèle simple (text, isUser, timestamp)
* **`ChatNotifier`/`ChatState`** : Gestion d'état Riverpod avec rate limiting (30 req/heure)
* **`ChatSheet`** : Bottom sheet (85% hauteur) avec bulles de chat, typing indicator, input bar
* **`MedicalPillSheet`** : Bouton "Poser une question" ajouté à côté du FAB TTS

**Status :** Terminée ✅
