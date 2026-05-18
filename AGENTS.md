# AGENTS.md

Guidance for AI agents working in this repository.

## Stack

- **Expo SDK 54** with React 19 + React Native 0.81 (**JavaScript only**, no TypeScript)
- **New Architecture enabled** (`newArchEnabled: true` in `app.json`)
- State: React Context + `useReducer` (`AppContext`, `ThemeContext`, `SecurityContext`)
- Storage: `expo-secure-store` for encrypted persistence
- Navigation: React Navigation v7 (Native Stack)
- OTP: jsSHA for HMAC-SHA1/256/512, TOTP/HOTP per RFC 6238/4226

## Critical Commands

```bash
npx expo start              # Dev server (scan QR with Expo Go)
npx expo run:android        # Run on device/emulator
npx expo run:ios            # Run on simulator
npx expo prebuild --clean   # Regenerate native folders (android/ ios/)
```

- Use `npm install` / `npm ci` (not yarn, even though `yarn.lock` exists)
- CI builds use `npm ci` with Node 24 + `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`

## Build & CI

- **Android APK/AAB**: GitHub Actions (ubuntu-latest, Java 17, Node 24), manual dispatch
- **iOS IPA**: GitHub Actions (macos-latest, unsigned build), manual dispatch
- **EAS Build**: configured in `eas.json` (development/preview/production profiles)
- Android native folders are gitignored and generated via `expo prebuild`

## Architecture Notes

Entry: `index.js` → `App.js` (provider tree: `SafeAreaProvider > ThemeProvider > AppProvider > SecurityProvider > AppNavigator`)

### Directory Structure & Feature Mapping

| Path | Feature | Notes |
|------|---------|------|
| `App.js` | App entry | Global providers + StatusBar |
| `src/context/AppContext.js` | Accounts/settings state | `useReducer` + encrypted persistence |
| `src/context/ThemeContext.js` | Theme | light / dark / system |
| `src/context/SecurityContext.js` | Security | app lock + biometrics |
| `src/navigation/AppNavigator.js` | Navigation | Native Stack routes |
| `src/screens/HomeScreen.js` | Accounts list | cards + FAB + empty state |
| `src/screens/ScanScreen.js` | QR scan add | `expo-camera` |
| `src/screens/ManualAddScreen.js` | Manual add | Issuer/Account/Secret + live preview |
| `src/screens/ClipboardAddScreen.js` | Clipboard add | Detects `otpauth://` / Base32 |
| `src/features/accounts/` | Accounts feature | cards, empty state, forms, hooks |
| `src/features/otp/totp.js` | OTP | TOTP/HOTP generation (RFC 6238/4226) |
| `src/features/otp/time-sync.js` | Time sync | NTP calibration + offset |
| `src/features/security/encryption.js` | Storage crypto | encrypt/decrypt helpers |
| `src/features/security/app-lock.js` | App lock | PIN / biometrics |
| `src/features/security/biometric.js` | Biometrics | fingerprint/face |
| `src/features/settings/` | Settings UI | appearance/security/data/advanced/about |
| `src/shared/components/` | Shared UI | FAB, TimerRing, Toast, Toggle, ClayCard |
| `src/shared/utils/base32.js` | Base32 utils | encode/decode |
| `src/shared/utils/otpauth.js` | otpauth parser | parses `otpauth://` |
| `src/shared/utils/storage.js` | Storage adapter | SecureStore wrapper |
| `src/shared/theme/` | Theme system | colors/shadows/animations |

### Feature Coverage (from outline)

**1. Account management**
- Add by scan (ScanScreen + `expo-camera`)
- Add manually (ManualAddScreen + live preview)
- Add from clipboard (ClipboardAddScreen; detects multiple formats)
- Account cards (Issuer + 6-digit code + 30s countdown)
- Edit/delete (with confirmation)

**2. OTP interactions**
- 30s auto refresh + countdown
- Tap code to copy (Toast feedback)
- < 5s countdown warning (red)

**3. Secure storage**
- Encrypted persistence (`expo-secure-store` + device Keychain/Keystore)
- App lock (PIN / biometrics, off by default)

**4. Data management**
- Export: secrets list / otpauth URL list (system share)
- Backup: encrypted JSON (full restore)
- Import: merge/replace backup, or batch import from text

**5. Utilities**
- Time calibration: NTP auto + manual + offset display
- Theme switch: light/dark/system

**6. UI structure**
- Home (accounts list) → bottom FAB
- Add actions → scan / manual / clipboard
- Scan, manual add, clipboard preview
- Edit account, settings (grouped)

## Style & Conventions

- **Claymorphism UI**: macaron color palette, dual shadows, spring animations — do not introduce glassmorphism/neon/cyberpunk elements
- Theme system: light/dark defined in `src/shared/theme/colors.js`
- `[AI]` prefix in commit messages for AI-generated changes (per global AGENTS.md)
- Branch naming: `feat/{name}` or `bugfix/{name}` from `dev` branch (`master` is hotfix-only)

## Gotchas

- **Expo SDK 54 has breaking changes** — read versioned docs: https://docs.expo.dev/versions/v54.0.0/
- `android/` and `ios/` are gitignored; do not edit generated native code
- `expo-secure-store` is registered as a config plugin in `app.json`
- Camera permission is declared twice in `app.json` (harmless duplication)
- No test framework is configured — add tests only if explicitly requested
