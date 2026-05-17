// [AI] Network time calibration utilities

/**
 * Fetch network time via HTTPS Date header from NTP Pool China.
 * Uses multiple fallback sources for reliability.
 */

const TIME_SOURCES = [
  // NTP Pool China — HEAD request, parse Date header
  {
    url: 'https://www.ntppool.org/zh/',
    method: 'HEAD',
    parse: (res) => {
      const date = res.headers.get('date');
      return date ? new Date(date).getTime() : null;
    },
  },
  // NTP Pool main site (fallback)
  {
    url: 'https://www.ntppool.org/',
    method: 'HEAD',
    parse: (res) => {
      const date = res.headers.get('date');
      return date ? new Date(date).getTime() : null;
    },
  },
  // Google generate_204 (lightweight, reliable)
  {
    url: 'https://www.google.com/generate_204',
    method: 'HEAD',
    parse: (res) => {
      const date = res.headers.get('date');
      return date ? new Date(date).getTime() : null;
    },
  },
];

async function fetchNetworkTime() {
  for (const source of TIME_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(source.url, {
        signal: controller.signal,
        method: source.method || 'GET',
      });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const time = await source.parse(response);
      if (time && !isNaN(time)) return time;
    } catch {
      continue;
    }
  }
  throw new Error('Unable to fetch network time');
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
