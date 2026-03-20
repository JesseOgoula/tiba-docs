# Story 1.6: Fiche Résultat "Medical Pill" & Historique Local

## Objectif
Afficher le résultat du scan sous forme de "Pillule médicale" structurée en 3 parties (Posologie, Dangers, Âge) avec lecture audio (TTS). Développer l'onglet Historique pour retrouver tous ses scans hors-ligne.

## Spécifications
* **Given** un scan réussi (code-barres ou texte)
* **When** le médicament est identifié
* **Then** la `MedicalPillSheet` s'affiche avec des bords ronds
* **And** un bouton TTS (Text-to-Speech) est disponible pour lire le contenu
* **If** le médicament n'est pas trouvé
* **Then** la `NotFoundSheet` s'affiche avec la possibilité de le signaler

* **Given** l'utilisateur clique sur l'onglet Historique
* **When** la page charge
* **Then** elle affiche instantanément les médicaments scannés mis en cache (Drift)

## Implémentation
* Utilisation de `flutter_tts` pour la synthèse vocale (fr-FR).
* Ajout de `intl` pour formater les dates dans l'historique.
* Création de `TtsService` pour gérer l'audio de façon performante.
* Création des UI modales `MedicalPillSheet` et `NotFoundSheet` et suppression des cartes temporaires sur la page de Scan.
* Création de `HistoryPage` branchée sur la base de données Drift via `history_providers`.
* Mise à jour de `AppShell` pour intégrer ce nouvel onglet.

**Status :** Terminée ✅
