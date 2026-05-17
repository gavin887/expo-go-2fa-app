// [AI] TOTP/HOTP algorithm implementation per RFC 6238/4226
import jsSHA from 'jssha';
import { base32Decode } from '../../shared/utils/base32';

function hmacSha1(key, message) {
  const shaObj = new jsSHA('SHA-1', 'ARRAYBUFFER');
  shaObj.setHMACKey(key, 'ARRAYBUFFER');
  shaObj.update(message);
  return new Uint8Array(shaObj.getHMAC('ARRAYBUFFER'));
}

function hotpGenerate(secret, counter, digits = 6, algorithm = 'SHA1') {
  const key = base32Decode(secret);
  const counterBytes = new Uint8Array(8);
  let cnt = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = cnt & 0xff;
    cnt = Math.floor(cnt / 256);
  }

  const hmac = hmacSha1(key, counterBytes);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = code % Math.pow(10, digits);
  return String(otp).padStart(digits, '0');
}

function totpGenerate(secret, timeOffset = 0, digits = 6, period = 30, algorithm = 'SHA1') {
  const now = Math.floor((Date.now() + timeOffset) / 1000);
  const counter = Math.floor(now / period);
  return hotpGenerate(secret, counter, digits, algorithm);
}

function getTimeRemaining(timeOffset = 0, period = 30) {
  const now = Math.floor((Date.now() + timeOffset) / 1000);
  return period - (now % period);
}

export { hotpGenerate, totpGenerate, getTimeRemaining };
