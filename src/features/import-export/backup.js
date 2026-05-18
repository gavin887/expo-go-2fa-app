// [AI] Account backup functionality
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { obfuscate } from '../security/encryption';

export async function backupAccounts(accounts, settings) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts,
    settings,
  };
  const content = obfuscate(data);
  const file = new File(Paths.document, '2fa-backup.json');
  file.create({ overwrite: true });
  file.write(JSON.stringify({ data: content }));
  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
  });
}
