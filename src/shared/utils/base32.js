// [AI] Base32 encode/decode utilities per RFC 4648
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Decode(encoded) {
  encoded = encoded.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (const char of encoded) {
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) throw new Error('Invalid Base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

export function base32Encode(bytes) {
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let encoded = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    encoded += BASE32_CHARS[parseInt(bits.slice(i, i + 5), 2)];
  }
  const remainder = bits.length % 5;
  if (remainder > 0) {
    encoded += BASE32_CHARS[parseInt(bits.slice(bits.length - remainder).padEnd(5, '0'), 2)];
  }
  return encoded;
}

export function isValidBase32(str) {
  if (!str) return false;
  const normalized = String(str).trim().replace(/\s/g, '');
  if (!normalized) return false;
  return /^[A-Z2-7]+=*$/i.test(normalized.replace(/=+$/, ''));
}
