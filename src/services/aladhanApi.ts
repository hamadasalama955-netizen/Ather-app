import { LocationConfig, PrayerTimesResponse } from '../types';
import { calculateOfflinePrayerTimes, isEgyptLocation } from '../utils/offlinePrayerCalculator';

const CACHE_PREFIX = 'athar_prayer_times_v4_winter_';

/**
 * Ensures Egypt Winter Time (UTC+2) is strictly applied
 * If the source returned UTC+3 daylight saving time, shifts prayer times back by 1 hour.
 */
function normalizeEgyptWinterTimes(result: PrayerTimesResponse, location: LocationConfig): PrayerTimesResponse {
  if (!isEgyptLocation(location) || !result?.timings) {
    return result;
  }

  // In Cairo during winter (UTC+2), Maghrib is between 16:55 and 17:25.
  // If Maghrib hour is >= 18 (e.g. 18:05), daylight saving time (UTC+3) was returned.
  const maghribStr = result.timings.Maghrib || '';
  const [hStr] = maghribStr.split(':');
  const h = parseInt(hStr, 10);

  if (!isNaN(h) && h >= 18) {
    const updatedTimings: Record<string, string> = {};
    for (const [k, v] of Object.entries(result.timings)) {
      if (typeof v === 'string' && v.includes(':')) {
        const parts = v.split(':');
        let hour = parseInt(parts[0], 10);
        const mins = parts[1];
        if (!isNaN(hour)) {
          hour = (hour - 1 + 24) % 24;
          updatedTimings[k] = `${hour.toString().padStart(2, '0')}:${mins}`;
        } else {
          updatedTimings[k] = v;
        }
      } else {
        updatedTimings[k] = v;
      }
    }
    return {
      ...result,
      timings: updatedTimings,
    };
  }

  return result;
}

export async function fetchPrayerTimes(
  location: LocationConfig,
  methodId: number = 4,
  school: 'standard' | 'hanafi' = 'standard'
): Promise<PrayerTimesResponse> {
  const schoolParam = school === 'hanafi' ? 1 : 0;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const isEgypt = isEgyptLocation(location);
  const effectiveMethodId = (isEgypt && methodId === 4) ? 5 : methodId; // Egyptian Authority
  const cacheKey = `${CACHE_PREFIX}${location.label}_${effectiveMethodId}_${schoolParam}_${todayStr}`;

  // 1. Check local cache first for instant speed & offline support
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return normalizeEgyptWinterTimes(JSON.parse(cached), location);
    }
  } catch (e) {
    console.warn('Failed to read prayer cache:', e);
  }

  // 2. If browser is explicitly offline, compute instantly with astronomical offline engine
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const offlineTimes = normalizeEgyptWinterTimes(
      calculateOfflinePrayerTimes(location, effectiveMethodId, school, today),
      location
    );
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
      url = `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${effectiveMethodId}&school=${schoolParam}`;
    } else if (location.city) {
      const country = location.country || '';
      url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(country)}&method=${effectiveMethodId}&school=${schoolParam}`;
    } else {
      url = `https://api.aladhan.com/v1/timings?latitude=21.4225&longitude=39.8262&method=${effectiveMethodId}&school=${schoolParam}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.code === 200 && json.data) {
        const result: PrayerTimesResponse = normalizeEgyptWinterTimes(json.data, location);
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
  const offlineResult = normalizeEgyptWinterTimes(
    calculateOfflinePrayerTimes(location, effectiveMethodId, school, today),
    location
  );
  try {
    localStorage.setItem(cacheKey, JSON.stringify(offlineResult));
  } catch {
    // ignore
  }
  return offlineResult;
}
