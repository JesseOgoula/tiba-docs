# Story 1.3: Authentification Anonyme (Google)

## Objectif
Permettre une inscription/connexion sans friction (Zero Friction) via Google Auth, tout en respectant l'architecture "Offline-First".

## Spécifications (basées sur Epics)
* **Given** un utilisateur non authentifié sur la page Login
* **When** il clique sur "Continuer avec Google"
* **Then** la popup Google native s'ouvre
* **And** après succès, un compte Supabase (Auth) est créé
* **And** le profil initial est configuré dans `user_profile`

## Implémentation
* Utilisation du package `google_sign_in` et `supabase_flutter`.
* Création de variables d'environnement (`.env`) avec `flutter_dotenv`.
* Déclaration des clés Supabase et du Web Client ID Google.
* Ajout d'une table locale (Drift) pour garder l'identifiant hors-ligne (ajouté globalement).
* Mise en place de Row Level Security (RLS) sur Supabase pour protéger `user_profile`.

**Status :** Terminée ✅
