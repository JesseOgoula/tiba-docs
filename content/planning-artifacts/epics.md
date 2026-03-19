---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments: 
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# Tiba - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Tiba, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** L'utilisateur peut scanner le code-barres d'une boîte de médicament pour identifier le produit.
- **FR2:** L'utilisateur peut scanner le nom imprimé sur une boîte (OCR texte) lorsque le code-barres est absent ou illisible.
- **FR3:** Le système peut faire correspondre le scan à une notice certifiée dans la base de données interne.
- **FR4:** Le système peut informer l'utilisateur lorsqu'un médicament scanné n'est pas trouvé dans la base de données.
- **FR5:** L'utilisateur peut poser une question vocale à l'IA concernant un médicament identifié.
- **FR6:** L'utilisateur peut poser une question textuelle (chat) à l'IA concernant un médicament identifié.
- **FR7:** L'utilisateur peut accéder à l'assistant IA sans avoir scanné de produit (mode global).
- **FR8:** L'IA peut répondre vocalement en se basant exclusivement sur le contenu de la notice certifiée du médicament (RAG Strict, Température 0.0).
- **FR9:** L'utilisateur peut fournir un contexte patient (adulte/enfant, âge, poids estimé) avant d'interroger l'IA.
- **FR10:** Le système peut détecter et bloquer toute requête utilisateur demandant un diagnostic, une prescription, ou un conseil médical hors notice.
- **FR11:** Le système peut déclencher un message de sécurité ("Consultez un médecin") lorsqu'une requête est hors du périmètre de la notice.
- **FR12:** Le système peut déclencher un message de sécurité lorsque l'information demandée est introuvable dans la notice.
- **FR13:** L'utilisateur peut rechercher les pharmacies de garde ouvertes à proximité de sa position GPS.
- **FR14:** Le système peut afficher la distance et l'itinéraire vers les pharmacies trouvées.
- **FR15:** L'utilisateur peut consulter l'annuaire des pharmacies de garde même hors connexion (cache local).
- **FR16:** Le système peut suggérer automatiquement une pharmacie de garde après un scan ou une requête IA.
- **FR17:** L'utilisateur peut créer un compte via son numéro de téléphone (OTP).
- **FR18:** L'utilisateur peut utiliser l'application gratuitement pour un nombre limité de scans par mois.
- **FR19:** L'utilisateur peut souscrire à un abonnement Premium via Mobile Money (Orange, Airtel, Moov).
- **FR20:** Le système peut gérer la transition Freemium → Premium (paywall) après épuisement du quota gratuit.
- **FR21:** L'utilisateur peut accepter le disclaimer légal obligatoire au premier lancement de l'application.
- **FR22:** Le système peut ingérer et mettre à jour les notices médicamenteuses exclusivement depuis des sources officielles certifiées.
- **FR23:** Le système peut anonymiser de manière irréversible les données d'utilisation avant toute agrégation analytique.
- **FR24:** Le système peut journaliser (logger) chaque interaction IA pour audit de sécurité médicale.
- **FR25:** Le système peut fonctionner en mode dégradé (cache local) en cas de perte de réseau.
- **FR26:** Le système peut agréger les données de scan anonymisées par zone géographique et par période.
- **FR27:** Un opérateur B2B peut consulter un dashboard d'analytiques sur les tendances de consommation pharmaceutique.
- **FR28:** Un opérateur B2B peut recevoir des alertes prédictives (pic anormal de recherches sur un médicament dans une zone).
- **FR29:** Un Opérateur Tiba (accès administrateur) peut consulter et gérer la base de données pharmaceutique depuis le Web Admin Dashboard.
- **FR30:** Un Opérateur Tiba peut créer et éditer des fiches produit (incluant photos, texte de la notice, nom) qui se synchronisent immédiatement sur l'app.
- **FR30b:** Un Opérateur Tiba peut mettre à jour les disponibilités de médicaments et les horaires de garde d'une pharmacie depuis le Web Admin Dashboard.
- **FR31:** Un administrateur peut ajouter, modifier ou retirer une notice médicamenteuse de la base de données.
- **FR32:** Le système peut synchroniser les données locales avec le serveur après rétablissement de la connexion sans perte de données.
- **FR33:** L'utilisateur peut parcourir un tutoriel de première utilisation expliquant les capacités et les limites de l'application.
- **FR34:** Le système peut proposer une action alternative immédiate (localiser un médecin, appeler le SAMU local) lorsqu'il refuse une requête hors périmètre.
- **FR35:** L'utilisateur peut consulter son historique de paiements et de souscriptions.
- **FR36:** L'utilisateur peut consulter son quota restant de scans gratuits.
- **FR37:** L'utilisateur peut signaler une réponse de l'IA qu'il considère comme incorrecte ou dangereuse.

### NonFunctional Requirements

- **NFR1:** Le traitement vocal complet (Micro → RAG → Synthèse vocale) doit s'exécuter en moins de 3.5 secondes sur un réseau 3G standard.
- **NFR2:** Le scan de code-barres doit identifier le médicament en moins de 1.5 secondes après la mise au point de la caméra.
- **NFR3:** La liste des pharmacies de garde doit s'afficher en moins de 2 secondes (mode en ligne) ou 0.5 seconde (mode cache local).
- **NFR4:** Le temps de réponse IA au premier appel (cold start) ne doit pas dépasser 6 secondes.
- **NFR5:** Toutes les communications client-serveur doivent être chiffrées en TLS 1.3 minimum.
- **NFR6:** Les données du futur carnet de santé familial doivent être chiffrées au repos avec AES-256.
- **NFR7:** Les tokens d'authentification (OTP) doivent expirer après 5 minutes et être à usage unique.
- **NFR8:** Les journaux d'audit des interactions IA doivent être conservés pendant un minimum de 24 mois et être immuables.
- **NFR9:** L'anonymisation des données B2B doit être irréversible.
- **NFR10:** Le système doit limiter les requêtes IA à un maximum de 30 par utilisateur par heure.
- **NFR11:** L'architecture backend doit supporter un passage de 1 000 à 50 000 utilisateurs actifs mensuels sans refactoring majeur.
- **NFR12:** La base de données des notices médicamenteuses doit supporter l'ajout de 10 000+ références sans dégradation des performances du RAG.
- **NFR13:** L'architecture doit prévoir un chemin de migration documenté vers 500 000+ MAU.
- **NFR14:** L'API backend (hors IA) doit maintenir un uptime de 99.9%.
- **NFR15:** En cas de panne du service IA, l'annuaire des pharmacies de garde et le scanner doivent rester 100% opérationnels.
- **NFR16:** Le cache local (pharmacies + notices récentes) doit rester fonctionnel pendant 7 jours sans connexion internet.
- **NFR17:** L'interface vocale doit être utilisable par un utilisateur analphabète sans jamais nécessiter de lecture à l'écran pour les fonctions critiques.
- **NFR18:** L'application doit fonctionner correctement sur des appareils avec 2 Go de RAM et des écrans de 5 pouces minimum.
- **NFR19:** La taille de l'APK initial ne doit pas dépasser 30 Mo.
- **NFR20:** L'interface doit maintenir un ratio de contraste minimum de 7:1 (WCAG AAA) pour tous les éléments textuels critiques.
- **NFR21:** Les données anonymisées exportées vers le Data Warehouse B2B doivent avoir un taux de complétude minimum de 95%.

### Additional Requirements

- [Architecture/Starter] Mobile App: Initialiser via `flutter create --org com.tiba tiba_app` (Epic 1 Story 1).
- [Architecture/Starter] Web Admin: Initialiser via `npx create-next-app -e with-supabase suddenly-tiba-admin` (Epic 1 Story 1).
- [Architecture] Base de données et Backend: PostgreSQL hébergé sur Supabase, avec utilisation de Supabase Auth et Edge Functions (Deno).
- [Architecture] Infrastructure Mobile: Utilisation de `Drift` (SQLite) pour la base de données locale (Offline-First).
- [Architecture] State Management: Utilisation de `Riverpod` (Flutter) et `Zustand` ou Server Components (Next.js).
- [Architecture] Mono-Repo: Configurer la racine du projet pour héberger `apps/tiba-mobile`, `apps/tiba-admin` et `supabase/`.
- [Architecture] Naming Conventions: `snake_case` pour la DB et APIs, `camelCase`/`PascalCase` pour le code. Organiser le code Flutter en Features (`lib/features/`).

