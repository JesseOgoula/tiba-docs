---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
inputDocuments:
  - Pharma_AI_Product_Brief.md
  - prd.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-18'
project_name: 'Tiba'
user_name: 'jesse'
date: '2026-03-18'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Le système combine 3 systèmes majeurs : Un client mobile ultra-léger axé sur la capture (Scan OCR/Voix), un moteur RAG hautement sécurisé restreint aux sources certifiées, et un moteur de synchronisation asynchrone pour les pharmacies et le paiement Mobile Money.

**Non-Functional Requirements:**
L'architecture sera pilotée par les contraintes matérielles (3G, 2Go RAM, APK <30Mo) et les exigences de sécurité médicale (Audit logs de 24 mois, TLS 1.3, RAG strict < 3.5s de latence). La disponibilité hors-ligne est absolue pour la résilience.

**Scale & Complexity:**
- Primary domain: Mobile App (Flutter B2C) + Web Admin (Backoffice) + Backend API/RAG
- Complexity level: Haute (Saisie de données complexes + RAG Healthcare)
- Estimated architectural components: Mobile Client B2C, Web Admin Dashboard, Auth/Payment Gateway, Core IA/RAG Engine, Geolocation Service, Offline Sync Engine, B2B Data Warehouse.

### Technical Constraints & Dependencies
- Dépendance critique aux APIs de Mobile Money locales (Orange, Airtel, Moov) nécessitant une gestion robuste des webhooks réseau.
- Sources de données (notices) limitées aux registres pharmaceutiques officiels (pas de scraping libre).

### Cross-Cutting Concerns Identified
- **Offline-First & Graceful Degradation :** Basculer sans erreur du RAG en ligne vers l'annuaire hors-ligne.
- **Sécurité & Auditabilité :** Journalisation immuable de chaque interaction (scan/voix).
- **Data Privacy Pipeline :** Anonymisation irréversible à la source pour le Data Warehouse B2B.

## Starter Template Evaluation

### Primary Technology Domain
Application Mobile B2C + Web Admin Backoffice + Backend API/RAG.

### Starter Options Selected

**1. Mobile App B2C : Flutter**
*   **Rationale :** Réservé exclusivement aux utilisateurs finaux. Permet un accès natif à la caméra (OCR) et au microphone (RAG vocal) sur iOS/Android avec une interface ultra-allégée.
*   **Command :** `flutter create --org com.tiba tiba_app`

**2. Web Admin Dashboard : Next.js**
*   **Rationale :** L'outil parfait pour un backoffice riche (formulaires complexes de saisie de médicaments, gestion de tableaux, upload massif de photos). Il s'intégrera parfaitement à la base de données pour une mise à jour en temps réel.
*   **Command :** `npx create-next-app -e with-supabase suddenly-tiba-admin`

**3. Backend & Base de données : Supabase**
*   **Rationale :** Agit comme le routeur central. Dès que l'équipe Admin saisit un nouveau médicament dans Next.js, Supabase met à jour la table PostgreSQL, qui est lue à la seconde même par l'application Flutter B2C.

### Architectural Decisions Provided
*   **Language :** Dart (Mobile) et TypeScript (Web Admin & Backend).
*   **Data Flow :** Opérations CRUD massives via le Web Admin -> Supabase -> Lecture (Offline-First) par l'app Mobile.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- **Architecture Offline-First :** Base de données locale `Drift` (SQLite) pour la persistance et la synchronisation.
- **Backend & Auth Centrale :** Supabase pour la base PostgreSQL, l'Auth centralisée et RLS pour la séparation des rôles.

**Important Decisions (Shape Architecture):**
- **State Management B2C :** Riverpod pour Flutter.
- **State Management B2B :** React Server Components (RSC) + Zustand pour Next.js Admin.
- **APIs & Edge :** Protocoles REST auto-générés via PostgREST + WebSockets (Realtime) et Edge Functions Deno pour RAG/IA.

**Deferred Decisions (Post-MVP):**
- Data Warehouse complexe pour l'export analytique vers les ONG/Sanofi (Phase 3).
- Intégration avancée Mobile Money (Webhooks complexes) à externaliser dans un micro-service dédié si le volume devient trop important.

### Data Architecture

- **Primary Database:** PostgreSQL (hébergé sur Supabase).
- **Local Persistence (Mobile):** Drift (SQLite pour Dart/Flutter) version 3.x stable.
- **Sync Strategy:** Lecture locale prioritaire (Offline-First). Écriture locale -> Queue de synchronisation asynchrone -> Push vers Supabase lorsque le réseau est disponible.
- **Admin Data Entry:** Insertions directes et massives via l'interface Next.js en TypeScript vers Supabase.

### Authentication & Security

