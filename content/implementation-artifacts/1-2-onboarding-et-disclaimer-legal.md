# Story 1.2: Onboarding & Disclaimer Légal

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **nouvel utilisateur Tiba (Aminata)**,
I want **comprendre ce que l'application peut et ne peut pas faire, et accepter les conditions légales**,
so that **je sois informée des limites de l'IA avant de l'utiliser pour ma famille**.

## Acceptance Criteria

1. **Given** l'utilisateur lance l'application pour la toute première fois
   **When** l'écran d'accueil s'affiche
   **Then** un tutoriel de 3 écrans défilants (swipe) explique :
     1. Le scan de médicaments et ce qu'il permet
     2. L'assistant IA et ses limites strictes (pas de diagnostic)
     3. Les pharmacies de garde à proximité
   **And** chaque écran utilise des illustrations et un texte large lisible (Outfit/Inter)
   **And** un bouton "Passer" est visible à tout moment
2. **Given** l'utilisateur a terminé ou passé le tutoriel
   **When** l'écran de disclaimer légal s'affiche
   **Then** le texte du disclaimer est affiché en entier avec scroll
   **And** une checkbox "J'ai lu et j'accepte" est présente
   **And** le bouton "Continuer" reste désactivé tant que la checkbox n'est pas cochée (FR21)
3. **Given** l'utilisateur coche la checkbox et appuie sur "Continuer"
   **When** l'acceptation est enregistrée
   **Then** le flag `disclaimer_accepted = true` est sauvegardé localement (SharedPreferences)
   **And** l'utilisateur ne reverra jamais le tutoriel ni le disclaimer lors des lancements suivants
4. **Given** l'utilisateur relance l'application après avoir déjà accepté
   **When** l'application démarre
   **Then** l'écran d'accueil principal (Scanner via AppShell) s'affiche directement (FR33)

## Tasks / Subtasks

