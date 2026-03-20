# Story 1.3: Authentification Utilisateur OTP

Status: ready-for-dev

## Story

As a **utilisateur Tiba (Aminata)**,
I want **créer un compte avec mon numéro de téléphone et me connecter facilement**,
so that **mes scans et mon historique soient associés à mon profil de façon sécurisée**.

## Acceptance Criteria

1. **Given** l'utilisateur a accepté le disclaimer (Story 1.2)
   **When** l'écran d'inscription s'affiche
   **Then** un champ de saisie pour le numéro de téléphone (format international +237, +242, +243) est présenté
   **And** un sélecteur de préfixe pays est disponible

2. **Given** l'utilisateur saisit un numéro de téléphone valide et appuie sur "Recevoir le code"
   **When** la requête est envoyée à Supabase Auth (OTP Phone)
   **Then** un SMS contenant un code OTP à 6 chiffres est envoyé au numéro
   **And** un écran de saisie du code OTP avec un timer de 5 minutes s'affiche (NFR7)
   **And** un Skeleton Loader s'affiche pendant l'envoi (UX-DR7)

3. **Given** l'utilisateur saisit le code OTP correct dans les 5 minutes
   **When** le code est vérifié par Supabase Auth
   **Then** la session utilisateur est créée et le JWT est stocké en local de manière sécurisée
   **And** l'utilisateur est redirigé vers l'écran Scanner principal (FR17)

