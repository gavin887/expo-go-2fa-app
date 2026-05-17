import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = 'encrypted_accounts';

function obfuscate(data) {
  const json = JSON.stringify(data);
  const key = 0x5a;
  const bytes = [];
  for (let i = 0; i < json.length; i++) {
    bytes.push(json.charCodeAt(i) ^ key);
  }
  return btoa(String.fromCharCode(...bytes));
}

function deobfuscate(encoded) {
  try {
    const str = atob(encoded);
    const key = 0x5a;
    let json = '';
    for (let i = 0; i < str.length; i++) {
      json += String.fromCharCode(str.charCodeAt(i) ^ key);
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function saveAccounts(accounts) {
  const encoded = obfuscate(accounts);
  await SecureStore.setItemAsync(ACCOUNTS_KEY, encoded);
}

export async function loadAccounts() {
  const encoded = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  if (!encoded) return [];
  return deobfuscate(encoded) || [];
}

export async function clearAccounts() {
  await SecureStore.deleteItemAsync(ACCOUNTS_KEY);
}
