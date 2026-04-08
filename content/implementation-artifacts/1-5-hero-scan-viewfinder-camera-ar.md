# Story 1.5: Hero Scan Viewfinder (Caméra AR)

## Objectif
Scanner la boîte d'un médicament avec la caméra pour identification automatique (Code-barres ou OCR du nom).

## Spécifications
* **Given** l'onglet Scanner est ouvert
* **When** le composant s'affiche
* **Then** le cadre de visée est animé (pulse blanc)
* **And** si un code-barres est détecté (focus), le cadre devient vert avec un retour haptique
* **And** si aucun code-barres n'est trouvé après 3 secondes, l'OCR Google ML Kit analyse automatiquement en parallèle.

## Implémentation

### Phase 1 — Scan Barcode (v1)
* Utilisation de `mobile_scanner` pour la lecture de codes-barres.
* Création du `ScanViewfinder` avec animations custom `CustomPainter`.
* Ajout de `vibration` pour le retour haptique sur détection du focus.
* Création du `MedicationLookupService` avec priorité Cache → Supabase.

### Phase 2 — Scan Automatique Barcode + OCR (v2)
Remplacement de `mobile_scanner` par le package `camera` avec **double scanning ML Kit** simultané :

* **Package `camera`** pour le preview et l'accès au flux de frames bruts.
* **`google_mlkit_barcode_scanning`** pour la détection de codes-barres sur chaque frame.
* **`google_mlkit_text_recognition`** pour l'OCR du nom du médicament (activé automatiquement après 3s).
* **`OcrService`** avec heuristique intelligente :
  * Sélection du plus grand bloc de texte (= nom du médicament en gros sur la boîte)
  * Filtrage automatique des dosages (500 mg, 1g...) et numéros de lot
  * Confirmation via 2 frames consécutives identiques pour éviter les faux positifs
* Throttling des analyses OCR à 1.5s pour optimiser les performances.
* Texte d'instruction animé (`AnimatedSwitcher`) : "Pointez vers la boîte du médicament" → "Recherche du code-barres ou du nom..."

### Architecture Technique

```
Camera Frame Stream
      │
      ├── BarcodeScanner.processImage()  ← immédiat
      │     └── Barcode trouvé → haptic + lookup
      │
      └── TextRecognizer.processImage()  ← après 3s
            └── OcrService.extractBestCandidate()
                  └── 2 confirmations → haptic + lookupByName()
```

### Fichiers clés
| Fichier | Rôle |
|---------|------|
| `scan_page.dart` | Page principale, frame processing, double scanning |
| `ocr_service.dart` | Service OCR avec heuristique d'extraction du nom |
| `scan_viewfinder.dart` | Overlay animé (pulse/focus) |
| `medication_lookup_service.dart` | Lookup barcode + nom (Cache → Supabase) |
| `scan_result_screen.dart` | Fiche résultat avec assistant IA intégré |

### Dépendances
| Package | Usage |
|---------|-------|
| `camera` | Preview caméra + flux de frames |
| `google_mlkit_barcode_scanning` | Détection barcode sur frames |
| `google_mlkit_text_recognition` | OCR texte sur frames |
| `vibration` | Retour haptique |

**Status :** Terminée ✅
