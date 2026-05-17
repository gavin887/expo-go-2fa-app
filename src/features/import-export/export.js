// [AI] Account export functionality
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { buildOtpauthUrl } from '../../shared/utils/otpauth';

export async function exportAsSecrets(accounts) {
  const content = accounts.map((a) => a.secret).join('\n');
  return await shareText(content, 'secrets.txt');
}

export async function exportAsOtpauthUrls(accounts) {
  const content = accounts
    .map((a) =>
      buildOtpauthUrl({
        type: a.type || 'totp',
        issuer: a.issuer,
        account: a.account,
        secret: a.secret,
        algorithm: a.algorithm,
        digits: a.digits,
        period: a.period,
        counter: a.counter,
      })
    )
    .join('\n');
  return await shareText(content, 'otpauth-urls.txt');
}

async function shareText(content, filename) {
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, content);
  await Sharing.shareAsync(fileUri, {
    mimeType: 'text/plain',
    UTI: 'public.plain-text',
  });
}
