import { LocationConfig, PrayerTimesResponse } from '../types';
import { calculateOfflinePrayerTimes } from '../utils/offlinePrayerCalculator';

const CACHE_PREFIX = 'athar_prayer_times_v2_';

export async function fetchPrayerTimes(
  location: LocationConfig,
  methodId: number = 4,
  school: 'standard' | 'hanafi' = 'standard'
): Promise<PrayerTimesResponse> {
  const schoolParam = school === 'hanafi' ? 1 : 0;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const cacheKey = `${CACHE_PREFIX}${location.label}_${methodId}_${schoolParam}_${todayStr}`;

  // 1. Check local cache first for instant speed & offline support
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Failed to read prayer cache:', e);
  }

  // 2. If browser is explicitly offline, compute instantly with astronomical offline engine
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const offlineTimes = calculateOfflinePrayerTimes(location, methodId, school, today);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(offlineTimes));
    } catch {
      // ignore
    }
    return offlineTimes;
  }

  // 3. If online, attempt to fetch from Aladhan API with timeout
  try {
    let url: string;
    if (location.type === 'coords' && location.latitude !== undefined && location.longitude !== undefined) {
      url = `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${methodId}&school=${schoolParam}`;
    } else if (location.city) {
      const country = location.country || '';
      url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(country)}&method=${methodId}&school=${schoolParam}`;
    } else {
      url = `https://api.aladhan.com/v1/timings?latitude=21.4225&longitude=39.8262&method=${methodId}&school=${schoolParam}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.code === 200 && json.data) {
        const result: PrayerTimesResponse = json.data;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result));
        } catch {
          // ignore
        }
        return result;
      }
    }
  } catch (err) {
    console.warn('Network prayer times fetch failed or timed out, switching to 100% offline astronomical calculator:', err);
  }

  // 4. Graceful 100% offline fallback - Never fails
  const offlineResult = calculateOfflinePrayerTimes(location, methodId, school, today);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(offlineResult));
  } catch {
    // ignore
  }
  return offlineResult;
}
