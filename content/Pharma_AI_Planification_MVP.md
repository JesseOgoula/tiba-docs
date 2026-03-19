# Planification, MVP et Stack Technique : Tiba

Ce document définit précisément ce que nous allons construire pour la première version (V1.0 MVP), comment nous organiserons les fonctionnalités, et quelles technologies permettront de soutenir ce modèle à l'échelle.

---

## 1. Priorisation des Fonctionnalités (Méthode MoSCoW)

Pour la première version (V1.0 MVP), nous allons frapper fort pour être le véritable **Concierge Médical** de l'utilisateur :

### 🟢 MUST HAVE (Vital pour le MVP V1.0)
- **Agent IA Global (Symptômes & Orientation) :** Un bouton central d'accès à l'IA vocale/textuelle. L'IA peut écouter des symptômes et orienter sans JAMAIS diagnostiquer ("Cela peut être dû à X, consultez un médecin. Voici la pharmacie ouverte la plus proche").
- **Barre de Recherche & Achat IA (Click & Collect) :** L'utilisateur peut taper ou demander "Je cherche du Doliprane 500mg". L'app affiche le produit, le prix, la pharmacie ouverte la plus proche avec du stock, la distance, et propose un bouton "Payer" pour le bloquer/réserver.
- **Scanner de Produit (Anti-Fake & Notice) :** Scan du code-barres pour vérifier l'authenticité et afficher les photos, la notice, avec possibilité de poser des questions à l'IA spécifiquement sur le médicament scanné.
- **Intelligence Conversationnelle (Détection du Patient) :** L'IA détecte naturellement pour qui est le médicament lors de la conversation. Sécurité garantie par des demandes de clarification proactives.
- **Pharmacies de Garde avec Visibilité Stocks :** Une carte/liste des pharmacies intégrant la disponibilité des médicaments.
- **Intégration Mobile Money :** Pour payer le "Click & Collect" et l'abonnement Freemium.
- **Authentification Rapide :** Google (nom récupéré auto) ou numéro de téléphone (OTP).

### 🟡 SHOULD HAVE (Important, mais peut attendre la V1.1)
- **Livraison à Domicile :** Intégration d'un service de coursiers (motos) pour livrer le médicament réservé directement chez le patient.

### 🔴 WON'T HAVE (Pas maintenant - Hors MVP)
- Téléconsultation vidéo intégrée In-App (complexe à modérer au début).
- Algorithmes de diagnostic ferme ("Vous avez le paludisme").

---

## 2. Le Périmètre du MVP (V1.0 - Le Produit Minimal Viable)

