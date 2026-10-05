import { LocationConfig, PrayerTimesResponse } from '../types';

const CACHE_PREFIX = 'noor_prayer_times_';

export async function fetchPrayerTimes(
  location: LocationConfig,
  methodId: number = 4,
  school: 'standard' | 'hanafi' = 'standard'
): Promise<PrayerTimesResponse> {
  const schoolParam = school === 'hanafi' ? 1 : 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = `${CACHE_PREFIX}${location.label}_${methodId}_${schoolParam}_${todayStr}`;

  // Check cache first for instant speed & offline support
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to read cache:', e);
  }

  let url: string;
  if (location.type === 'coords' && location.latitude !== undefined && location.longitude !== undefined) {
    url = `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${methodId}&school=${schoolParam}`;
  } else if (location.city) {
    const country = location.country || '';
    url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(country)}&method=${methodId}&school=${schoolParam}`;
  } else {
    // Default to Makkah
    url = `https://api.aladhan.com/v1/timings?latitude=21.4225&longitude=39.8262&method=${methodId}&school=${schoolParam}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`تعذر جلب مواقيت الصلاة من خادم الأذان (الرمز: ${response.status})`);
  }

  const json = await response.json();
  if (json.code !== 200 || !json.data) {
    throw new Error(json.data || 'استجابة غير صحيحة من خدمة المواقيت');
  }

  const result: PrayerTimesResponse = json.data;

  // Cache in localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (e) {
    console.warn('Failed to write prayer cache:', e);
  }

  return result;
}