### UX Design Requirements

- UX-DR1: Implémenter le "Hero Scan Viewfinder" (AR Camera) avec 3 états : Searching, Focused (retour haptique), Processing (squelette gris).
- UX-DR2: Implémenter le "Voice Assistant Orb" (Hold-to-Talk) avec onde sonore dynamique pour le mode vocal.
- UX-DR3: Implémenter le "Medical Result Pill" comme composant structurel incluant 3 sections fixes (Posologie, Dangers, Âge) et lecteur audio TTS.
- UX-DR4: Structurer la navigation autour d'une Bottom Navigation Bar de 3 onglets maximum (Scanner, Historique, Secours). Aucun Menu Hamburger caché.
- UX-DR5: Implémenter le design system basé sur Material 3 surchargé (Angles 24px "soft edge", Vert Santé #0B8E71, Fond Sable #F5F0E6, Alert rouge #E85D75).
- UX-DR6: Tous les boutons et cibles interactives doivent avoir une taille de 48x48px minimum ("Fat Finger").
- UX-DR7: Remplacer tous les indicateurs de chargement tournants (spinners) par des Skeleton Loaders apaisants.
- UX-DR8: Assurer le support strict des polices agrandies du système d'exploitation et utiliser le couple typographique Outfit (Titres) / Inter (Texte).

### FR Coverage Map

- FR1, FR2, FR3, FR4, FR17, FR21, FR25, FR32, FR33: Epic 1 - L'Expérience Cœur "Scan & Know" (Scanner OCR, Base locale Drift, Info Produit, Inscription OTP, Support Offline initial, Tutoriel)
- FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR22, FR24, FR34, FR37: Epic 2 - Le Pharmacien Digital IA (Questions Vocales/Textuelles, RAG Strict, Température 0.0, Pare-feu diagnostic, Logs de sécurité d'audit)
- FR13, FR14, FR15, FR16: Epic 3 - Le Filet de Sécurité Local (Localisation GPS des Pharmacies de Garde, Cache offline, Itinéraires)
- FR29, FR30, FR30b, FR31: Epic 4 - La Tour de Contrôle Opérationnelle (Web Admin Dashboard B2B pour la gestion DB et pharmacies)
- FR18, FR19, FR20, FR35, FR36: Epic 5 - Monétisation & Quotas (Modèle Freemium 3 scans/mois, Paiements Mobile Money, Paywall)
- FR23, FR26, FR27, FR28: Epic 6 - Le Pivot Licorne "Data SaaS" (Anonymisation des KPI santé, Dashboard analytique mondial, Alertes prédictives)

## Epic List

### Epic 1: L'Expérience Cœur "Scan & Know" (MVP Patient)
Permettre à un utilisateur de s'inscrire, de scanner une boîte de médicament (OCR) très facilement, et de lire une fiche produit simplifiée (avec support hors-ligne de base de la notice grâce à la synchronisation Drift). **Includes Architecture/UI Setup (NFR2, UX-DR1, UX-DR3, UX-DR5).**
**FRs covered:** FR1, FR2, FR3, FR4, FR17, FR21, FR25, FR32, FR33

### Epic 2: Le Pharmacien Digital IA (Le RAG Strict)
Permettre à un utilisateur enregistré de poser des questions vocales (ou texte) sur la notice scannée, tout en le protégeant par un pare-feu anti-diagnostic via un RAG Strict et en gardant un journal inaltérable des requêtes pour des questions d'audit médical. **(NFR1, NFR4, NFR8, NFR10, NFR17, UX-DR2, UX-DR7)**
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR22, FR24, FR34, FR37

### Epic 3: Le Filet de Sécurité Local (Pharmacies de Garde)
Fournir l'emplacement de la pharmacie de garde physique la plus proche du patient pour prolonger le diagnostic ou obtenir son remède, de façon instantanée, avec ou sans connexion GPS 3G, grâce au stockage local SQLite. **(NFR3, NFR15, NFR16, UX-DR4)**
**FRs covered:** FR13, FR14, FR15, FR16

### Epic 4: La Tour de Contrôle Opérationnelle (Web Admin Dashboard)
Permettre aux opérateurs Tiba de saisir massivement les nouvelles notices officielles et de mettre à jour en direct les stocks des pharmacies dans un portail React Next.js connecté en temps réel via Supabase et les Edge Functions.
**FRs covered:** FR29, FR30, FR30b, FR31

### Epic 5: Monétisation & Quotas (Le Moteur Économique)
Gérer rigoureusement la limite des 3 scans Freemium gratuits, en affichant un paywall bien synchronisé de transactions avec l'écosystème Mobile Money d'Afrique Centrale (Airtel/Orange/Moov) pour activer la version Premium. **(NFR7)**
**FRs covered:** FR18, FR19, FR20, FR35, FR36

### Epic 6: Le Pivot Licorne "Data SaaS" (Analytique et Insights)
Agréger et expurger toutes les données individuelles des scans afin d'offrir des alertes prédictives et un puissant tableau de bord de macro-tendances médicales pour les Ministères, OMS ou géants pharmaceutiques en B2B. **(NFR9, NFR21)**
**FRs covered:** FR23, FR26, FR27, FR28

---

## Epic 1: L'Expérience Cœur "Scan & Know" (MVP Patient)

**Epic Goal:** Permettre à un utilisateur de s'inscrire, de scanner une boîte de médicament (OCR), et de lire une fiche produit simplifiée (avec support hors-ligne de base).

### Story 1.1: Project Initialization & Design System

As a **développeur Tiba**,
I want **un mono-repo correctement configuré avec le Design System Tiba implémenté**,
So that **toutes les futures stories s'appuient sur une fondation technique et visuelle cohérente**.

**Acceptance Criteria:**

**Given** le développeur clone le dépôt pour la première fois
**When** il exécute les commandes d'initialisation
**Then** la structure mono-repo contient `apps/tiba-mobile/` (Flutter), `apps/tiba-admin/` (Next.js stub), et `supabase/`
**And** le projet Flutter est initialisé via `flutter create --org com.tiba` avec le package name `com.tiba.app`

**Given** le projet Flutter est initialisé
**When** le développeur ouvre `lib/core/theme/`
**Then** le fichier `tiba_theme.dart` contient le ThemeData Material 3 surchargé avec :
- Couleur primaire : Vert Santé `#0B8E71`
- Couleur de fond : Sable Chaud `#F5F0E6`
- Couleur d'alerte : Rouge Corail `#E85D75`
- Couleur texte : Charbon Profond `#1A1A1A`
- Border radius global : `24px` (soft edge)
- Polices : Outfit (titres), Inter (corps de texte)
**And** tous les boutons et cibles interactives ont un minimum de `48x48px` (UX-DR6)
**And** le ratio de contraste texte/fond respecte 7:1 minimum (NFR20)

**Given** le Design System est en place
**When** le développeur navigue dans l'application
**Then** la Bottom Navigation Bar de 3 onglets (Scanner, Historique, Secours) est visible (UX-DR4)
**And** aucun Menu Hamburger n'existe dans l'application

**Given** le projet est configuré
**When** `flutter analyze` est exécuté
**Then** zéro erreur et zéro warning sont reportés

---

### Story 1.2: Onboarding & Disclaimer Légal

As a **nouvel utilisateur Tiba (Aminata)**,
I want **comprendre ce que l'application peut et ne peut pas faire, et accepter les conditions légales**,
So that **je sois informée des limites de l'IA avant de l'utiliser pour ma famille**.

**Acceptance Criteria:**

**Given** l'utilisateur lance l'application pour la toute première fois
**When** l'écran d'accueil s'affiche
**Then** un tutoriel de 3-4 écrans défilants (swipe) explique :
  1. Le scan de médicaments et ce qu'il permet
  2. L'assistant IA et ses limites strictes (pas de diagnostic)
  3. Les pharmacies de garde à proximité
**And** chaque écran utilise des illustrations et un texte large lisible (Outfit/Inter)
**And** un bouton "Passer" est visible à tout moment

**Given** l'utilisateur a terminé ou passé le tutoriel
**When** l'écran de disclaimer légal s'affiche
**Then** le texte du disclaimer est affiché en entier avec scroll
**And** une checkbox "J'ai lu et j'accepte" est présente
**And** le bouton "Continuer" reste désactivé tant que la checkbox n'est pas cochée (FR21)

**Given** l'utilisateur coche la checkbox et appuie sur "Continuer"
**When** l'acceptation est enregistrée
**Then** le flag `disclaimer_accepted = true` est sauvegardé localement (SharedPreferences)
**And** l'utilisateur ne reverra jamais le tutoriel ni le disclaimer lors des lancements suivants

**Given** l'utilisateur relance l'application après avoir déjà accepté
**When** l'application démarre
**Then** l'écran d'accueil principal (Scanner) s'affiche directement (FR33)

---

### Story 1.3: Authentification Utilisateur OTP

As a **utilisateur Tiba (Aminata)**,
I want **créer un compte avec mon numéro de téléphone et me connecter facilement**,
So that **mes scans et mon historique soient associés à mon profil de façon sécurisée**.

**Acceptance Criteria:**

**Given** l'utilisateur a accepté le disclaimer (Story 1.2)
**When** l'écran d'inscription s'affiche
**Then** un champ de saisie pour le numéro de téléphone (format international +237, +242, +243) est présenté
**And** un sélecteur de préfixe pays est disponible

**Given** l'utilisateur saisit un numéro de téléphone valide et appuie sur "Recevoir le code"
**When** la requête est envoyée à Supabase Auth (OTP Phone)
**Then** un SMS contenant un code OTP à 6 chiffres est envoyé au numéro
**And** un écran de saisie du code OTP avec un timer de 5 minutes s'affiche (NFR7)
**And** un Skeleton Loader s'affiche pendant l'envoi (UX-DR7)

**Given** l'utilisateur saisit le code OTP correct dans les 5 minutes
**When** le code est vérifié par Supabase Auth
**Then** la session utilisateur est créée et le JWT est stocké en local de manière sécurisée
**And** l'utilisateur est redirigé vers l'écran Scanner principal (FR17)

**Given** l'utilisateur saisit un code OTP incorrect ou expiré
**When** la vérification échoue
**Then** un message d'erreur clair s'affiche en Rouge Corail (#E85D75)
**And** l'utilisateur peut renvoyer un nouveau code après le délai du timer

**Given** l'utilisateur est déjà connecté
**When** il relance l'application
**Then** la session est restaurée automatiquement sans redemander le code OTP
**And** toutes les communications utilisent TLS 1.3 minimum (NFR5)

---

### Story 1.4: Infrastructure Locale & Synchronisation DB

As a **utilisateur Tiba en zone rurale (Aminata)**,
I want **que l'application fonctionne même sans connexion internet**,
So that **je puisse consulter les notices des médicaments déjà scannés quand le réseau est indisponible**.

**Acceptance Criteria:**

**Given** l'application est installée et l'utilisateur est connecté
**When** le module Drift (SQLite) est initialisé
**Then** les tables locales pour les notices médicamenteuses récemment consultées sont créées
**And** le schéma Drift est versionné et prêt pour les migrations futures

**Given** l'utilisateur a consulté des notices en ligne
**When** la connexion réseau est perdue
**Then** les notices consultées dans les 7 derniers jours sont accessibles depuis le cache local (NFR16, FR25)
**And** un indicateur visuel discret "Mode Hors-ligne" apparaît dans la barre de statut

**Given** l'utilisateur est en mode hors-ligne
**When** il effectue des actions (consultation de notices en cache)
**Then** les actions sont enregistrées localement dans une file d'attente de synchronisation

**Given** la connexion réseau est rétablie
**When** le système détecte la reconnexion
**Then** la file d'attente de synchronisation est traitée automatiquement (FR32)
**And** les données locales sont synchronisées avec Supabase sans perte de données
**And** aucun conflit ne produit de duplication

**Given** l'application fonctionne sur un appareil avec 2 Go de RAM
**When** le cache local est plein
**Then** les notices les plus anciennes sont purgées en premier (FIFO) pour respecter les contraintes mémoire (NFR18)

---

### Story 1.5: "Hero Scan Viewfinder" (Caméra AR)

As a **utilisateur Tiba (Aminata)**,
I want **scanner la boîte de médicament de mon enfant avec la caméra de mon téléphone**,
So that **l'application identifie instantanément le produit sans que j'aie besoin de taper quoi que ce soit**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et navigue vers l'onglet Scanner
**When** l'écran de scan s'affiche
**Then** le "Hero Scan Viewfinder" s'active avec la caméra arrière (UX-DR1)
**And** l'état initial est "Searching" avec un cadre de visée animé subtilement
**And** le texte d'instruction "Pointez vers la boîte du médicament" est affiché en grand (Outfit)

**Given** la caméra détecte un code-barres dans le cadre de visée
**When** la mise au point est réussie
**Then** l'état passe à "Focused" avec un retour haptique (vibration courte) (UX-DR1)
**And** le cadre de visée change de couleur vers le Vert Santé (#0B8E71)
**And** le code-barres est lu et décodé en moins de 1.5 seconde (NFR2, FR1)

**Given** aucun code-barres n'est détecté après 5 secondes
**When** le système bascule en mode OCR
**Then** un message "Pas de code-barres ? Pointez vers le nom du médicament" s'affiche
**And** le moteur OCR tente de lire le nom du médicament imprimé sur la boîte (FR2)

**Given** le scan (code-barres ou OCR) identifie un texte exploitable
**When** l'état passe à "Processing"
**Then** un Skeleton Loader gris s'affiche pour la fiche résultat (UX-DR1, UX-DR7)
**And** la requête de matching est envoyée (vers Supabase ou cache local)

**Given** l'utilisateur n'a pas de réseau et le médicament n'est pas en cache local
**When** le matching échoue
**Then** un message "Ce médicament n'a pas pu être identifié en mode hors-ligne. Réessayez avec une connexion." s'affiche

---

### Story 1.6: Fiche Résultat "Medical Pill" & Matching Notice

As a **utilisateur Tiba (Aminata)**,
I want **voir les informations essentielles du médicament scanné dans une fiche claire et structurée**,
So that **je comprenne rapidement la posologie, les dangers et les indications d'âge pour mon enfant**.

**Acceptance Criteria:**

**Given** le scan a identifié un code-barres ou un texte OCR
**When** la requête de matching trouve une notice certifiée dans la base de données (Supabase ou cache Drift)
**Then** la fiche "Medical Result Pill" s'affiche avec 3 sections fixes (UX-DR3) :
  1. **Posologie** : dosages recommandés (adulte/enfant si disponible)
  2. **Dangers** : contre-indications et effets secondaires principaux
  3. **Âge** : restrictions d'âge et précautions pédiatriques
**And** un bouton lecteur audio TTS (Text-to-Speech) est visible sur la fiche (UX-DR3, NFR17)
**And** la fiche utilise les couleurs et arrondis du Design System (Vert Santé, Sable Chaud, 24px radius)

**Given** le matching est réussi et la fiche est affichée
**When** l'utilisateur appuie sur le bouton TTS
**Then** le contenu des 3 sections est lu à haute voix par le moteur TTS du système
**And** l'utilisateur peut mettre en pause ou arrêter la lecture

**Given** le scan a identifié un code-barres ou un texte OCR
**When** aucune notice correspondante n'est trouvée dans la base de données
**Then** un écran "Médicament non reconnu" s'affiche avec un message rassurant (FR4)
**And** le message suggère : "Ce médicament n'est pas encore dans notre base. Consultez votre pharmacien."
**And** un bouton d'action secondaire "Signaler ce médicament" est disponible

**Given** la fiche est affichée avec succès
**When** l'utilisateur navigue sur la fiche résultat
**Then** la notice consultée est automatiquement sauvegardée dans le cache Drift local
**And** la notice est accessible dans l'onglet "Historique" de la navigation

**Given** la notice est sauvegardée
**When** l'utilisateur consulte l'onglet "Historique"
**Then** la liste des médicaments récemment consultés s'affiche avec le nom, la date de scan, et une miniature
**And** cliquer sur un élément rouvre la fiche "Medical Result Pill" complète (FR3)

---

## Epic 2: Le Pharmacien Digital IA (Le RAG Strict)

**Epic Goal:** Permettre à un utilisateur enregistré de poser des questions vocales ou textuelles sur la notice scannée, tout en le protégeant par un pare-feu anti-diagnostic via un RAG Strict (Température 0.0).

### Story 2.1: Pipeline RAG Strict & Edge Function IA

As a **système Tiba**,
I want **un pipeline RAG backend qui répond exclusivement à partir des notices certifiées avec une température de 0.0**,
So that **aucune hallucination ou information non vérifiée ne puisse être communiquée à un patient**.

**Acceptance Criteria:**

**Given** une notice certifiée est présente dans la base de données Supabase
**When** une requête utilisateur est envoyée à la Supabase Edge Function `ai-query`
**Then** le système effectue un embedding search (pgvector) sur la table des notices
**And** seul le contenu de la notice correspondante est utilisé comme contexte du prompt LLM
**And** la température du modèle est fixée à `0.0` (aucune créativité) (FR8)

**Given** la notice certifiée est fournie comme contexte
**When** le LLM génère une réponse
**Then** la réponse est strictement limitée au contenu de la notice
**And** aucune information externe, supposition ou conseil médical n'est ajouté
**And** le temps de réponse ne dépasse pas 6 secondes au cold start (NFR4)

**Given** une notice est ingérée dans le système pour la première fois
**When** l'opérateur publie la notice via l'Admin (ou via script SQL initial)
**Then** le texte est découpé en chunks, vectorisé via l'embedding model, et stocké dans pgvector (FR22)
**And** la notice est immédiatement interrogeable par le pipeline RAG

**Given** le serveur IA est indisponible
**When** l'utilisateur tente une requête
**Then** un message d'erreur gracieux s'affiche : "Le service IA est temporairement indisponible"
**And** le scanner et les pharmacies de garde restent 100% opérationnels (NFR15)

---

### Story 2.2: Chat Textuel sur la Notice

As a **utilisateur Tiba (Aminata)**,
I want **poser une question écrite sur le médicament que je viens de scanner**,
So that **je puisse comprendre des détails spécifiques de la notice sans avoir à la lire en entier**.

**Acceptance Criteria:**

**Given** l'utilisateur a scanné un médicament et la fiche "Medical Pill" est affichée
**When** il appuie sur le bouton "Poser une question"
**Then** une interface de chat s'ouvre en bas de l'écran (bottom sheet)
**And** le champ de saisie textuel est pré-focalisé avec le clavier ouvert
**And** le nom du médicament est affiché en en-tête du chat comme contexte

**Given** l'utilisateur saisit une question textuelle et appuie sur "Envoyer"
**When** la requête est envoyée au pipeline RAG (Story 2.1)
**Then** un Skeleton Loader s'affiche pendant le traitement (UX-DR7)
**And** la réponse de l'IA apparaît dans une bulle de chat en moins de 3.5 secondes sur 3G (NFR1)
**And** la réponse est basée exclusivement sur la notice du médicament scanné (FR6)

**Given** l'utilisateur pose une question de suivi
**When** la question est envoyée
**Then** le contexte de la conversation précédente est maintenu dans la même session
**And** la réponse reste ancrée sur la même notice certifiée

**Given** le nombre de requêtes IA de l'utilisateur atteint 30 dans l'heure en cours
**When** il tente d'envoyer une nouvelle question
**Then** un message "Vous avez atteint la limite horaire. Réessayez dans quelques minutes." s'affiche (NFR10)

---

### Story 2.3: "Voice Assistant Orb" (Hold-to-Talk)

As a **utilisateur Tiba analphabète ou occupé (Aminata)**,
I want **poser ma question en parlant directement à mon téléphone**,
So that **je n'aie pas besoin de savoir lire ou écrire pour obtenir des informations sur le médicament**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche "Medical Pill" ou dans l'interface de chat
**When** il maintient enfoncé le bouton "Voice Assistant Orb" (UX-DR2)
**Then** le micro s'active immédiatement
**And** une onde sonore dynamique s'affiche sur l'Orb pour indiquer que l'écoute est active
**And** un retour haptique léger confirme l'activation

**Given** l'utilisateur parle tout en maintenant le bouton enfoncé
**When** il relâche le bouton
**Then** l'audio capturé est envoyé au service Speech-to-Text (STT)
**And** le texte transcrit s'affiche dans le chat comme une bulle utilisateur
**And** la requête transcrite est envoyée au pipeline RAG (Story 2.1, FR5)

**Given** le pipeline RAG retourne une réponse textuelle
**When** la réponse est reçue
**Then** le texte de la réponse est automatiquement lu à haute voix via le moteur TTS du système
**And** l'onde sonore de l'Orb s'anime pendant la lecture vocale
**And** le cycle complet (Micro → STT → RAG → TTS) s'exécute en moins de 3.5 secondes sur 3G (NFR1, FR8)

**Given** la transcription STT échoue ou le micro n'est pas disponible
**When** l'erreur se produit
**Then** un message vocal et visuel "Je n'ai pas compris. Réessayez." s'affiche
**And** l'utilisateur peut réessayer immédiatement

**Given** l'utilisateur est analphabète
**When** il utilise exclusivement le mode vocal pour les fonctions critiques (scan + question vocale + réponse vocale)
**Then** aucune étape ne nécessite de lecture ou de saisie de texte à l'écran (NFR17)

---

### Story 2.4: Contexte Patient (Adulte/Enfant/Poids)

As a **utilisateur Tiba (Aminata)**,
I want **indiquer si le médicament est pour un adulte ou un enfant, avec l'âge et le poids estimé**,
So that **l'IA puisse filtrer les informations de la notice pertinentes pour mon cas spécifique**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche "Medical Pill" ou ouvre le chat IA
**When** il appuie sur le bouton "Préciser le patient" (icône profil)
**Then** un formulaire compact s'affiche en bottom sheet avec :
  1. Sélecteur : Adulte / Enfant
  2. Champ âge (numérique, en années ou mois pour les nourrissons)
  3. Champ poids estimé (kg, optionnel)
**And** les valeurs sont pré-remplies avec "Adulte" par défaut (FR9)

**Given** l'utilisateur remplit le contexte patient et confirme
**When** il pose une question au RAG (textuelle ou vocale)
**Then** le contexte patient est injecté dans le prompt RAG comme filtre additionnel
**And** la réponse de l'IA priorise les informations de la notice pertinentes pour le profil (ex: posologie enfant si "Enfant" est sélectionné)

**Given** l'utilisateur a rempli le contexte patient
**When** il scanne un nouveau médicament dans la même session
**Then** le contexte patient précédent est conservé et proposé comme valeur par défaut
**And** l'utilisateur peut le modifier à tout moment

**Given** l'utilisateur ne remplit pas le contexte patient
**When** il pose une question au RAG
**Then** le système retourne les informations générales de la notice sans filtrage

---

### Story 2.5: Pare-feu Anti-Diagnostic & Messages de Sécurité

As a **système Tiba (protection médicale)**,
I want **détecter et bloquer toute requête qui demande un diagnostic, une prescription ou un conseil médical hors notice**,
So that **aucun utilisateur ne puisse confondre Tiba avec un médecin et mettre sa santé en danger**.

**Acceptance Criteria:**

**Given** l'utilisateur pose une question au RAG (vocale ou textuelle)
**When** la requête contient une demande de diagnostic (ex: "Mon enfant a de la fièvre, qu'est-ce qu'il a ?")
**Then** le système bloque la requête AVANT qu'elle n'atteigne le LLM (FR10)
**And** un message de sécurité s'affiche : "⚠️ Tiba ne peut pas poser de diagnostic. Consultez un médecin." (FR11)
**And** le message est également lu à haute voix si le mode vocal est actif

**Given** le système détecte une requête hors périmètre
**When** le message de sécurité s'affiche
**Then** des actions alternatives immédiates sont proposées (FR34) :
  1. "📍 Localiser un médecin à proximité"
  2. "📞 Appeler le SAMU local"
  3. "🏥 Trouver une pharmacie de garde"
**And** chaque bouton est fonctionnel et redirige vers le service approprié

**Given** l'utilisateur pose une question dont la réponse n'existe pas dans la notice
**When** le RAG ne trouve aucun chunk pertinent au-dessus du seuil de similarité
**Then** un message s'affiche : "Cette information n'est pas disponible dans la notice de ce médicament. Consultez votre pharmacien." (FR12)
**And** le système NE FABRIQUE PAS de réponse (température 0.0 + seuil de similarité)

**Given** une requête de prescription est détectée (ex: "Quel médicament donner à mon enfant pour la toux ?")
**When** le pare-feu intervient
**Then** la requête est bloquée avec le message : "Tiba ne peut pas prescrire de médicaments. Seul un médecin peut le faire." (FR10)
**And** l'interaction bloquée est journalisée pour audit (FR24)

---

### Story 2.6: Mode Global IA (Sans Scan)

As a **utilisateur Tiba (Aminata)**,
I want **poser une question à l'IA sans avoir scanné de médicament spécifique**,
So that **je puisse obtenir des informations générales sur un médicament dont je connais le nom**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur l'écran principal de l'application
**When** il accède à l'assistant IA via un bouton d'accès global (ex: FAB ou élément de navigation)
**Then** l'interface de chat IA s'ouvre sans contexte médicament pré-chargé (FR7)
**And** un message d'accueil s'affiche : "Bonjour ! Quel médicament souhaitez-vous connaître ?"

**Given** l'utilisateur saisit ou dicte le nom d'un médicament en mode global
**When** le système recherche le médicament dans la base de données
**Then** si le médicament est trouvé, le contexte de la notice est chargé automatiquement
**And** les questions suivantes sont traitées par le pipeline RAG avec cette notice comme contexte

**Given** l'utilisateur mentionne un médicament introuvable dans la base
**When** la recherche échoue
**Then** un message s'affiche : "Ce médicament n'est pas encore dans notre base. Essayez de scanner la boîte."
**And** un bouton "Scanner maintenant" redirige vers l'onglet Scanner

**Given** l'utilisateur est en mode global
**When** il pose une question sans mentionner de médicament spécifique (ex: "C'est quoi un antibiotique ?")
**Then** le pare-feu détecte l'absence de notice contextuelle
**And** un message s'affiche : "Pour vous aider, indiquez le nom d'un médicament ou scannez sa boîte."

---

### Story 2.7: Audit Logging & Signalement Utilisateur

As a **administrateur Tiba (sécurité médicale)**,
I want **que chaque interaction IA soit journalisée de manière immuable et que les utilisateurs puissent signaler des réponses incorrectes**,
So that **nous puissions auditer la qualité des réponses et détecter les problèmes de sécurité médicale**.

**Acceptance Criteria:**

**Given** un utilisateur pose une question au RAG (textuelle ou vocale)
**When** la réponse est générée et affichée
**Then** l'interaction complète est journalisée dans la table `ai_audit_logs` avec :
  - `user_id` (anonymisé hash)
  - `medication_id` (référence à la notice)
  - `query_text` (question posée)
  - `response_text` (réponse du RAG)
  - `context_patient` (adulte/enfant/âge/poids si fourni)
  - `was_blocked` (boolean si pare-feu activé)
  - `timestamp` (horodatage UTC)
**And** le log est immuable (INSERT ONLY, pas d'UPDATE ni DELETE) (FR24, NFR8)

**Given** les logs d'audit sont créés
**When** 24 mois se sont écoulés
**Then** les logs restent accessibles et ne sont pas purgés automatiquement (NFR8)

**Given** l'utilisateur lit une réponse de l'IA dans le chat
**When** il appuie sur le bouton "⚠️ Signaler cette réponse" (icône drapeau)
**Then** un formulaire rapide s'affiche avec les options :
  1. "Information incorrecte"
  2. "Information dangereuse"
  3. "Autre" (champ libre)
**And** le signalement est enregistré en base avec référence au log d'audit concerné (FR37)

**Given** un signalement est enregistré
**When** l'administrateur consulte le dashboard (Epic 4)
**Then** le signalement apparaît dans la liste avec le contexte complet de l'interaction
**And** un compteur d'alertes non traitées est visible

---

## Epic 3: Le Filet de Sécurité Local (Pharmacies de Garde)

**Epic Goal:** Fournir l'emplacement de la pharmacie de garde physique la plus proche du patient, de façon instantanée, avec ou sans connexion, grâce au stockage local SQLite.

### Story 3.1: Recherche des Pharmacies de Garde par GPS

As a **utilisateur Tiba (Aminata)**,
I want **trouver les pharmacies de garde ouvertes à proximité de ma position actuelle**,
So that **je puisse obtenir mes médicaments rapidement, même la nuit ou un dimanche**.

**Acceptance Criteria:**

**Given** l'utilisateur navigue vers l'onglet "Secours" de la Bottom Navigation Bar
**When** l'écran des pharmacies de garde s'affiche
**Then** le système demande la permission de géolocalisation (si pas encore accordée)
**And** un Skeleton Loader s'affiche pendant le chargement (UX-DR7)

**Given** la permission GPS est accordée et le réseau est disponible
**When** la position de l'utilisateur est obtenue
**Then** une requête PostGIS est envoyée à Supabase pour trouver les pharmacies de garde dans un rayon de 10 km
**And** les résultats s'affichent en moins de 2 secondes (NFR3)
**And** les pharmacies sont triées par distance croissante (FR13)

**Given** les résultats sont affichés
**When** l'utilisateur consulte la liste
**Then** chaque entrée affiche :
  - Le nom de la pharmacie
  - L'adresse
  - La distance estimée (en km)
  - Les horaires de garde actuels
  - Un indicateur visuel "Ouverte maintenant" (Vert Santé) ou "Fermée" (gris)

**Given** la permission GPS est refusée
**When** l'écran tente de charger
**Then** un message explicatif s'affiche : "Activez la localisation pour trouver les pharmacies proches"
**And** un bouton "Ouvrir les paramètres" redirige vers les réglages du téléphone

**Given** aucune pharmacie de garde n'est trouvée dans le rayon de 10 km
**When** les résultats sont vides
**Then** un message s'affiche : "Aucune pharmacie de garde trouvée à proximité. Élargir la recherche ?"
**And** un bouton permet d'étendre le rayon à 25 km

---

### Story 3.2: Affichage Distance & Itinéraire

As a **utilisateur Tiba (Aminata)**,
I want **voir la distance exacte et l'itinéraire vers la pharmacie de garde choisie**,
So that **je puisse m'y rendre sans me perdre, même dans un quartier que je ne connais pas**.

**Acceptance Criteria:**

**Given** l'utilisateur consulte la liste des pharmacies de garde (Story 3.1)
**When** il appuie sur une pharmacie dans la liste
**Then** une fiche détaillée s'affiche avec :
  - Le nom et l'adresse complète
  - Le numéro de téléphone (cliquable pour appeler)
  - La distance précise en km
  - Les horaires de garde détaillés
**And** un bouton "Itinéraire" est visible en bas de la fiche (FR14)

**Given** l'utilisateur appuie sur "Itinéraire"
**When** une application de navigation est disponible sur le téléphone (Google Maps, Waze, etc.)
**Then** l'application de navigation s'ouvre avec la destination pré-remplie (latitude/longitude de la pharmacie)
**And** l'itinéraire est calculé automatiquement depuis la position actuelle

**Given** aucune application de navigation n'est installée
**When** l'utilisateur appuie sur "Itinéraire"
**Then** le navigateur web s'ouvre avec Google Maps en mode web vers la destination

**Given** l'utilisateur est sur la fiche détaillée d'une pharmacie
**When** il appuie sur le numéro de téléphone
**Then** le composeur téléphonique s'ouvre avec le numéro pré-rempli

---

### Story 3.3: Cache Local des Pharmacies (Mode Hors-ligne)

As a **utilisateur Tiba en zone à couverture instable (Aminata)**,
I want **consulter la liste des pharmacies de garde même sans connexion internet**,
So that **je puisse trouver une pharmacie de garde en cas d'urgence nocturne sans réseau**.

**Acceptance Criteria:**

**Given** l'utilisateur a consulté les pharmacies de garde au moins une fois en ligne
**When** les résultats sont affichés avec succès
**Then** la liste complète des pharmacies (noms, adresses, coordonnées GPS, horaires) est automatiquement sauvegardée dans la base Drift locale

**Given** l'utilisateur est hors connexion
**When** il navigue vers l'onglet "Secours"
**Then** les pharmacies de garde depuis le cache local s'affichent en moins de 0.5 seconde (NFR3)
**And** un indicateur "Données hors-ligne (mises à jour le [date])" est visible en haut de la liste
**And** les pharmacies restent consultables pendant au moins 7 jours sans connexion (NFR16, FR15)

**Given** l'utilisateur est hors connexion et consulte le cache
**When** il appuie sur une pharmacie
**Then** la fiche détaillée s'affiche avec toutes les informations cachées
**And** le bouton "Itinéraire" fonctionne si une app de navigation hors-ligne est installée
**And** le numéro de téléphone reste cliquable pour appeler

**Given** la connexion réseau est rétablie
**When** l'utilisateur navigue vers l'onglet "Secours"
**Then** le cache local est silencieusement mis à jour avec les données fraîches de Supabase
**And** les nouvelles pharmacies ou mises à jour d'horaires sont reflétées

**Given** le cache a plus de 7 jours
**When** l'utilisateur consulte les pharmacies hors-ligne
**Then** un avertissement s'affiche : "Ces données datent de plus de 7 jours. Connectez-vous pour les actualiser."
**And** les données restent affichées mais avec un badge d'avertissement jaune

---

### Story 3.4: Suggestion Automatique Post-Scan/IA

As a **système Tiba**,
I want **suggérer automatiquement une pharmacie de garde après un scan ou une interaction IA**,
So that **l'utilisateur puisse se procurer le médicament identifié sans effort supplémentaire**.

**Acceptance Criteria:**

**Given** l'utilisateur a scanné un médicament et la fiche "Medical Pill" est affichée (Epic 1)
**When** le résultat du scan est affiché avec succès
**Then** un encart discret "📍 Pharmacie de garde la plus proche" apparaît sous la fiche résultat
**And** l'encart affiche le nom et la distance de la pharmacie de garde la plus proche (FR16)
**And** l'encart utilise le style du Design System (fond Sable, bordure Vert Santé, 24px radius)

**Given** l'utilisateur a posé une question IA et reçu une réponse (Epic 2)
**When** la réponse du RAG est affichée dans le chat
**Then** une suggestion contextuelle "Besoin du médicament ? 📍 Pharmacie de garde à [X] km" apparaît sous la réponse
**And** le lien est cliquable et redirige vers la fiche de la pharmacie (Story 3.2)

**Given** le pare-feu anti-diagnostic a bloqué une requête (Story 2.5)
**When** les actions alternatives s'affichent
**Then** le bouton "🏥 Trouver une pharmacie de garde" utilise les données de l'Epic 3 pour afficher directement la plus proche
**And** l'utilisateur n'a pas besoin de naviguer manuellement vers l'onglet "Secours"

**Given** l'utilisateur est hors connexion
**When** la suggestion de pharmacie apparaît après un scan (cache local)
**Then** la pharmacie suggérée provient du cache Drift local
**And** la mention "(données hors-ligne)" est visible à côté de la distance

---

## Epic 4: La Tour de Contrôle Opérationnelle (Web Admin Dashboard)

**Epic Goal:** Permettre aux opérateurs Tiba de saisir les nouvelles notices officielles et de mettre à jour les stocks et horaires des pharmacies dans un portail Next.js connecté à Supabase.

### Story 4.1: Scaffold Admin Dashboard & Authentification Opérateur

As a **opérateur Tiba (administrateur)**,
I want **accéder à un portail web sécurisé réservé aux administrateurs**,
So that **je puisse gérer la base pharmaceutique sans risque d'accès non autorisé**.

**Acceptance Criteria:**

**Given** le projet Next.js `apps/tiba-admin/` est initialisé via `npx create-next-app -e with-supabase`
**When** le développeur ouvre le projet
**Then** la structure contient les dossiers `app/`, `components/`, et `lib/`
**And** Supabase Auth est configuré avec le support email/mot de passe pour les opérateurs
**And** le thème utilise les couleurs Tiba (Vert Santé, Sable Chaud) adaptées au contexte Desktop

**Given** un opérateur non authentifié accède à l'URL du dashboard
**When** la page se charge
**Then** l'écran de connexion s'affiche avec les champs email + mot de passe
**And** aucune autre page n'est accessible sans authentification (middleware Next.js)

**Given** un opérateur saisit des identifiants valides
**When** la connexion via Supabase Auth réussit
**Then** le tableau de bord principal s'affiche avec une sidebar de navigation :
  - "Notices" (gestion de la base pharmaceutique)
  - "Pharmacies" (gestion des pharmacies de garde)
  - "Signalements" (alertes utilisateurs - FR37, lié à Story 2.7)
**And** le JWT de session est stocké en cookie HTTP-only sécurisé (TLS 1.3, NFR5)

**Given** un utilisateur avec un rôle non-administrateur tente d'accéder au dashboard
**When** la vérification du rôle échoue
**Then** l'accès est refusé avec un message "Accès non autorisé"
**And** la tentative est journalisée

**Given** la session de l'opérateur expire
**When** il tente une action sur le dashboard
**Then** il est redirigé vers la page de connexion avec un message "Session expirée"

---

### Story 4.2: Gestion de la Base Pharmaceutique (CRUD Notices)

As a **opérateur Tiba (administrateur)**,
I want **consulter, ajouter, modifier et retirer des notices médicamenteuses de la base de données**,
So that **la base pharmaceutique reste à jour avec les dernières informations certifiées**.

**Acceptance Criteria:**

**Given** l'opérateur est connecté et navigue vers la section "Notices"
**When** la page s'affiche
**Then** un tableau paginé liste toutes les notices avec :
  - Nom du médicament
  - Code-barres (si disponible)
  - Date d'ajout
  - Date de dernière modification
  - Statut (Actif / Retiré)
**And** un champ de recherche par nom ou code-barres est disponible en haut (FR29)

**Given** l'opérateur clique sur "Ajouter une notice"
**When** le formulaire de création s'affiche
**Then** les champs suivants sont disponibles :
  - Nom du médicament (obligatoire)
  - Code-barres (optionnel)
  - Texte complet de la notice (obligatoire, éditeur riche)
  - Source officielle (obligatoire, URL ou référence)
  - Photos de la boîte (upload multiple)
**And** le bouton "Publier" déclenche l'ingestion dans pgvector (vectorisation automatique) (FR31, FR22)

**Given** l'opérateur publie une nouvelle notice
**When** la sauvegarde réussit
**Then** le texte de la notice est découpé en chunks et vectorisé automatiquement via une Edge Function
**And** la notice est immédiatement interrogeable par le RAG sur l'app mobile
**And** un toast de confirmation "Notice publiée avec succès" s'affiche

**Given** l'opérateur clique sur "Modifier" pour une notice existante
**When** il met à jour les champs et sauvegarde
**Then** les anciennes données sont archivées (versionnage)
**And** les nouveaux embeddings sont recalculés (FR31)

**Given** l'opérateur clique sur "Retirer" pour une notice
**When** la confirmation est validée
**Then** le statut passe à "Retiré" (pas de suppression physique, soft delete)
**And** la notice n'apparaît plus dans les résultats de scan de l'app mobile
**And** les logs d'audit existants référençant cette notice restent intacts

---

### Story 4.3: Édition des Fiches Produit avec Synchronisation Temps Réel

As a **opérateur Tiba**,
I want **créer et éditer des fiches produit avec photos qui se synchronisent immédiatement sur l'app mobile**,
So that **les patients aient accès aux informations les plus récentes dès leur publication**.

**Acceptance Criteria:**

**Given** l'opérateur crée ou modifie une fiche produit (Story 4.2)
**When** il uploade des photos de la boîte du médicament
**Then** les images sont stockées dans Supabase Storage avec compression automatique
**And** un aperçu miniature est généré pour l'affichage dans la liste

**Given** l'opérateur publie ou met à jour une fiche produit
**When** la sauvegarde est confirmée
**Then** la modification est immédiatement visible sur l'app mobile via Supabase Realtime (FR30)
**And** les utilisateurs mobiles qui consultent cette notice en temps réel voient la mise à jour sans rafraîchir manuellement

**Given** l'opérateur modifie le texte de la notice
**When** la sauvegarde est confirmée
**Then** les embeddings pgvector sont recalculés automatiquement en arrière-plan
**And** un indicateur "Réindexation en cours..." s'affiche temporairement
**And** les nouvelles réponses du RAG reflètent le contenu mis à jour

**Given** l'opérateur uploade une image invalide (format non supporté, taille > 5 Mo)
**When** l'upload échoue
**Then** un message d'erreur clair s'affiche avec les formats acceptés (JPG, PNG, WebP) et la taille maximale

---

### Story 4.4: Gestion des Pharmacies de Garde & Disponibilités

As a **opérateur Tiba**,
I want **mettre à jour les horaires de garde et les disponibilités de médicaments des pharmacies**,
So that **les patients trouvent des informations fiables et à jour sur les pharmacies ouvertes**.

**Acceptance Criteria:**

**Given** l'opérateur navigue vers la section "Pharmacies"
**When** la page s'affiche
**Then** un tableau paginé liste toutes les pharmacies enregistrées avec :
  - Nom de la pharmacie
  - Ville / Quartier
  - Statut de garde actuel (De garde / Normale)
  - Prochaine date de garde
**And** un champ de recherche et des filtres par ville sont disponibles (FR30b)

**Given** l'opérateur clique sur "Modifier" pour une pharmacie
**When** le formulaire d'édition s'affiche
**Then** les champs suivants sont éditables :
  - Nom, adresse, coordonnées GPS (latitude/longitude)
  - Numéro de téléphone
  - Planning de garde (calendrier avec sélection de dates/plages horaires)
  - Liste de disponibilité des médicaments (optionnel)

**Given** l'opérateur met à jour le planning de garde
**When** la sauvegarde est confirmée
**Then** les nouvelles dates de garde sont immédiatement reflétées sur l'app mobile (Supabase Realtime)
**And** le cache Drift local des utilisateurs sera mis à jour lors de leur prochaine synchronisation

**Given** l'opérateur ajoute une nouvelle pharmacie
**When** il remplit le formulaire et publie
**Then** la pharmacie apparaît dans les résultats de recherche géolocalisée de l'app mobile
**And** les coordonnées GPS sont validées (format latitude/longitude correct)

**Given** l'opérateur modifie la disponibilité d'un médicament dans une pharmacie
**When** il active ou désactive un médicament
**Then** l'information de stock est disponible dans la suggestion de pharmacie post-scan (Story 3.4)
**And** les médicaments marqués "en rupture" ne sont pas suggérés en priorité

---

## Epic 5: Monétisation & Quotas (Le Moteur Économique)

**Epic Goal:** Gérer rigoureusement la limite des scans Freemium gratuits et intégrer les paiements Mobile Money d'Afrique Centrale pour activer la version Premium.

### Story 5.1: Compteur de Quota Freemium & Affichage

As a **utilisateur Tiba (Aminata)**,
I want **voir combien de scans gratuits il me reste ce mois-ci**,
So that **je puisse planifier mes utilisations et décider si je veux passer en Premium**.

**Acceptance Criteria:**

**Given** l'utilisateur est inscrit avec un compte Freemium (par défaut)
**When** il ouvre l'application
**Then** un compteur discret "X scans restants ce mois" est visible sur l'écran Scanner
**And** le compteur affiche le quota restant sur le total mensuel (ex: "2/3 restants") (FR36, FR18)

**Given** l'utilisateur effectue un scan avec succès (code-barres ou OCR)
**When** le médicament est identifié
**Then** le compteur de scans est décrémenté de 1
**And** le nouveau total est mis à jour visuellement en temps réel

**Given** le compteur atteint 1 scan restant
**When** l'utilisateur consulte l'écran Scanner
**Then** un avertissement discret en jaune s'affiche : "Dernier scan gratuit ce mois"
**And** un lien "Passer en Premium" est visible sous l'avertissement

**Given** le premier jour d'un nouveau mois calendaire
**When** l'utilisateur ouvre l'application
**Then** le compteur Freemium est réinitialisé au quota mensuel complet
**And** aucune notification intrusive n'est affichée

**Given** l'utilisateur est en mode Premium
**When** il consulte l'écran Scanner
**Then** le compteur de quota n'est pas affiché (scans illimités)
**And** un badge "Premium ✨" remplace le compteur

---

### Story 5.2: Paywall & Transition Freemium → Premium

As a **utilisateur Tiba (Aminata)**,
I want **comprendre clairement pourquoi je suis bloquée et comment débloquer les scans illimités**,
So that **je puisse décider rapidement de passer en Premium si j'en ai besoin**.

**Acceptance Criteria:**

**Given** l'utilisateur Freemium a épuisé son quota de scans mensuels (compteur = 0)
**When** il tente d'effectuer un nouveau scan
**Then** l'écran de scan est remplacé par un écran de paywall (FR20)
**And** l'écran de paywall affiche :
  - Un message empathique : "Vous avez utilisé vos 3 scans gratuits ce mois."
  - Les avantages Premium (scans illimités, questions IA illimitées, priorité support)
  - Le prix de l'abonnement mensuel
  - Un bouton CTA prominent "Passer en Premium" (Vert Santé)
  - Un lien secondaire "Revenir le mois prochain" pour fermer le paywall

**Given** l'utilisateur Freemium bloqué appuie sur "Passer en Premium"
**When** l'écran de paiement s'affiche
**Then** il est redirigé vers le flux de paiement Mobile Money (Story 5.3)

**Given** l'utilisateur Freemium bloqué choisit "Revenir le mois prochain"
**When** il ferme le paywall
**Then** il est redirigé vers l'écran principal avec les fonctionnalités non liées au scan toujours accessibles (Historique, Pharmacies de Garde, Chat IA sur notices déjà scannées)

**Given** l'utilisateur souscrit à Premium depuis le paywall
**When** le paiement est confirmé (Story 5.3)
**Then** le paywall disparaît immédiatement
**And** le scanner redevient actif sans limite
**And** le badge "Premium ✨" apparaît

---

### Story 5.3: Intégration Paiement Mobile Money

As a **utilisateur Tiba (Aminata)**,
I want **payer mon abonnement Premium via Mobile Money (Orange, Airtel, Moov)**,
So that **je puisse souscrire facilement avec le moyen de paiement que j'utilise au quotidien**.

**Acceptance Criteria:**

**Given** l'utilisateur appuie sur "Passer en Premium" (depuis le paywall ou les paramètres)
**When** l'écran de paiement s'affiche
**Then** les 3 opérateurs Mobile Money sont proposés :
  1. Orange Money (logo + couleur)
  2. Airtel Money (logo + couleur)
  3. Moov Money (logo + couleur)
**And** le montant de l'abonnement est clairement affiché (FR19)

**Given** l'utilisateur sélectionne un opérateur Mobile Money
**When** il saisit son numéro de téléphone Mobile Money
**Then** une requête de paiement est envoyée au fournisseur via l'API de paiement intégrée (Edge Function Supabase)
**And** un Skeleton Loader avec le message "Paiement en cours..." s'affiche (UX-DR7)

**Given** le paiement est validé côté opérateur
**When** la confirmation est reçue par le backend
**Then** le statut de l'utilisateur passe à "Premium" dans Supabase
**And** un écran de confirmation "Bienvenue en Premium ! 🎉" s'affiche
**And** l'expiration de l'abonnement est fixée à J+30 jours

**Given** le paiement échoue (solde insuffisant, timeout, erreur réseau)
**When** l'erreur est reçue
**Then** un message d'erreur clair s'affiche en Rouge Corail : "Le paiement n'a pas abouti. Vérifiez votre solde et réessayez."
**And** l'utilisateur reste en mode Freemium
**And** aucun montant n'est débité

**Given** l'abonnement Premium arrive à expiration (J+30)
**When** le système vérifie le statut
**Then** l'utilisateur repasse automatiquement en mode Freemium
**And** un message push notification l'informe : "Votre abonnement Premium a expiré. Renouvelez pour continuer."
**And** le compteur Freemium est réinitialisé

---

### Story 5.4: Historique de Paiements & Gestion d'Abonnement

As a **utilisateur Tiba (Aminata)**,
I want **consulter mes paiements passés et le statut de mon abonnement**,
So that **je puisse garder le contrôle de mes dépenses et savoir quand mon abonnement expire**.

**Acceptance Criteria:**

**Given** l'utilisateur navigue vers les paramètres de son profil
**When** il appuie sur "Mon abonnement"
**Then** l'écran affiche :
  - Statut actuel : Freemium / Premium
  - Si Premium : date d'expiration de l'abonnement en cours
  - Si Freemium : quota de scans restant ce mois
  - Un bouton "Passer en Premium" (si Freemium) ou "Renouveler" (si Premium expiré)

**Given** l'utilisateur appuie sur "Historique des paiements"
**When** la liste s'affiche
**Then** chaque entrée contient (FR35) :
  - Date du paiement
  - Montant payé
  - Opérateur Mobile Money utilisé (Orange/Airtel/Moov)
  - Statut (Réussi / Échoué / Remboursé)
  - Période couverte (ex: "15 mars - 14 avril 2026")

**Given** l'historique est vide (nouvel utilisateur)
**When** la liste s'affiche
**Then** un message "Aucun paiement enregistré" s'affiche
**And** un bouton "Découvrir Premium" redirige vers les avantages

**Given** l'utilisateur est Premium et son abonnement expire dans 3 jours
**When** il ouvre l'application
**Then** un bandeau discret s'affiche en haut : "Votre abonnement expire dans 3 jours. Renouvelez maintenant."
**And** le bandeau contient un bouton "Renouveler" qui ouvre le flux Mobile Money (Story 5.3)

---

## Epic 6: Le Pivot Licorne "Data SaaS" (Analytique et Insights)

**Epic Goal:** Agréger et expurger toutes les données individuelles des scans afin d'offrir des alertes prédictives et un puissant tableau de bord de macro-tendances médicales pour les institutions de santé en B2B.

### Story 6.1: Pipeline d'Anonymisation Irréversible

As a **système Tiba (conformité données)**,
I want **anonymiser de manière irréversible toutes les données d'utilisation avant leur agrégation**,
So that **aucune donnée personnelle ne puisse jamais être récupérée à partir des datasets B2B**.

**Acceptance Criteria:**

**Given** un utilisateur effectue un scan ou une interaction IA
**When** les données brutes sont collectées
**Then** un pipeline d'anonymisation s'exécute automatiquement (Edge Function ou Trigger PostgreSQL) (FR23)
**And** les champs suivants sont anonymisés de manière irréversible :
  - `user_id` → hash SHA-256 salé non réversible
  - `phone_number` → complètement supprimé
  - `precise_location` → arrondi à la granularité quartier/commune (pas de GPS exact)
  - `patient_context` → supprimé (seul le type adulte/enfant est conservé sans âge ni poids)

**Given** les données anonymisées sont stockées
**When** un analyste tente de recouper les données
**Then** il est impossible de reconstituer l'identité d'un utilisateur individuel (NFR9)
**And** les données anonymisées ne contiennent aucun identifiant direct ou indirect

**Given** le pipeline d'anonymisation est en place
**When** les données transitent vers la table d'agrégation `anonymous_scan_events`
**Then** les données brutes originales ne sont jamais copiées dans cette table
**And** seules les données déjà anonymisées y sont insérées

**Given** un audit de conformité est demandé
**When** les tables d'anonymisation sont inspectées
**Then** la documentation technique du processus d'anonymisation est disponible
**And** les tests unitaires prouvent l'irréversibilité du hachage

---

### Story 6.2: Agrégation des Données de Scan par Zone & Période

As a **système Tiba (Data Pipeline)**,
I want **agréger les données de scan anonymisées par zone géographique et par période temporelle**,
So that **les tendances de consommation pharmaceutique puissent être analysées sans compromettre la vie privée des patients**.

**Acceptance Criteria:**

**Given** des scans anonymisés sont accumulés dans `anonymous_scan_events`
**When** un job d'agrégation s'exécute (quotidien ou hebdomadaire via Supabase Edge Function CRON)
**Then** les données sont agrégées par :
  - Zone géographique (ville / quartier / commune)
  - Période temporelle (jour / semaine / mois)
  - Médicament (nom ou catégorie thérapeutique)
**And** les résultats sont stockés dans la table `aggregated_scan_metrics` (FR26)

**Given** les données agrégées sont créées
**When** un analyste consulte les métriques
**Then** chaque entrée contient :
  - `zone_id` (identifiant géographique)
  - `period_start` / `period_end` (plage temporelle)
  - `medication_id` (référence médicament)
  - `scan_count` (nombre total de scans)
  - `unique_scanners_count` (nombre de hashes uniques — pas de noms)

**Given** le pipeline d'agrégation a traité les données
**When** le taux de complétude est vérifié
**Then** au moins 95% des scans de la période sont représentés dans les agrégats (NFR21)
**And** les événements manquants (< 5%) sont documentés et traçables

**Given** les données agrégées couvrent une période de 30 jours ou plus
**When** le volume dépasse 10 000 scans agrégés
**Then** les performances de requête restent sous 2 secondes pour les requêtes analytiques standard

---

### Story 6.3: Dashboard B2B Analytique

As a **opérateur B2B (Ministère de la Santé, OMS, laboratoire pharmaceutique)**,
I want **consulter un tableau de bord montrant les tendances de consommation pharmaceutique par zone et par période**,
So that **je puisse prendre des décisions d'allocation de ressources basées sur des données réelles**.

**Acceptance Criteria:**

**Given** un opérateur B2B est authentifié sur le Web Admin Dashboard (Epic 4) avec un rôle "Analytique"
**When** il navigue vers la section "Analytics"
**Then** le tableau de bord affiche (FR27) :
  - Une carte thermique (heatmap) montrant l'intensité des scans par zone géographique
  - Un graphique temporel (line chart) montrant l'évolution des scans sur les 30/90/365 derniers jours
  - Un classement des top 10 médicaments les plus scannés par zone
  - Des filtres par : période, zone géographique, catégorie thérapeutique

**Given** l'opérateur B2B applique un filtre (ex: "Douala, derniers 30 jours")
**When** le dashboard se rafraîchit
**Then** tous les widgets se mettent à jour avec les données filtrées
**And** le temps de chargement ne dépasse pas 3 secondes

**Given** l'opérateur B2B souhaite exporter les données
**When** il clique sur "Exporter"
**Then** un fichier CSV est généré avec les données agrégées filtrées
**And** le fichier ne contient aucune donnée personnelle (uniquement des agrégats anonymisés)
**And** un filigrane "Tiba Analytics — Confidentiel" est ajouté au fichier

**Given** un opérateur B2B tente d'accéder au dashboard sans le rôle "Analytique"
**When** la vérification du rôle échoue
**Then** l'accès est refusé avec "Vous n'avez pas les droits pour consulter les analytiques"

---

### Story 6.4: Alertes Prédictives (Pics Anormaux)

As a **opérateur B2B (responsable de veille sanitaire)**,
I want **recevoir une alerte automatique lorsqu'un pic anormal de recherches pour un médicament est détecté dans une zone**,
So that **je puisse anticiper une pénurie, une épidémie potentielle, ou un usage détourné**.

**Acceptance Criteria:**

**Given** le pipeline d'agrégation (Story 6.2) calcule les métriques quotidiennement
**When** le nombre de scans pour un médicament dans une zone dépasse 2x la moyenne mobile des 30 derniers jours
**Then** une alerte "Pic Anormal Détecté" est générée automatiquement (FR28)
**And** l'alerte contient :
  - Nom du médicament
  - Zone géographique concernée
  - Volume de scans actuel vs moyenne historique
  - Taux d'augmentation (ex: "+245%")
  - Date de début du pic

**Given** une alerte prédictive est générée
**When** l'opérateur B2B consulte le dashboard Analytics
**Then** un badge de notification rouge "X alertes" apparaît dans la sidebar
**And** la section "Alertes" liste toutes les alertes actives triées par sévérité

**Given** l'opérateur B2B ouvre une alerte prédictive
**When** les détails s'affichent
**Then** un graphique montre la courbe de scans vs la moyenne mobile sur 30 jours
**And** des boutons d'action sont disponibles :
  1. "Marquer comme traité" (archiver l'alerte)
  2. "Exporter le rapport" (PDF avec le contexte complet)
  3. "Créer une notification" (envoyer un message aux pharmacies de la zone)

**Given** le système détecte un pic sur un médicament à usage détourné connu (ex: codéine)
**When** l'alerte est générée
**Then** elle est marquée avec un niveau de sévérité "Critique" (rouge)
**And** un email automatique est envoyé à l'administrateur principal du compte B2B

**Given** aucun pic anormal n'est détecté pendant 30 jours
**When** l'opérateur consulte les alertes
**Then** un message "Aucune anomalie détectée dans les 30 derniers jours" s'affiche
**And** un résumé des tendances normales est proposé
