// [AI] Account import functionality
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { parseOtpauthUrl } from '../../shared/utils/otpauth';
import { isValidBase32 } from '../../shared/utils/base32';
import { deobfuscate } from '../security/encryption';

export async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: '*/*',
  });
  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function importFromBackup(fileUri, merge = true) {
  const content = await FileSystem.readAsStringAsync(fileUri);
  const parsed = JSON.parse(content);
  const data = deobfuscate(parsed.data);
  if (!data || !data.accounts) throw new Error('Invalid backup file');

  if (merge) {
    return { type: 'merge', accounts: data.accounts, settings: data.settings };
  }
  return { type: 'replace', accounts: data.accounts, settings: data.settings };
}

export async function importFromText(fileUri) {
  const content = await FileSystem.readAsStringAsync(fileUri);
  const lines = content.split('\n').filter(Boolean);
  const accounts = [];
  const errors = [];

  lines.forEach((line, i) => {
    if (line.startsWith('otpauth://')) {
      const parsed = parseOtpauthUrl(line);
      if (parsed) {
        accounts.push({ ...parsed, id: generateId() });
      } else {
        errors.push(`Line ${i + 1}: Invalid otpauth URL`);
      }
    } else if (isValidBase32(line)) {
      accounts.push({
        id: generateId(),
        secret: line.toUpperCase(),
        issuer: '',
        account: `Account ${accounts.length + 1}`,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });
    } else {
      errors.push(`Line ${i + 1}: Invalid format`);
    }
  });

  return { accounts, errors };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
