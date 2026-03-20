# Story 1.4: Infrastructure Locale & Synchronisation DB

## Objectif
Rendre l'application utilisable entièrement hors-ligne (Offline-First) pour l'accès aux notices déjà consultées, avec une synchronisation automatique au retour de la connexion réseau.

## Spécifications
* **Given** une notice de médicament a été ouverte par l'utilisateur
* **When** la fiche est affichée
* **Then** elle est mise en cache localement via Drift (SQLite)
* **And** l'éviction suit une politique FIFO (7 jours, max 50 notices)

* **Given** le réseau est coupé
* **When** l'utilisateur consulte une notice du cache
* **Then** elle s'affiche instantanément, avec une bannière "Mode hors-ligne"

## Implémentation
* Intégration de `drift`, `sqlite3_flutter_libs`, et `path_provider`.
* Création de `AppDatabase` avec les tables `cached_medication` et `sync_queue`.
* Implémentation de `SyncEngine` pour la file d'attente hors-ligne.
* Implémentation de `ConnectivityMonitor` pour déclencher la synchronisation.
* Ajout du composant UI `OfflineBanner`.

**Status :** Terminée ✅
