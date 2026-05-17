// [AI] Account backup functionality
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { obfuscate } from '../security/encryption';

export async function backupAccounts(accounts, settings) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts,
    settings,
  };
  const content = obfuscate(data);
  const fileUri = FileSystem.documentDirectory + '2fa-backup.json';
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ data: content }));
  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    UTI: 'public.json',
  });
}