- **Primary Auth Method (B2C):** Social Login (Google & Apple) géré par Supabase Auth.
- **Fallback Auth Method (B2C):** Numéro de téléphone + SMS OTP (via intégration Custom SMS Hook comme Africa's Talking ou Twilio).
- **Admin Auth Method (B2B):** Authentification forte Supabase avec gestion des profils internes rattachés à un rôle `admin`.
- **Data Protection:** Chiffrement au repos (AES-256 standard de Supabase), TLS 1.3 en transit, sécurisation des tables par Row Level Security (RLS) empêchant l'accès des utilisateurs B2C aux données globales ou d'autres utilisateurs.

### API & Communication Patterns

- **API Principale:** Supabase Client SDK (PostgREST) gérant nativement le cache et la sérialisation des requêtes REST.
- **Realtime / PubSub:** Supabase Realtime (WebSockets) utilisé spécifiquement pour actualiser les stocks instantanément sur le mobile lors de la mise à jour côté Admin.
- **Traitement IA:** Requêtes IA (voix/ocr) proxyfiées par des Supabase Edge Functions (Deno) pour ne pas exposer les clés API d'OpenAI/Gemini dans le front-end.

### Frontend Architecture

- **Mobile Client:** Flutter (3.x stable).
- **Mobile State Management:** Riverpod pour la flexibilité structurelle et l'injection de dépendances, accouplé à Freezed pour l'immutabilité des modèles de données.
- **Web Admin Client:** Next.js (version 15+ App Router) en TypeScript.
- **Web State Management:** React Context / Zustand, TailwindCSS pour le styling.

### Infrastructure & Deployment

- **Backend & Database Hosting:** Supabase Cloud (Managed).
- **Web Admin Hosting:** Vercel (Déploiement continu automatisé).
- **CI/CD Pipeline:** GitHub Actions configurées pour :
  - Linter & Tester le code Dart/Flutter.
  - Déployer l'interface Next.js sur Vercel à chaque main merge.
  - Générer les releases/AAB pour Google Play Console et TestFlight.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 areas where AI agents could make different choices (Database naming, API payloads, Code component structure, Error handling).

### Naming Patterns

**Database Naming Conventions:**
- Tables and Columns: `snake_case`, singular (e.g., `pharmacy`, `user_profile`, `product`).
- Foreign Keys: `table_name_id` (e.g., `pharmacy_id`).
- Indexes: `idx_table_column` (e.g., `idx_pharmacy_status`).

**API & Data Exchange Formats:**
- JSON exchange format: `snake_case` (Aligns natively with Supabase Postgres schema, avoiding unnecessary serialization overhead on the client).

**Code Naming Conventions:**
- Dart/TypeScript Variables & Functions: `camelCase` (e.g., `getUserProfile`, `pharmacyList`).
- Dart/React Classes, Widgets & Components: `PascalCase` (e.g., `PharmacyCard`, `AuthController`).
- File naming: `snake_case.dart` pour Flutter, `kebab-case.tsx` pour Next.js.

### Structure Patterns

**Project Organization (Flutter B2C App):**
- **Architecture:** Feature-First (Domain-Driven Design).
- **Structure:** `lib/features/{feature_name}/` contenant ses propres couches `presentation/`, `domain/`, et `data/`. Le code générique ou partagé résidera dans `lib/core/`.

**Project Organization (Next.js Admin):**
- **Architecture:** App Router Standard (Next.js 15+).
- **Structure:** Features regroupées par routes (`app/(dashboard)/pharmacies/`), UI partagée dans `components/ui/`, logique abstraite dans `lib/services/`.

### Process Patterns

**Error Handling Patterns:**
- **Universal Error Object:** `{ "error_code": "STRING_CODE", "message": "Human readable message" }`.
- Pas de crashs silencieux. Toutes les exceptions asynchrones doivent être interceptées via `try/catch` et tracées (Logger local ou Sentry en prod).

**Date & Time Formats:**
- Les dates sont stockées et échangées en `UTC` au format string `ISO 8601` (ex: `2026-03-18T16:00:00Z`).
- Les conversions de fuseaux horaires (ex: Heure d'Abidjan) s'effectuent purement à la couche de présentation (UI).

### Enforcement Guidelines

**All AI Agents MUST:**
- Utiliser les conventions de nommage exactes définies ci-dessus (snake_case DB vs camel/PascalCase Code).
- Organiser le code Flutter en "features" (modules cloisonnés) et non en "layers" globaux.
- Sécuriser toute manipulation de base de données asynchrone par des blocs Try/Catch explicites signalant l'erreur à la couche présentation.

## Project Structure & Boundaries

### Complete Project Directory Structure (Mono-Repo)

```text
tiba-workspace/
├── .github/ workflows/    # CI/CD (GitHub Actions)
├── apps/
│   ├── tiba-mobile/       # Flutter B2C Application
│   │   ├── lib/
│   │   │   ├── core/      # Local DB (Drift), Network Clients, Theming
│   │   │   └── features/
│   │   │       ├── auth/          # OTP & Phone Login
│   │   │       ├── scan_search/   # Core OCR & Voice RAG interaction
│   │   │       ├── pharmacy_map/  # Geolocation & Offline Directory
│   │   │       └── user_profile/  # Settings & Family management
│   └── tiba-admin/        # Next.js B2B Web Dashboard
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/        # Admin Login
│       │   │   └── (dashboard)/
│       │   │       ├── inventory/ # Drug data entry & Photo uploads
│       │   │       └── pharmacies/# Partner management & status
│       │   └── components/ui/     # Shared Tailwind components
├── supabase/
│   ├── functions/         # Edge Functions (Deno)
│   │   ├── rag-search/    # Handles OpenAI RAG internally
│   │   └── process-image/ # Image compression before storage
│   ├── migrations/        # SQL schema history
│   └── seed.sql           # Initial test data
└── package.json           # Mono-repo config (Turborepo ou basique)
```

### Architectural Boundaries

**API Boundaries:**
- L'application mobile (`tiba-mobile`) et le tableau de bord web (`tiba-admin`) communiquent *exclusivement* via le Supabase Client SDK (PostgREST via HTTPS & WebSockets).
- *Strict:* Aucune des deux interfaces ne communique directement avec les APIs IA (OpenAI, Gemini). Ces requêtes sont obligatoirement proxyfiées par `supabase/functions/rag-search/` pour garantir la non-exposition des clés secrètes.

**Component Boundaries:**
- **Flutter Feature Slicing:** L'isolement des fonctionnalités est total. Le dossier `scan_search` ne peut pas importer directement une logique métier de `pharmacy_map`. En cas de dépendance croisée, l'état transite par un State Provider global (Riverpod) ou la DB locale.

### Requirements to Structure Mapping

**Feature Mapping (d'après le PRD):**
- **FR01, FR03 (OCR/Voice Scan):** Localisé dans `apps/tiba-mobile/lib/features/scan_search/` et `supabase/functions/rag-search/`.
- **FR30 (Data Entry):** Localisé dans `apps/tiba-admin/src/app/(dashboard)/inventory/`.
- **NFR03 (Temperature 0 RAG):** Verrouillé dans `supabase/functions/rag-search/index.ts`.
- **NFR11 (Offline Sync Engine):** Localisé dans `apps/tiba-mobile/lib/core/sync_engine/` relié à Drift DB.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Haute de bout-en-bout. Le backend managé de Supabase s'interface nativement avec Flutter via `supabase_flutter` et Next.js via `@supabase/ssr`. 
- Le choix de Drift pour la synchronisation persistante locale (Offline-First) permet un typage fort aligné mécaniquement aux schémas PostgreSQL.

**Pattern Consistency:**
- Fluidité totale. Échanger des JSON au format `snake_case` nativement entre Supabase, Dart et TypeScript évite des surcoûts et des erreurs de sérialisation.

**Structure Alignment:**
- La structure Mono-repo isole hermétiquement le portail "Admin Data Entry" de l'écosystème "Mobile B2C léger", empêchant le couplage de logiques incompatibles.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- Tous les parcours clients centraux (Maman Aminata via la Voix/le Scan, l'Équipe Opérationnelle via le Back-office) sont gérés par des outils et langages dédiés et performants.

**Functional Requirements Coverage:**
- 100% des FR mis à jour (via le pivot administratif) sont soutenus architecturalement par le Web Admin en Next.js.

**Non-Functional Requirements Coverage:**
- **NFR03** (RAG temp 0, latence garantie) s'appuie sur le proxying sécurisé via Deno (Supabase Edge functions) qui maintient les clés d'APIs tierces cachées aux clients.
- **NFR11** (Opérations Hors-lignes) est assuré par l'implémentation de Drift (SQLite local), ce qui maintient des temps de recherche <200ms sur des téléphones bas de gamme sans réseau.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- Des Bases de Données relationnelles (PostgreSQL & SQLite locales) aux États internes réactifs (Riverpod, Zustand), toute l'ossature technique est verrouillée.

**Structure Completeness:**
- Arbres de fichiers clairs, prêts à être "bootstrappés" via `flutter create` et `create-next-app`.

### Gap Analysis Results

Aucun déficit critique. Le grand saut du "SaaS Pharmacien" vers un "Tableau de Bord Administratif Opérateur Tiba" a éliminé le risque architectural prépondérant de la Phase 1 (gérer le onboarding lourd de milliers de pharmacies en autonomie technique pour l'inventaire complet).

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High, reposant sur de fortes validations et la simplification substantielle du cas d'usage des pharmaciens partenaires.

**Key Strengths:**
- La donnée centralisée (Source de vérité) : PostgreSQL de Supabase.
- L'isolation applicative : Web Next.js (Admin/Donnée Mère) et App Flutter (B2C hors-ligne).
- Fonction hors-connexion asymétrique intégrée au design mobile via Drift.

**Areas for Future Enhancement:**
- Phase 3 ou 4 : Désengorger les reportings épidémiologiques analytiques s'ils requièrent plus de métriques BI via l'intégration (ex: BigQuery ou Clickhouse) pour Sanofi / OMC.

### Implementation Handoff

**AI Agent Guidelines:**
- Ne déviez sous aucun prétexte des normes fixées au niveau des nomenclatures `snake_case` VS `camelCase`.
- Utilisez cette Architecture comme socle indéniable de toute requête API.
- Implémentez un Try/Catch exhaustif.

**First Implementation Priority:**
L'initialisation du Workspace Mono-repo physique, du projet `tiba_app` dans `/apps/` et de l'instance Backend Database associée (`supabase start` / Seed DB SQL de base).
