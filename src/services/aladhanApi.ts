import { LocationConfig, PrayerTimesResponse } from '../types';
import { calculateOfflinePrayerTimes, isEgyptLocation } from '../utils/offlinePrayerCalculator';

const CACHE_PREFIX = 'athar_prayer_times_v5_seasonal_';

/**
 * Checks if a given date falls within Egypt's official Daylight Saving Time (Summer Time: UTC+3)
 * or Standard Time (Winter Time: UTC+2).
 * Egypt DST rule:
 * - Begins: Last Friday of April at 00:00 (UTC+3)
 * - Ends: Last Thursday of October at 24:00 / Last Friday of October at 00:00 (UTC+2)
 */
export function isEgyptSummerTime(date: Date = new Date()): boolean {
  const year = date.getFullYear();

  // Find last Friday of April
  // April has 30 days (month index 3)
  const apr30 = new Date(year, 3, 30);
  const aprLastFridayDay = 30 - ((apr30.getDay() + 2) % 7);
  const dstStart = new Date(year, 3, aprLastFridayDay, 0, 0, 0);

  // Find last Thursday of October (month index 9, 31 days)
  const oct31 = new Date(year, 9, 31);
  const octLastThursdayDay = 31 - ((oct31.getDay() + 3) % 7);
  const dstEnd = new Date(year, 9, octLastThursdayDay, 24, 0, 0);

  return date.getTime() >= dstStart.getTime() && date.getTime() < dstEnd.getTime();
}

/**
 * Synchronizes prayer times with Egypt's Winter / Summer Time and the user's device clock.
 * Guarantees that in winter (UTC+2) times are exact winter times, and in summer (UTC+3) times
 * are exact summer times, matching the device's clock dynamically.
 */
function normalizeSeasonalTimes(result: PrayerTimesResponse, location: LocationConfig, date: Date = new Date()): PrayerTimesResponse {
  if (!isEgyptLocation(location) || !result?.timings) {
    return result;
  }

  const inSummer = isEgyptSummerTime(date);
  const maghribStr = result.timings.Maghrib || '';
  const [hStr] = maghribStr.split(':');
  const h = parseInt(hStr, 10);

  if (isNaN(h)) return result;

  // Expected Maghrib in Cairo:
  // In winter (UTC+2): Maghrib is ~17:00 (between 16:50 and 17:35).
  // In summer (UTC+3): Maghrib is ~18:30 - 19:00 (between 18:20 and 19:10).
  const isSummerFormatted = h >= 18;

  let shiftHours = 0;
  if (!inSummer && isSummerFormatted) {
    // Current season is Winter, but API returned Summer time -> shift -1 hour
    shiftHours = -1;
  } else if (inSummer && !isSummerFormatted) {
    // Current season is Summer, but API returned Winter time -> shift +1 hour
    shiftHours = 1;
  }

  if (shiftHours !== 0) {
    const updatedTimings: Record<string, string> = {};
    for (const [k, v] of Object.entries(result.timings)) {
      if (typeof v === 'string' && v.includes(':')) {
        const parts = v.split(':');
        let hour = parseInt(parts[0], 10);
        const mins = parts[1];
        if (!isNaN(hour)) {
          hour = (hour + shiftHours + 24) % 24;
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
  const seasonTag = isEgyptSummerTime(today) ? 'summer' : 'winter';
  const cacheKey = `${CACHE_PREFIX}${location.label}_${effectiveMethodId}_${schoolParam}_${todayStr}_${seasonTag}`;

  // 1. Check local cache first for instant speed & offline support
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return normalizeSeasonalTimes(JSON.parse(cached), location, today);
    }
  } catch (e) {
    console.warn('Failed to read prayer cache:', e);
  }

  // 2. If browser is offline, compute instantly with astronomical offline engine
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const offlineTimes = normalizeSeasonalTimes(
      calculateOfflinePrayerTimes(location, effectiveMethodId, school, today),
      location,
      today
    );
    try {
      localStorage.setItem(cacheKey, JSON.stringify(offlineTimes));
    } catch {
      // ignore
    }
    return offlineTimes;
  }

  // 3. If online, fetch from Aladhan API with timeout
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
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Aladhan API responded with status ${response.status}`);
    }

    const data: { code: number; data: PrayerTimesResponse } = await response.json();
    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid response structure from prayer times API');
    }

    const normalizedResult = normalizeSeasonalTimes(data.data, location, today);

    try {
      localStorage.setItem(cacheKey, JSON.stringify(normalizedResult));
    } catch (e) {
      console.warn('Failed to cache prayer times:', e);
    }

    return normalizedResult;
  } catch (err: unknown) {
    console.warn('Online fetch failed, switching to astronomical calculation:', err);
    // Reliable offline mathematical fallback
    const offlineTimes = normalizeSeasonalTimes(
      calculateOfflinePrayerTimes(location, effectiveMethodId, school, today),
      location,
      today
    );
    return offlineTimes;
  }
}
