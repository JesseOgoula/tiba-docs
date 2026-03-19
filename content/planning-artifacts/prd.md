---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - Tiba_Product_Brief.md
  - Tiba_Planification_MVP.md
  - brainstorming/brainstorming-session-2026-03-15-1513.md
  - brainstorming/analyse-marche-8-secteurs-afrique.md
workflowType: 'prd'
classification:
  projectType: mobile_app
  domain: healthcare
  complexity: high
  projectContext: brownfield
---

# Product Requirements Document - billionaire project (Tiba)

**Author:** jesse
**Date:** 2026-03-18

## Executive Summary

Tiba transforme l'angoisse médicale liée à la complexité des traitements en réassurance immédiate pour les familles d'Afrique Centrale. L'application mobile cible le besoin critique d'information fiable et d'accès aux soins en urgence. Elle associe un module de scan médicamenteux à un assistant vocal strict, garantissant la sécurité d'utilisation à domicile, tout en facilitant l'accès physique aux médicaments via la géolocalisation des pharmacies de garde.

### What Makes This Special

Ce produit se distingue par la fusion d'une UX conversationnelle fluide (Scanner + Parler) et d'un pare-feu médical absolu (architecture RAG restreignant l'IA à la restitution stricte des notices certifiées pour éviter tout diagnostic). L'intégration d'une boucle transactionnelle locale (Click & Collect en pharmacie de garde) convertit l'information en action immédiate. L'insight fondamental du projet réside dans sa monétisation : ce modèle B2C freemium à forte rétention agit comme un moteur d'acquisition, générant organiquement la première base de données complète des habitudes de consommation pharmaceutique du dernier kilomètre, modélisable et monétisable en SaaS B2B auprès des institutions mondiales de la santé.

## Project Classification

- **Project Type:** Application Mobile B2C + Dashboard SaaS B2B
- **Domain:** Santé (Healthcare) & E-Pharmacie
- **Complexity:** Haute (Contraintes légales, données médicales sensibles, sécurité RAG de l'IA)
- **Project Context:** Brownfield (Évolution structurée à partir d'une phase de vision)

## Success Criteria

### User Success

*   **Réduction de l'anxiété :** Les parents obtiennent une réponse vocale rassurante et stricte sur la notice du médicament de leur enfant en moins de 10 secondes.
*   **Accès Physique Garanti :** Localisation et indication claire d'une pharmacie de garde (ou ouverte 24/7) dans le périmètre proche en moins de 3 actions.
*   **Accessibilité Universelle :** L'interaction vocale complète permet à tous les profils (même avec une faible littératie) de comprendre facilement les dosages complexes et les contre-indications.

### Business Success

*   **Adoption & Rétention (MVP) :** Atteindre 10 000 utilisateurs actifs mensuels (MAU) sur le bassin de lancement, avec une fréquence de 3 scans/requêtes par mois.
*   **Viabilité Immédiate (Cashflow) :** Taux de conversion de 5% vers le micro-abonnement B2C (Premium Voice à 500 FCFA/mois) après les scans gratuits initiaux.
*   **Objectif Licorne (SaaS B2B) :** Signature d'un premier "Pilote Data Analytics" avec une ONG, un Ministère de la Santé, ou une Big Pharma dans les 18 mois suivant le lancement.

### Technical Success

*   **Zéro Hallucination Médicale :** Le taux d'erreur du modèle RAG sur la lecture des notices doit être strictement de 0%. Toute requête hors spectre (ex: demande de diagnostic) doit déclencher le filet de sécurité logiciel "Consultez un médecin".
*   **Disponibilité Critique :** Uptime de 99.9% pour la base de données et l'API des pharmacies, un point non négociable pour les situations d'urgence nocturnes.
*   **Temps de latence vocal :** Traitement complet de la requête vocale (Microphone -> IA -> Voix générée) en moins de 3.5 secondes, même sur les réseaux cellulaires lents (3G).

### Measurable Outcomes

*   Volume de scans anti-faux et lectures vocales documentés quotidiennement.
*   Taux de clics (CTR) vers l'annuaire "Pharmacies de Garde" après un scan.
*   Volume (en téraoctets) de données comportementales et sanitaires structurées accumulées par trimestre.

## Product Scope

### MVP - Minimum Viable Product

*   Scan de code-barres / Numérisation intelligente des boîtes de médicaments.
*   Assistant expert (Chat & Vocal) restreint par architecture RAG stricte sur la base de données des notices officielles.
*   Algorithme pré-scan de contexte (Qui est le patient adulte/enfant ? Âge ?).
*   Annuaire intelligent, géolocalisé et automatisé des pharmacies de garde.
*   Intégration paywall Mobile Money (Airtel Money, Moov, Orange, etc.) pour le modèle Premium.

### Growth Features (Post-MVP)

*   Mise en place de l'API B2B 'Pharmacie' pour l'affichage en direct des stocks et du Click & Collect complet.
*   Carnet de santé familial numérique avec profils rattachés.
*   Alertes intelligentes de rappels de prise de médicaments.

### Vision (Future)

*   Déploiement du **"Pharma Analytics Dashboard"** continental. Devenir l'application d'information sanitaire prédictive de référence.

## User Journeys

**1. Aminata, Mère Inquiète (Primary User - Core Experience / Succès)**
*Situation :* Il est 3h du matin. Son fils de 4 ans a une forte fièvre. Elle n'a qu'une boîte de "Doliprane 1000" adulte dans son placard.
*Action :* Elle ouvre Tiba, scanne le code-barres de la boîte.
*Climax (Point culminant) :* L'application affiche la notice. Elle clique sur l'icône micro et demande à l'IA : "Puis-je couper ce comprimé en deux pour mon garçon de 16kg ?". L'IA analyse strictement la notice locale et répond vocalement : "Attention. Ce dosage est réservé aux adultes (plus de 50kg). Ne pas donner à cet enfant."
*Résolution :* L'application lui suggère immédiatement les pharmacies de garde autour d'elle disposant de sirop pédiatrique. Aminata réserve le sirop via "Click & Collect" et part rassurée.

**2. Marc, Père Connecté (Primary User - Edge Case / Sécurité Légale)**
*Situation :* Marc cherche à comprendre un symptôme chez sa fille de 2 ans qui tousse sec depuis 3 jours.
*Action :* Il ouvre l'application, sélectionne le chat vocal direct (sans scanner de produit) et demande : "Ma fille tousse beaucoup et a un peu chaud, quel sirop ou antibiotique je dois acheter ?"
*Climax :* Le système détecte une tentative de "diagnostic" ou de "prescription", ce qui est hors limites.
*Résolution :* Le pare-feu RAG bloque la requête. L'IA lui répond calmement : "Je ne suis pas habilitée à poser un diagnostic. Veuillez consulter un médecin. Voulez-vous que je vous affiche les cliniques et pharmacies ouvertes à proximité ?"

**3. Équipe Opérationnelle Tiba (Internal User - Operations & Data Entry)**
*Situation :* Il faut ajouter de nouveaux médicaments dans la base et mettre à jour les stocks des pharmacies.
*Action :* L'opérateur utilise le "Web Admin Dashboard" (Backoffice) depuis son ordinateur.
*Climax :* Il vérifie par téléphone la disponibilité du Doliprane Enfant et du Sirop Pédiatrique.
*Résolution :* L'opérateur met à jour les disponibilités dans l'application instantanément. Aminata (Journey 1) voit la pharmacie de garde garantie avec le stock vérifié.

**4. Sanofi Africa / ONG Sanitaire (API / B2B Consumer - Modèle Licorne)**
*Situation :* Un directeur des opérations souhaite anticiper les épidémies saisonnières en Afrique Centrale.
*Action :* Il se connecte au luxueux "Pharma Analytics SaaS Dashboard" (accès B2B).
*Climax :* Il visualise une carte de chaleur (heatmap) : "Alerte : Pic anormal de scans de notices d'antipaludiques à Port-Gentil depuis 48h".
*Résolution :* Il ordonne un réapprovisionnement massif et anticipé vers cette zone, évitant une rupture de stock mortelle et prouvant le ROI ultime du système.

### Journey Requirements Summary

*   **App Mobile B2C :** Scanner OCR, module Voice-to-Text robuste, système de "Soft-Ban" des requêtes de diagnostic médical directes.
*   **App Mobile B2C (Client) :** Scanner OCR, module Voice-to-Text robuste, système de "Soft-Ban" des requêtes de diagnostic médical directes, géolocalisation dynamique.
*   **Web Admin Dashboard (Backoffice) :** Interface web dédiée pour l'équipe Tiba permettant la saisie de données complexes (nouveaux produits, scan de notices, photos) et la mise à jour des stocks des pharmacies en temps réel.
*   **Infrastructure B2B Data :** Data warehouse solide pour anonymiser et remonter la data des scans vers un dashboard d'Analytics B2B.

## Domain-Specific Requirements

### Compliance & Regulatory (Conformité Légale)
- **Protection des Données (Privacy) :** Conformité absolue aux lois locales de protection de la vie privée (équivalents locaux du RGPD / HIPAA). Anonymisation totale et irréversible des historiques de scan ou profils avant toute agrégation dans le Data Warehouse B2B.
- **Classification du Produit (Liability) :** Pour éviter d'être régulée et lourdement testée comme un "Dispositif Médical Logiciel" (SaMD), l'application doit légalement rester un strict "outil d'information". Un *disclaimer* biométrique ou une case à cocher obligatoire doit rappeler au lancement que l'application ne remplace pas l'avis d'un professionnel de santé.

### Technical Constraints (Contraintes Techniques)
- **Pare-feu d'Intelligence Artificielle (RAG Strict) :** Le moteur IA doit être construit sur une architecture de *Retrieval-Augmented Generation* avec une température bloquée à 0.0. Interdiction absolue d'inférer, d'inventer ou de croiser des informations pour poser un "diagnostic".
- **Chiffrement de bout en bout :** Toutes les données sensibles du futur carnet de santé familial doivent être chiffrées (au repos et en transit).

### Integration Requirements (Requis d'Intégration)
- **Certification des Données Sources :** Le corpus de texte dans lequel l'IA va puiser ses réponses (les notices) doit provenir exclusivement de fournisseurs officiels (laboratoires, OMS, Ministères). Aucune source web externe ou forum ne doit être ingérée.
- **API Résiliente pour les Pharmacies :** L'intégration Click & Collect doit s'adapter aux réseaux électriques ou internet parfois instables des officines (système asynchrone fonctionnant même par SMS fallback si besoin).

### Risk Mitigations (Gestion des Risques Mortels)
- **Risque : Hallucination de l'IA provoquant un surdosage d'un enfant.**
  - *Mitigation :* L'IA ne lit que la notice certifiée. Si un parent pose une question hors-sujet ou dont la réponse est introuvable sur la boîte, déclenchement du Fallback : "Information introuvable. Veuillez consulter un médecin en urgence."
- **Risque : Indisponibilité Cloud (AWS/GCP) empêchant de trouver une pharmacie de garde la nuit.**
  - *Mitigation :* Mise en cache locale (Edge Storage) sur le téléphone de la base de données statique des urgences médicales et des pharmacies 24/7 au moins une fois par semaine.

## Innovation & Novel Patterns

### Detected Innovation Areas
- **Asymmetric Data Harvesting (Business Model) :** Utilisation d'un assistant vocal B2C Freemium (résolvant l'urgence nocturne d'un parent) comme cheval de Troie éthique pour capturer, structurer et agréger la donnée épidémiologique et de consommation du dernier kilomètre pour la revendre en B2B.
- **Strict-RAG Medical Guardrail (Technologie) :** Transformer le défaut majeur des LLMs (les hallucinations) en avantage en bridant le modèle (Température 0.0) sur un unique document de vérité validé (la notice), créant un "lecteur interactif incassable" au lieu d'un docteur virtuel.

### Market Context & Competitive Landscape
- La majorité des HealthTechs en Afrique Centrale se battent sur la téléconsultation ou la livraison. Tiba disrupte ce marché en se positionnant en amont (la rassurance immédiate au domicile) et en aval (la donnée prédictive de masse pour l'industrie mondiale de la santé).

### Validation Approach
- **Pour le RAG Strict :** Batterie de tests automatisés (Red Teaming) injectant des requêtes trompeuses pour vérifier que l'IA déclenche systématiquement le Fallback de sécurité (taux de réussite exigé : 100%).
- **Pour le B2B Data :** Présenter un prototype de "Dashboard Heatmap" simulé (ex: alertes anti-paludiques) à un acteur cible (OMS, LAB) pour valider immédiatement leur disposition à payer (Price Willingness).

### Risk Mitigation
- **Risque d'acceptation utilisateur :** Les utilisateurs peuvent être frustrés que l'IA refuse de faire un diagnostic ou de prescrire un traitement.
  - *Mitigation :* L'UX doit clairement scénographier son rôle ("Expert en notices") et compenser l'éventuelle frustration par l'immédiateté de la géolocalisation de la pharmacie de garde disponible via Click & Collect.

## Mobile App Specific Requirements

### Project-Type Overview
L'application Tiba est un pur produit *mobile-first*. Elle sera développée en cross-platform (Flutter) pour garantir une couverture totale sur iOS et Android, avec une obsession technique pour les contraintes d'infrastructure locales (réseaux cellulaires lents, batteries nomades, stockage limité).

### Technical Architecture Considerations

#### Platform Requirements
- **Framework Core :** Développement en Flutter pour un time-to-market accéléré avec une base de code unifiée.
- **Compatibilité Rétroactive :** Support impératif des OS plus anciens régnant sur le marché de l'occasion africain (Android 8+ minimum).
- **Légèreté (Taille APK) :** Le poids de l'application initiale au téléchargement doit être maintenu sous la barre des 30 Mo pour économiser la data des forfaits prépayés.

#### Offline Strategy
- **Cache d'Urgence Local :** Synchronisation silencieuse hebdomadaire en arrière-plan de la base de données de l'annuaire des pharmacies de garde. Un parent doit pouvoir trouver une pharmacie ouverte à 4h du matin même sans signal 3G.
- **Requêtes Asynchrones :** En cas de perte de réseau au moment d'enregistrer la voix, la question est mise en file d'attente sécurisée et envoyée au RAG dès rétablissement du réseau.

#### Device Features
- **Appareil Photo / Vision par Ordinateur :** Accès de très haut niveau à la caméra pour l'OCR continu du code-barres et du nom du médicament en temps réel.
- **Audio (Micro & Haut-parleur) :** Architecture "Zero-Touch" vocal obligatoire. Le parent stressé doit pouvoir parler et entendre la réponse de l'IA sans lire l'écran.
- **GPS (Localisation Sécurisée) :** Nécessaire au module géospatial pour lister la pharmacie de garde en temps réel la plus pertinente (calcul piéton ou moto-taxi).

#### Push Strategy
- **Alertes Opérationnelles :** Notifications push critiques pour le suivi de réservation (ex: "Le pharmacien a mis de côté votre sirop pédiatrique, venez le chercher").
- **Observance (Post-MVP) :** Gestion de l'alarme et des rappels locaux pour inciter la prise régulière des comprimés, favorisant la rétention de l'application.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach :** MVP "Problem-Solving" — Résoudre un seul problème douloureux (l'angoisse médicamenteuse nocturne) avec la plus petite boucle possible : **Scanner → Comprendre → Trouver une pharmacie.**

**Resource Requirements :** 1 Dev Flutter Full-Stack + 1 Data/AI Engineer (RAG) + 1 Designer UX. Durée estimée de la Phase 1 : 3-4 mois.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported :**
- ✅ *Aminata* (scan + question vocale + pharmacie de garde)
- ✅ *Marc* (tentative de diagnostic → Firewall RAG déclenché)

**Must-Have Capabilities :**
1. **Scanner de Code-Barres** – OCR en temps réel pour identifier le médicament.
2. **Assistant IA Vocal (RAG Strict)** – Lecture interactive et vocale de la notice certifiée, avec Firewall anti-diagnostic obligatoire.
3. **Pré-Scan de Contexte** – Écran simple demandant "Pour qui ? (Adulte/Enfant) / Âge / Poids estimé ?" avant la requête IA.
4. **Annuaire Géolocalisé des Pharmacies de Garde** – Base de données synchronisée avec cache local offline.
5. **Authentification Minimaliste (Phone Number + OTP)** – Via Mobile Money ou SMS local.
6. **Paywall Freemium (Mobile Money)** – 3 scans gratuits/mois, puis Premium Voice à 500 FCFA/mois via Orange/Airtel Money.
7. **Disclaimer Légal Obligatoire** – Case à cocher au premier lancement confirmant que l'app n'est pas un dispositif médical.

### Post-MVP Features

**Phase 2 (Growth) :**
- Web Admin Dashboard (Backoffice) étendu pour la saisie massive de données (nouveaux produits, text-mining des notices, upload de photos de boîtes).
- Gestion centralisée des stocks des pharmacies partenaires.
- Carnet de santé familial numérique (profils rattachés : enfants, parents).
- Rappels de prise de médicaments (alarmes locales).

**Phase 3 (Expansion / Vision Licorne) :**
- Data Warehouse anonymisé + pipeline ETL pour agrégation des données de consommation.
- "Pharma Analytics Dashboard" SaaS B2B pour les ONG, Ministères, Big Pharma.
- Heatmaps épidémiologiques prédictives en temps réel.
- Expansion géographique (Cameroun, RDC, Côte d'Ivoire...).

### Risk Mitigation Strategy

**Technical Risks :** Le RAG Strict est le composant le plus critique. Mitigation : développer la suite de Red-Teaming automatisée dès le Sprint 1, avant toute mise en production.
**Market Risks :** Le paiement via Mobile Money peut être freiné par la friction utilisateur. Mitigation : offrir un généreux Freemium (3 scans/mois) pour créer le réflexe avant de monétiser.
**Resource Risks :** Si l'équipe est réduite à 1 seul dev, le scope MVP peut être réduit à : Scanner + IA texte (sans vocal) + Annuaire (sans Click & Collect).

## Functional Requirements

### 1. Identification de Médicaments

- **FR1:** L'utilisateur peut scanner le code-barres d'une boîte de médicament pour identifier le produit.
- **FR2:** L'utilisateur peut scanner le nom imprimé sur une boîte (OCR texte) lorsque le code-barres est absent ou illisible.
- **FR3:** Le système peut faire correspondre le scan à une notice certifiée dans la base de données interne.
- **FR4:** Le système peut informer l'utilisateur lorsqu'un médicament scanné n'est pas trouvé dans la base de données.

### 2. Assistant IA & Sécurité Médicale

- **FR5:** L'utilisateur peut poser une question vocale à l'IA concernant un médicament identifié.
- **FR6:** L'utilisateur peut poser une question textuelle (chat) à l'IA concernant un médicament identifié.
- **FR7:** L'utilisateur peut accéder à l'assistant IA sans avoir scanné de produit (mode global).
- **FR8:** L'IA peut répondre vocalement en se basant exclusivement sur le contenu de la notice certifiée du médicament (RAG Strict, Température 0.0).
- **FR9:** L'utilisateur peut fournir un contexte patient (adulte/enfant, âge, poids estimé) avant d'interroger l'IA.
- **FR10:** Le système peut détecter et bloquer toute requête utilisateur demandant un diagnostic, une prescription, ou un conseil médical hors notice.
- **FR11:** Le système peut déclencher un message de sécurité ("Consultez un médecin") lorsqu'une requête est hors du périmètre de la notice.
- **FR12:** Le système peut déclencher un message de sécurité lorsque l'information demandée est introuvable dans la notice.

### 3. Localisation de Pharmacies

- **FR13:** L'utilisateur peut rechercher les pharmacies de garde ouvertes à proximité de sa position GPS.
- **FR14:** Le système peut afficher la distance et l'itinéraire vers les pharmacies trouvées.
- **FR15:** L'utilisateur peut consulter l'annuaire des pharmacies de garde même hors connexion (cache local).
- **FR16:** Le système peut suggérer automatiquement une pharmacie de garde après un scan ou une requête IA.

### 4. Gestion de Compte & Monétisation

- **FR17:** L'utilisateur peut créer un compte via son numéro de téléphone (OTP).
- **FR18:** L'utilisateur peut utiliser l'application gratuitement pour un nombre limité de scans par mois.
- **FR19:** L'utilisateur peut souscrire à un abonnement Premium via Mobile Money (Orange, Airtel, Moov).
- **FR20:** Le système peut gérer la transition Freemium → Premium (paywall) après épuisement du quota gratuit.
- **FR21:** L'utilisateur peut accepter le disclaimer légal obligatoire au premier lancement de l'application.

### 5. Conformité & Intégrité des Données

- **FR22:** Le système peut ingérer et mettre à jour les notices médicamenteuses exclusivement depuis des sources officielles certifiées.
- **FR23:** Le système peut anonymiser de manière irréversible les données d'utilisation avant toute agrégation analytique.
- **FR24:** Le système peut journaliser (logger) chaque interaction IA pour audit de sécurité médicale.
- **FR25:** Le système peut fonctionner en mode dégradé (cache local) en cas de perte de réseau.

### 6. Analytics & Données B2B (Phase 2-3)

- **FR26:** Le système peut agréger les données de scan anonymisées par zone géographique et par période.
- **FR27:** Un opérateur B2B peut consulter un dashboard d'analytiques sur les tendances de consommation pharmaceutique.
- **FR28:** Un opérateur B2B peut recevoir des alertes prédictives (pic anormal de recherches sur un médicament dans une zone).
- **FR29:** Un Opérateur Tiba (accès administrateur) peut consulter et gérer la base de données pharmaceutique depuis le Web Admin Dashboard.
- **FR30:** Un Opérateur Tiba peut créer et éditer des fiches produit (incluant photos, texte de la notice, nom) qui se synchronisent immédiatement sur l'app.
- **FR30b:** Un Opérateur Tiba peut mettre à jour les disponibilités de médicaments et les horaires de garde d'une pharmacie depuis le Web Admin Dashboard.

### 7. Administration & Résilience (Party Mode)

- **FR31:** Un administrateur peut ajouter, modifier ou retirer une notice médicamenteuse de la base de données.
- **FR32:** Le système peut synchroniser les données locales avec le serveur après rétablissement de la connexion sans perte de données.
- **FR33:** L'utilisateur peut parcourir un tutoriel de première utilisation expliquant les capacités et les limites de l'application.
- **FR34:** Le système peut proposer une action alternative immédiate (localiser un médecin, appeler le SAMU local) lorsqu'il refuse une requête hors périmètre.
- **FR35:** L'utilisateur peut consulter son historique de paiements et de souscriptions.
- **FR36:** L'utilisateur peut consulter son quota restant de scans gratuits.
- **FR37:** L'utilisateur peut signaler une réponse de l'IA qu'il considère comme incorrecte ou dangereuse.

## Non-Functional Requirements

### Performance
- **NFR1:** Le traitement vocal complet (Micro → RAG → Synthèse vocale) doit s'exécuter en moins de **3.5 secondes** sur un réseau 3G standard.
- **NFR2:** Le scan de code-barres doit identifier le médicament en moins de **1.5 secondes** après la mise au point de la caméra.
- **NFR3:** La liste des pharmacies de garde doit s'afficher en moins de **2 secondes** (mode en ligne) ou **0.5 seconde** (mode cache local).
- **NFR4:** Le temps de réponse IA au premier appel (cold start) ne doit pas dépasser **6 secondes**. Les appels suivants dans la même session doivent respecter le seuil de 3.5s.

### Security
- **NFR5:** Toutes les communications client-serveur doivent être chiffrées en **TLS 1.3** minimum.
- **NFR6:** Les données du futur carnet de santé familial doivent être chiffrées au repos avec **AES-256**.
- **NFR7:** Les tokens d'authentification (OTP) doivent expirer après **5 minutes** et être à usage unique.
- **NFR8:** Les journaux d'audit des interactions IA doivent être conservés pendant un minimum de **24 mois** et être immuables.
- **NFR9:** L'anonymisation des données B2B doit être **irréversible** (hachage + suppression des identifiants directs).
- **NFR10:** Le système doit limiter les requêtes IA à un maximum de **30 par utilisateur par heure**, avec blocage temporaire après dépassement.

### Scalability
- **NFR11:** L'architecture backend doit supporter un passage de 1 000 à **50 000 utilisateurs actifs mensuels** sans refactoring majeur.
- **NFR12:** La base de données des notices médicamenteuses doit supporter l'ajout de **10 000+ références** sans dégradation des performances du RAG.
- **NFR13:** L'architecture doit prévoir un chemin de migration documenté vers **500 000+ MAU** (Phase 3) sans réécriture complète du backend.

### Reliability (Disponibilité)
- **NFR14:** L'API backend (hors IA) doit maintenir un uptime de **99.9%** (moins de 8h45 d'indisponibilité par an).
- **NFR15:** En cas de panne du service IA, l'annuaire des pharmacies de garde et le scanner doivent rester **100% opérationnels** (dégradation gracieuse).
- **NFR16:** Le cache local (pharmacies + notices récentes) doit rester fonctionnel pendant **7 jours** sans connexion internet.

### Accessibility (Accessibilité Contextuelle)
- **NFR17:** L'interface vocale doit être utilisable par un utilisateur **analphabète** sans jamais nécessiter de lecture à l'écran pour les fonctions critiques (scan + question + pharmacie).
- **NFR18:** L'application doit fonctionner correctement sur des appareils avec **2 Go de RAM** et des écrans de **5 pouces** minimum.
- **NFR19:** La taille de l'APK initial ne doit pas dépasser **30 Mo** pour les téléchargements sur forfaits prépayés limités.
- **NFR20:** L'interface doit maintenir un ratio de contraste minimum de **7:1** (WCAG AAA) pour tous les éléments textuels critiques (nom du médicament, alerte de sécurité, nom de la pharmacie).

### Data Quality (Qualité des Données B2B)
- **NFR21:** Les données anonymisées exportées vers le Data Warehouse B2B doivent avoir un taux de complétude minimum de **95%** sur les dimensions clés (zone géographique, catégorie médicamenteuse, période).
