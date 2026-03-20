# Story 1.5: Hero Scan Viewfinder (Caméra AR)

## Objectif
Scanner la boîte d'un médicament avec la caméra pour identification automatique (Code-barres ou OCR d'urgence).

## Spécifications
* **Given** l'onglet Scanner est ouvert
* **When** le composant s'affiche
* **Then** le cadre de visée est animé (pulse blanc)
* **And** si un code-barres est détecté (focus), le cadre devient vert avec un retour haptique
* **And** si aucun code-barres n'est trouvé après 5 secondes, l'OCR Google ML Kit prend le relais (lecture du nom).

## Implémentation
* Utilisation de `mobile_scanner` pour la lecture ML (très rapide).
* Utilisation de `google_mlkit_text_recognition` pour l'OCR en fallback.
* Ajout de `vibration` pour le retour haptique sur détection du focus.
* Ajout des permissions `CAMERA` (Android/iOS).
* Affichage du `ScanViewfinder` avec animations custom `CustomPainter`.
* Création du `MedicationLookupService` avec priorité Cache -> Supabase.

**Status :** Terminée ✅