- [ ] Task 1: Create OnboardingPage widget (AC: #1)
  - [ ] Create `lib/features/onboarding/presentation/onboarding_page.dart`
  - [ ] Implement `PageView` with 3 swipeable screens
  - [ ] Each screen: illustration (placeholder icon/image), title (Outfit), description (Inter)
  - [ ] Screen 1: "Scannez vos médicaments" — barcode icon, explains scan feature
  - [ ] Screen 2: "Votre assistant santé IA" — AI icon, explains limits (NOT a doctor)
  - [ ] Screen 3: "Pharmacies de garde" — pharmacy icon, explains nearby search
  - [ ] Add dot indicator at bottom showing current page
  - [ ] Add "Passer" (Skip) text button visible on ALL screens, top-right
  - [ ] Add "Suivant" button on screens 1-2, "Commencer" on screen 3
  - [ ] Use Design System: green accents, sand background, 24px radius buttons, 48px touch targets
- [ ] Task 2: Create DisclaimerPage widget (AC: #2)
  - [ ] Create `lib/features/onboarding/presentation/disclaimer_page.dart`
  - [ ] Scrollable text block with the full disclaimer content
  - [ ] Checkbox widget "J'ai lu et j'accepte les conditions d'utilisation"
  - [ ] "Continuer" button — disabled (greyed out) until checkbox is checked
  - [ ] Button enables with green color when checkbox is ticked
- [ ] Task 3: Persist acceptance flag (AC: #3)
  - [ ] Add `shared_preferences` package to `pubspec.yaml`
  - [ ] Create `lib/features/onboarding/data/onboarding_repository.dart`
  - [ ] Implement `hasDisclaimerBeenAccepted()` → reads `SharedPreferences`
  - [ ] Implement `acceptDisclaimer()` → writes `disclaimer_accepted = true`
- [ ] Task 4: App routing logic (AC: #4)
  - [ ] Modify `lib/main.dart` or `lib/app/app.dart` to check `hasDisclaimerBeenAccepted()` at startup
  - [ ] If `false` → show `OnboardingPage` → then `DisclaimerPage` → then `AppShell`
  - [ ] If `true` → show `AppShell` directly
  - [ ] Wrap with `ProviderScope` for Riverpod
- [ ] Task 5: Tests (AC: #1-4)
  - [ ] Widget test: OnboardingPage renders 3 pages with swipe
  - [ ] Widget test: DisclaimerPage button disabled until checkbox checked
  - [ ] Unit test: OnboardingRepository reads/writes SharedPreferences correctly

## Dev Notes

### Project Structure Notes

- **Alignment:** Story 1.1 established `lib/app/` for the shell and `lib/core/theme/` for design system. This story introduces the first **feature module** under `lib/features/onboarding/`. This sets the pattern for all future features.
- **Feature module structure:**
  ```
  lib/features/onboarding/
  ├── data/
  │   └── onboarding_repository.dart
  └── presentation/
      ├── onboarding_page.dart
      └── disclaimer_page.dart
  ```
- **State Management:** Use Riverpod. Create a simple `onboardingProvider` (FutureProvider or StateNotifierProvider) that checks SharedPreferences.
- **Naming:** Dart/Flutter uses `snake_case.dart` for files, `PascalCase` for classes.
- **Navigation flow:** Simple imperative navigation (`Navigator.pushReplacement`) — no need for GoRouter yet at this stage.

### Previous Story 1.1 Intelligence

- **Files created:** `lib/app/app.dart` (TibaApp), `lib/app/app_shell.dart` (3-tab nav), `lib/core/theme/tiba_theme.dart`, `tiba_colors.dart`, `tiba_typography.dart`, `lib/core/widgets/tiba_button.dart`
- **Patterns:** Package imports (`package:tiba_app/...`), strict linting with `analysis_options.yaml`, Material 3 theme.
- **Reuse:** Use `TibaButton` for "Suivant", "Commencer", "Continuer" buttons. Use `TibaColors` and theme text styles everywhere.
- **Do NOT modify:** `tiba_theme.dart`, `tiba_colors.dart`, `tiba_typography.dart`, `app_shell.dart` — these are stable from Story 1.1.

### Architecture Compliance

- **Technical Stack:** Flutter 3.x (Dart), Riverpod for state management.
- **Offline:** SharedPreferences is fully local — no network needed for onboarding.
- **Security:** N/A for this story (no auth, no sensitive data).
- **Testing Standards:** Widget tests for UI, unit tests for repository.
- **APK Size:** SharedPreferences is tiny (~10kb). No significant impact.

### Library & Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| `shared_preferences` | `^2.3.3` | Persist disclaimer acceptance flag |
| `flutter_riverpod` | `^2.6.1` | Already added in Story 1.1 |
| `google_fonts` | `^6.2.1` | Already added in Story 1.1 |

### Disclaimer Text Content

Use the following placeholder text (to be replaced with final legal text later):

```
AVERTISSEMENT IMPORTANT

Tiba est un assistant d'information pharmaceutique. Il ne remplace en aucun cas l'avis d'un médecin, d'un pharmacien ou de tout autre professionnel de santé.

Les informations fournies par Tiba proviennent exclusivement de notices médicamenteuses certifiées. Tiba ne peut pas :
• Poser un diagnostic médical
• Prescrire un traitement
• Remplacer une consultation médicale

En cas d'urgence médicale, appelez immédiatement les services d'urgence de votre pays.

En utilisant Tiba, vous reconnaissez que :
1. Les informations sont fournies à titre informatif uniquement
2. Vous consulterez un professionnel de santé pour toute décision médicale
3. Tiba ne saurait être tenu responsable de toute décision prise sur la base de ses informations

Dernière mise à jour : Mars 2026
```

### References

- [Source: `planning-artifacts/epics.md`] — Story 1.2 acceptance criteria (FR21, FR33)
- [Source: `planning-artifacts/architecture.md`] — Flutter/Riverpod stack, feature module structure
- [Source: `implementation-artifacts/1-1-project-initialization-and-design-system.md`] — Previous story patterns and files

## Dev Agent Record

### Agent Model Used

Antigravity / Gemini

### Debug Log References
*(To be filled during development)*

### Completion Notes List
*(To be filled during development)*

### File List
*(To be filled during development)*