4. **Given** l'utilisateur saisit un code OTP incorrect ou expiré
   **When** la vérification échoue
   **Then** un message d'erreur clair s'affiche en Rouge Corail (#E85D75)
   **And** l'utilisateur peut renvoyer un nouveau code après le délai du timer

5. **Given** l'utilisateur est déjà connecté
   **When** il relance l'application
   **Then** la session est restaurée automatiquement sans redemander le code OTP
   **And** toutes les communications utilisent TLS 1.3 minimum (NFR5)

## Tasks / Subtasks

- [ ] Task 1: Add Supabase dependencies & config (AC: all)
  - [ ] Add `supabase_flutter` package to `pubspec.yaml`
  - [ ] Create `lib/core/config/supabase_config.dart` with URL and anon key
  - [ ] Initialize Supabase in `main.dart` before `runApp`
  - [ ] Create `.env` or constants file for Supabase credentials (do NOT hardcode in git)
- [ ] Task 2: Auth Repository (AC: #2, #3, #4, #5)
  - [ ] Create `lib/features/auth/data/auth_repository.dart`
  - [ ] Implement `sendOtp(phoneNumber)` → calls `supabase.auth.signInWithOtp(phone:)`
  - [ ] Implement `verifyOtp(phone, token)` → calls `supabase.auth.verifyOTP()`
  - [ ] Implement `getCurrentSession()` → checks `supabase.auth.currentSession`
  - [ ] Implement `signOut()`
  - [ ] Implement `onAuthStateChange` stream listener
- [ ] Task 3: Auth Riverpod Providers (AC: all)
  - [ ] Create `lib/features/auth/providers/auth_providers.dart`
  - [ ] Create `authRepositoryProvider`
  - [ ] Create `authStateProvider` (StreamProvider listening to auth state changes)
  - [ ] Create `sendOtpProvider` / `verifyOtpProvider` (async notifiers or FutureProviders)
- [ ] Task 4: PhoneInputPage widget (AC: #1)
  - [ ] Create `lib/features/auth/presentation/phone_input_page.dart`
  - [ ] Dropdown for country prefix (+237 Cameroun, +242 Congo, +243 RDC)
  - [ ] Phone number text field with validation (8-10 digits)
  - [ ] "Recevoir le code" TibaButton — disabled until valid phone entered
  - [ ] Skeleton Loader while OTP is being sent (UX-DR7)
  - [ ] Error styling in Rouge Corail (#E85D75 / TibaColors.alert)
- [ ] Task 5: OtpVerificationPage widget (AC: #2, #3, #4)
  - [ ] Create `lib/features/auth/presentation/otp_verification_page.dart`
  - [ ] 6-digit code input (individual boxes or pin-code style)
  - [ ] Countdown 5-minute timer display (NFR7)
  - [ ] "Renvoyer le code" link — disabled during countdown
  - [ ] Auto-submit when 6 digits entered
  - [ ] Error message in Rouge Corail on invalid/expired code
  - [ ] Loading state (Skeleton) during verification
  - [ ] On success → navigate to AppShell (pushAndRemoveUntil)
- [ ] Task 6: App Routing Update (AC: #5)
  - [ ] Modify `_StartupRouter` in `lib/app/app.dart`
  - [ ] Check flow: disclaimer accepted? → session exists? → route accordingly
  - [ ] If no disclaimer → OnboardingPage
  - [ ] If disclaimer but no session → PhoneInputPage
  - [ ] If session exists → AppShell
- [ ] Task 7: Supabase project setup
  - [ ] Enable Phone Auth (OTP) in Supabase Dashboard
  - [ ] Configure SMS provider (Twilio or built-in Supabase for testing)
  - [ ] Test OTP flow with real/test phone number
- [ ] Task 8: Tests (AC: #1-5)
  - [ ] Widget test: PhoneInputPage validates phone format
  - [ ] Widget test: OtpVerificationPage shows 6-digit input + timer
  - [ ] Unit test: AuthRepository methods call correct Supabase APIs

## Dev Notes

### Project Structure Notes

- **Feature module:** `lib/features/auth/` following the pattern set by `lib/features/onboarding/` in Story 1.2.
  ```
  lib/features/auth/
  ├── data/
  │   └── auth_repository.dart
  ├── providers/
  │   └── auth_providers.dart
  └── presentation/
      ├── phone_input_page.dart
      └── otp_verification_page.dart
  ```
- **Config module:** `lib/core/config/supabase_config.dart` — central Supabase init.

### Previous Story Intelligence

- **Story 1.1:** Design System (TibaColors, TibaTypography, TibaTheme, TibaButton), 3-tab AppShell.
- **Story 1.2:** OnboardingPage → DisclaimerPage → AppShell flow. SharedPreferences. `_StartupRouter` in `app.dart`.
- **Reuse:** `TibaButton` for "Recevoir le code" / "Vérifier". `TibaColors.alert` for errors. Theme text styles everywhere.
- **Modify:** `app.dart` (`_StartupRouter` needs a 3rd check: session exists?), `main.dart` (add Supabase.initialize).

### Architecture Compliance

- **Auth Provider:** Supabase Auth with Phone OTP — see FR17, NFR7 (5-min expiry).
- **Security:** JWT stored by `supabase_flutter` internally (Hive/secure storage). TLS 1.3 enforced by Supabase platform.
- **State Management:** Riverpod for auth state. `StreamProvider` wrapping `supabase.auth.onAuthStateChange`.
- **Offline:** Auth requires network. If offline, show a friendly "connexion requise" message.
- **UX:** Skeleton loaders for loading states (UX-DR7). 48px touch targets (UX-DR6).

### Library & Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| `supabase_flutter` | `^2.8.3` | Supabase client + Auth (OTP, session, JWT) |
| `flutter_riverpod` | `^2.6.1` | Already added in Story 1.1 |

### Supabase Configuration Required

Before development, ensure:
1. Supabase project exists with Phone Auth enabled
2. An SMS provider is configured (Twilio recommended for production)
3. The Supabase URL and anon key are available
4. For testing: use Supabase's built-in test OTP (no real SMS needed)

### References

- [Source: `planning-artifacts/epics.md`] — Story 1.3 AC (FR17, NFR5, NFR7, UX-DR7)
- [Source: `planning-artifacts/architecture.md`] — Supabase Auth, Flutter/Riverpod stack
- [Source: `implementation-artifacts/1-2-onboarding-et-disclaimer-legal.md`] — Routing flow (disclaimer → auth → app)

## Dev Agent Record

### Agent Model Used

Antigravity / Gemini

### Debug Log References
*(To be filled during development)*

### Completion Notes List
*(To be filled during development)*

### File List
*(To be filled during development)*
