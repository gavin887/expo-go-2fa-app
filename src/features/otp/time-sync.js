// [AI] Network time calibration utilities
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
