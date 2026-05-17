import * as SecureStore from 'expo-secure-store';

const prefix = 'storage_';

export async function getItem(key) {
  try {
    return await SecureStore.getItemAsync(prefix + key);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await SecureStore.setItemAsync(prefix + key, value);
  } catch (e) {
    console.warn('Storage setItem error:', e);
  }
}

export async function removeItem(key) {
  try {
    await SecureStore.deleteItemAsync(prefix + key);
  } catch {
    // Ignore
  }
}
