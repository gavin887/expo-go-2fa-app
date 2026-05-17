# 计划 2: 核心 OTP 算法模块

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 TOTP/HOTP 算法、时间校准、otpauth URL 解析

**Architecture:** 纯 JavaScript 实现 RFC 6238 (TOTP) 和 RFC 4226 (HOTP)，不依赖原生模块

**Tech Stack:** jsSHA (或纯 JS HMAC), ntp-client

---

### Task 2.1: Base32 编解码

**Files:**
- Create: `src/shared/utils/base32.js`

- [ ] **Step 1: 创建 Base32 工具**

```javascript
// src/shared/utils/base32.js
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
  return /^[A-Z2-7]+=*$/i.test(str.replace(/=+$/, ''));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/utils/base32.js
git commit -m "[AI] feat: add base32 encode/decode utilities"
```

---

### Task 2.2: otpauth URL 解析

**Files:**
- Create: `src/shared/utils/otpauth.js`

- [ ] **Step 1: 创建 otpauth 解析器**

```javascript
// src/shared/utils/otpauth.js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/utils/otpauth.js
git commit -m "[AI] feat: add otpauth URL parser and builder"
```

---

### Task 2.3: TOTP 实现

**Files:**
- Create: `src/features/otp/totp.js`

- [ ] **Step 1: 安装 jsSHA**

```bash
npm install jssha
```

- [ ] **Step 2: 实现 TOTP**

```javascript
// src/features/otp/totp.js
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
```

- [ ] **Step 3: Commit**

```bash
git add src/features/otp/totp.js
git commit -m "[AI] feat: implement TOTP/HOTP algorithm per RFC 6238/4226"
```

---

### Task 2.4: 时间校准

**Files:**
- Create: `src/features/otp/time-sync.js`

- [ ] **Step 1: 实现时间校准**

```javascript
// src/features/otp/time-sync.js
import { Platform } from 'react-native';

// Simple HTTP time sync using worldtimeapi or similar
async function fetchNetworkTime() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('http://worldtimeapi.org/api/timezone/UTC', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('Network time fetch failed');
    const data = await response.json();
    return new Date(data.utc_datetime).getTime();
  } catch {
    // Fallback: use worldclockapi
    return fetchWorldClockApiTime();
  }
}

async function fetchWorldClockApiTime() {
  try {
    const response = await fetch('http://worldclockapi.com/api/json/utc/now', {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return new Date(data.$dt).getTime();
  } catch {
    throw new Error('Unable to fetch network time');
  }
}

export async function calibrateTime() {
  const networkTime = await fetchNetworkTime();
  const localTime = Date.now();
  const offset = networkTime - localTime;
  return {
    offset,
    calibratedAt: new Date(),
  };
}

export function getAdjustedTime(offset = 0) {
  return Date.now() + offset;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/otp/time-sync.js
git commit -m "[AI] feat: add network time calibration"
```