Le MVP devient un **Outil Global Omniprésent** (Super-App médicale gérant l'avant-achat, l'achat, et l'après-achat).

**Les 3 Flows de l'Utilisateur (MVP V1.0) :**

**👉 Flow A : L'Orientation (Global AI)**
1. L'utilisateur ouvre l'app et clique sur le Micro central 🎤 : *"J'ai des vertiges depuis ce matin."*
2. L'IA répond : *"Vos symptômes peuvent être liés à la tension, la fatigue ou la glycémie. Je vous conseille vivement de voir un médecin. La clinique ou pharmacie de garde la plus proche de vous est à 1.5km."*

**👉 Flow B : Recherche & Achat (Click & Collect)**
1. Via la barre de recherche (ou voix) : *"Je veux acheter du Noliprane."*
2. L'app affiche la fiche du Noliprane (Photo, Prix).
3. Elle liste les pharmacies proches l'ayant **en stock**, avec mention "Fermé" ou "De Garde".
4. L'utilisateur clique sur **"Payer"** (Mobile Money), le produit est réservé à la pharmacie, il n'a plus qu'à passer le récupérer.

**👉 Flow C : L'Assistance Post-Achat (Le Scan)**
1. L'utilisateur a la boîte en main chez lui. Il clique sur "Scanner".
2. L'app confirme "✅ Authentique" et affiche la notice numérique.
3. Il demande : *"Ma petite a 4 ans, combien de cuillères ?"* -> L'IA extrait la posologie pédiatrique exacte.
4. Au bout de quelques requêtes gratuites, un Pop-up propose le "Pass Santé" via Mobile Money.

---

## 3. Choix Technologiques (La Stack "Licorne")

Pour construire cette application qui doit devenir une infrastructure Data (B2B SaaS) tout en étant rapide sur les vieux téléphones Android en Afrique, la stack doit être moderne, robuste et peu coûteuse au démarrage.

### 📱 Frontend (Application B2C B2B)
- **Flutter (Dart) :** Le choix indéniable. Permet de coder une seule fois pour avoir iOS et Android. Flutter est hyper optimisé pour de belles animations fluides natives et intègre parfaitement l'accès à la caméra pour le scan de codes-barres.

### ⚙️ Backend & Base de Données (Le Cœur du Réacteur)
- **Supabase (PostgreSQL) :** Supabase est une alternative Open-Source à Firebase, mais adossée à une vraie base de données relationnelle (PostgreSQL). C'est VITAL pour la Phase 3 (quand tu vendras des requêtes SQL complexes aux Big Pharma). Firebase (NoSQL) serait un enfer pour l'analyse de données B2B. 
- **Stockage Vectoriel (pgvector dans Supabase) :** PostgreSQL hébergera nos modèles vectoriels pour l'IA, permettant à celle-ci de trouver les extraits exacts des PDF de notices en millisecondes.

### 🧠 Intelligence Artificielle (Le Cerveau Bridé)
- **OpenAI API (GPT-4o mini) ou Anthropic (Claude 3.5 Haiku) :** Des LLMs ultra-rapides et peu coûteux. 
- **RAG Architecture (Retrieval-Augmented Generation) :** C'est la technologie clé. L'IA n'a techniquement *rien* dans la tête. On lui injecte uniquement les textes de la notice du médicament scanné. Elle devient incapable d'inventer des diagnostics, elle ne fait que résumer les documents qu'on lui fournit.
- **Speech-to-Text / Text-to-Speech :** Whisper API (OpenAI) pour la transcription vocale en français et dans certaines langues vernaculaires à terme.

---

## 4. Feuille de Route de Développement (Roadmap Temps Réel)

Voici comment on découpe le travail pour passer de 0 à la sortie sur les stores :

### Phase 1 : Architecture & Cœur IA (Semaine 1-2)
- [ ] Création du projet Flutter et setup de Supabase.
- [ ] Création de la Base de Données (Table Patients, Table Médicaments, Table Scans).
- [ ] Ingestion manuelle de 50 notices médicales PDF dans Supabase (pgvector).
- [ ] Création du système RAG (Le prompt de l'IA strict et incassable connecté aux PDF).

### Phase 2 : Développement App Mobile & Scan (Semaine 3-4)
- [ ] Implémentation du scanner de Code-Barre / Datamatrix dans Flutter.
- [ ] UX/UI complète de l'application (Écrans de Scan, Écran de Résultat, Interface de Chat).
- [ ] Connexion Chatbot de l'App B2C à l'API de notre RAG Backend.

### Phase 3 : Infrastructure Paiement & Auth (Semaine 5-6)
- [ ] Intégration de l'Authentification (OTP SMS et Google).
- [ ] Intégration API Mobile Money (Paystack, Flutterwave ou Hub2 / CinetPay pour le Gabon/CEMAC).
- [ ] Mise en place des compteurs "3 requêtes gratuites/mois" et des abonnements.

### Phase 4 : Alpha Testing & Lancement (Semaine 7-8)
- [ ] Tests en conditions réelles : Scanner de vraies boîtes achetées en pharmacie à Libreville.
- [ ] Tentative de forcer l'IA à dire des bêtises (Red Teaming / Sécurité) pour s'assurer qu'elle est juridiquement inattaquable.
- [ ] Publication TestFlight (Apple) et Google Play Console fermée.
