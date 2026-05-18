# 2FA Authenticator

A Claymorphism-styled TOTP/HOTP authenticator app built with Expo Go.

## Features

- **TOTP/HOTP Support**: RFC 6238 / RFC 4226 compliant one-time password generation
- **QR Code Scanning**: Scan otpauth:// URIs via expo-camera
- **Manual Entry**: Add accounts by entering secret keys manually
- **Clipboard Import**: Import from clipboard with one tap
- **Time Calibration**: NTP-based time sync for accurate codes
- **Data Management**: Export, backup, and import accounts
- **Theme System**: Light / Dark / System theme with Claymorphism design
- **App Lock**: Biometric / PIN lock support
- **Persistent Settings**: All preferences saved via SecureStore

## Tech Stack

- **Runtime**: Expo Go (JavaScript + Expo SDK 54)
- **UI**: Claymorphism (macaron colors, dual shadows, spring animations)
- **State**: React Context + useReducer
- **Storage**: expo-secure-store (encrypted)
- **Navigation**: React Navigation (Native Stack)
- **OTP**: jsSHA (HMAC-SHA1/256/512)

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your device.

## Project Structure

```
src/
├── context/          # AppContext, ThemeContext, SecurityContext
├── features/
│   ├── accounts/     # AccountCard, account list
│   ├── otp/          # TOTP/HOTP generation, time sync
│   ├── security/     # Encryption, account persistence
│   ├── import-export/# Export, backup, import
│   └── settings/     # Settings screen & components
├── navigation/       # AppNavigator, stack screens
├── screens/          # Home, Scan, ManualAdd, EditAccount
└── shared/
    ├── components/   # FAB, TimerRing, Toggle, Toast
    ├── theme/        # Color tokens for light/dark
    └── utils/        # SecureStore storage adapter
```

## License

Private
