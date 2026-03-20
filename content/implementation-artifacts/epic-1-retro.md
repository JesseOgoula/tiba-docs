# Rétrospective Epic 1 : L'Expérience Cœur "Scan & Know" (MVP Patient)

**Date :** 20 Mars 2026
**Participants :** Jesse (Project Lead), Alice (Product Owner), Bob (Scrum Master), Charlie (Senior Dev), Dana (QA Engineer), Elena (Junior Dev)

## 📊 Résumé des Métriques
- **Stories complétées :** 6/6 (100%)
- **Statut :** Epic 1 officiellement terminé.

## 🏆 Ce qui a bien fonctionné (Succès)
1. **Architecture Locale & Hors-Ligne (Drift)** : L'implémentation de la base de données locale SQLite et de la file d'attente hors-ligne permet une expérience fluide, avec un affichage quasi-instantané de l'historique sans appel réseau.
2. **Scanner IA et UX** : Le Hero Scan Viewfinder et l'idée d'un "fallback" OCR avec Google ML Kit (qui prend le relais quand le code-barres n'est pas lisible) est une immense victoire pour l'accessibilité métier dans les zones à faible connectivité.
3. **Text-to-Speech (TTS) Rapide** : L'ajout de `flutter_tts` dans la dernière story montre notre flexibilité face aux enjeux d'accessibilité.

## ⚠️ Les Défis Rencontrés & Dette Technique
1. **Rigueur sur la Qualité du Code (Linter)** : Lors de la complétion des stories 1.5 et 1.6, des imports inutilisés et de vieilles variables non nettoyées ont causé des échecs temporaires lors de l'analyse CI locale (`flutter analyze`).
2. **Oublis de Dépendances Communes** : Une dépendance critique pour l'UI (`intl` pour le formatage des dates) a été oubliée dans le plan initial, nécessitant un hotfix.

## 🎯 Plan d'action & Engagements pour l'Epic 2
L'Epic 2 se concentre sur **Le Pharmacien Digital IA (RAG Strict)**, ce qui introduira plus de complexité back-end (Supabase Edge Functions).

1. **Rigueur du Refactoring (Clean Code) :** L'agent développeur s'engage à exécuter systématiquement `flutter analyze` et s'assurer du nettoyage des lints (variables orphelines, imports inutilisés) *avant* chaque commit final.
2. **Anticipation des Packages :** Pour éviter les multiples redémarrages de l'analyseur, toutes les dépendances évidentes (comme le formatage de texte) seront listées et installées en amont du ticket.

*Rétrospective clôturée avec succès, l'équipe est prête pour l'Epic 2 !*
