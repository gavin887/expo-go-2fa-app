// [AI] Network time calibration utilities

/**
 * Fetch network time from multiple sources with fallback.
 * Uses HTTPS endpoints only (http is often blocked).
 */

const TIME_SOURCES = [
  // NTP Pool project related — HTTP Date header approach
  {
    url: 'https://ntp.pool.org/',
    parse: (res) => new Date(res.headers.get('date')).getTime(),
  },
  // WorldTimeAPI (HTTPS)
  {
    url: 'https://worldtimeapi.org/api/timezone/UTC',
    parse: (res) => res.json().then((d) => new Date(d.utc_datetime).getTime()),
  },
  // TimeAPI.io
  {
    url: 'https://timeapi.io/api/time/current/zone?timeZone=UTC',
    parse: (res) => res.json().then((d) => new Date(d.dateTime).getTime()),
  },
  // Fallback: any reliable HTTPS service with Date header
  {
    url: 'https://www.google.com/generate_204',
    parse: (res) => new Date(res.headers.get('date')).getTime(),
  },
];

async function fetchNetworkTime() {
  for (const source of TIME_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(source.url, {
        signal: controller.signal,
        method: 'HEAD',
      });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const time = await source.parse(response);
      if (time && !isNaN(time)) return time;
    } catch {
      // Try next source
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
