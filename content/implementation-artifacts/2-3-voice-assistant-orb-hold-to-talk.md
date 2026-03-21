# Story 2.3: Voice Assistant Orb (Hold-to-Talk)

## Objectif
Permettre aux utilisateurs (y compris analphabètes) d'interroger l'IA vocalement via un bouton hold-to-talk avec retour audio automatique.

## Implémentation
* **`VoiceOrb`** : Widget hold-to-talk avec animation d'ondes concentriques (CustomPainter), STT French locale, feedback haptique, et preview transcription en direct
* **`ChatSheet`** : Intégration de l'orbe vocal à côté du bouton send, avec auto-TTS sur la réponse IA
* **`ChatNotifier`** : Support du paramètre `sourceType` ('text'|'voice') pour le logging audit

**Pipeline vocal :** 🎤 Maintenir → STT (fr_FR) → Texte → RAG → Réponse IA → 🔊 Lecture TTS automatique

**Status :** Terminée ✅
