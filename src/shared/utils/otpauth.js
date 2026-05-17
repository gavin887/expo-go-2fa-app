// [AI] otpauth:// URL parser and builder per RFC 6238/4226
export function parseOtpauthUrl(url) {
  if (!url.startsWith('otpauth://')) return null;

  try {
    const parsed = new URL(url);
    const type = parsed.hostname; // 'totp' or 'hotp'
    const label = decodeURIComponent(parsed.pathname.slice(1));
    const params = parsed.searchParams;

    let issuer = params.get('issuer') || '';
    let account = label;

    if (label.includes(':')) {
      const [iss, acc] = label.split(':');
      if (!issuer) issuer = iss.trim();
      account = acc ? acc.trim() : iss.trim();
    }

    const secret = params.get('secret');
    const algorithm = (params.get('algorithm') || 'SHA1').toUpperCase();
    const digits = parseInt(params.get('digits') || '6', 10);
    const period = parseInt(params.get('period') || '30', 10);
    const counter = params.get('counter') ? parseInt(params.get('counter'), 10) : undefined;

    if (!secret) return null;

    return {
      type,
      issuer,
      account,
      secret,
      algorithm,
      digits,
      period,
      counter,
    };
  } catch {
    return null;
  }
}

export function buildOtpauthUrl({ type, issuer, account, secret, algorithm, digits, period, counter }) {
  const params = new URLSearchParams({
    issuer,
    secret,
    algorithm,
    digits: String(digits),
    period: String(period),
  });
  if (type === 'hotp' && counter !== undefined) {
    params.set('counter', String(counter));
  }
  const label = issuer ? `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}` : encodeURIComponent(account);
  return `otpauth://${type}/${label}?${params.toString()}`;
}
