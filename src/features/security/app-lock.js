import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'app_pin';
const LOCK_ENABLED_KEY = 'app_lock_enabled';

export async function setPin(pin) {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPin(pin) {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored === pin;
}

export async function isAppLockEnabled() {
  const val = await SecureStore.getItemAsync(LOCK_ENABLED_KEY);
  return val === 'true';
}

export async function setAppLockEnabled(enabled) {
  await SecureStore.setItemAsync(LOCK_ENABLED_KEY, enabled ? 'true' : 'false');
}
