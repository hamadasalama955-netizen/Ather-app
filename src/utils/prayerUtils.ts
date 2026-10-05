import { PrayerKey, PrayerInfo } from '../types';
import { PRAYER_NAMES_ARABIC, MAKKAH_COORDINATES } from './constants';

export const ORDERED_PRAYERS: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/**
 * Strips any timezone info like "(EST)" or seconds and returns "HH:mm"
 */
export function cleanTimeString(timeStr?: string): string {
  if (!timeStr) return '--:--';
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return timeStr;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

/**
 * Format "HH:mm" into Arabic 12-hour or 24-hour string
 */
export function formatArabicTime(timeStr: string, is24h: boolean = false): string {
  const cleaned = cleanTimeString(timeStr);
  if (cleaned === '--:--') return cleaned;

  const [hoursStr, minutesStr] = cleaned.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;

  if (is24h) {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${period}`;
}

/**
 * Converts a time string "HH:mm" to a Date object for a specific base date
 */
export function parseTimeToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const cleaned = cleanTimeString(timeStr);
  const [hours, minutes] = cleaned.split(':').map((val) => parseInt(val, 10));
  const date = new Date(baseDate);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

export interface NextPrayerResult {
  nextPrayer: PrayerKey;
  nextPrayerArabic: string;
  nextPrayerTime: string;
  nextPrayerDate: Date;
  prevPrayer: PrayerKey;
  prevPrayerArabic: string;
  prevPrayerTime: string;
  prevPrayerDate: Date;
  timeRemainingSeconds: number;
  formattedCountdown: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  progressPercent: number; // 0 to 100
}

/**
 * Determines the next and previous prayer and computes accurate countdown and progress
 */
export function calculateNextPrayer(
  timings: Record<string, string>,
  now: Date = new Date()
): NextPrayerResult | null {
  if (!timings || !timings.Fajr) return null;

  const prayersWithDates = ORDERED_PRAYERS.map((key) => {
    const rawTime = timings[key];
    const cleaned = cleanTimeString(rawTime);
    const date = parseTimeToDate(cleaned, now);
    return {
      key,
      arabicName: PRAYER_NAMES_ARABIC[key] || key,
      time: cleaned,
      date,
    };
  });

  // Find next prayer today
  let nextIndex = prayersWithDates.findIndex((p) => p.date.getTime() > now.getTime());
  let prevIndex: number;
  let nextPrayerDate: Date;
  let prevPrayerDate: Date;
  let nextPrayerKey: PrayerKey;
  let prevPrayerKey: PrayerKey;

  if (nextIndex === -1) {
    // All prayers for today have passed; next prayer is Fajr tomorrow
    nextIndex = 0;
    prevIndex = prayersWithDates.length - 1; // Isha today

    const tomorrowFajr = new Date(prayersWithDates[0].date);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);

    nextPrayerDate = tomorrowFajr;
    nextPrayerKey = prayersWithDates[0].key;
    prevPrayerDate = prayersWithDates[prevIndex].date;
    prevPrayerKey = prayersWithDates[prevIndex].key;
  } else if (nextIndex === 0) {
    // Before Fajr today; previous prayer was yesterday's Isha
    prevIndex = prayersWithDates.length - 1;

    const yesterdayIsha = new Date(prayersWithDates[prevIndex].date);
    yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);

    nextPrayerDate = prayersWithDates[0].date;
    nextPrayerKey = prayersWithDates[0].key;
    prevPrayerDate = yesterdayIsha;
    prevPrayerKey = prayersWithDates[prevIndex].key;
  } else {
    // Between two prayers today
    prevIndex = nextIndex - 1;
    nextPrayerDate = prayersWithDates[nextIndex].date;
    nextPrayerKey = prayersWithDates[nextIndex].key;
    prevPrayerDate = prayersWithDates[prevIndex].date;
    prevPrayerKey = prayersWithDates[prevIndex].key;
  }

  const diffMs = Math.max(0, nextPrayerDate.getTime() - now.getTime());
  const timeRemainingSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(timeRemainingSeconds / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;

  // Calculate progress from prev prayer to next prayer
  const totalWindowMs = nextPrayerDate.getTime() - prevPrayerDate.getTime();
  const elapsedMs = now.getTime() - prevPrayerDate.getTime();
  const progressPercent = totalWindowMs > 0
    ? Math.min(100, Math.max(0, Math.round((elapsedMs / totalWindowMs) * 100)))
    : 0;

  return {
    nextPrayer: nextPrayerKey,
    nextPrayerArabic: PRAYER_NAMES_ARABIC[nextPrayerKey],
    nextPrayerTime: timings[nextPrayerKey],
    nextPrayerDate,
    prevPrayer: prevPrayerKey,
    prevPrayerArabic: PRAYER_NAMES_ARABIC[prevPrayerKey],
    prevPrayerTime: timings[prevPrayerKey],
    prevPrayerDate,
    timeRemainingSeconds,
    formattedCountdown: {
      hours,
      minutes,
      seconds,
    },
    progressPercent,
  };
}

/**
 * Returns prayer timeline items with statuses
 */
export function getDailyPrayerList(
  timings: Record<string, string>,
  nextKey?: PrayerKey,
  now: Date = new Date()
): PrayerInfo[] {
  if (!timings) return [];

  return ORDERED_PRAYERS.map((key) => {
    const rawTime = timings[key];
    const cleaned = cleanTimeString(rawTime);
    const date = parseTimeToDate(cleaned, now);
    const isNext = key === nextKey;
    const isPassed = !isNext && date.getTime() <= now.getTime();
    const isCurrent = false; // Could be computed if prayer window is active

    return {
      key,
      arabicName: PRAYER_NAMES_ARABIC[key] || key,
      time: cleaned,
      isNext,
      isPassed,
      isCurrent,
    };
  });
}

/**
 * Calculates bearing towards Makkah (Qibla) in degrees (0 to 360)
 */
export function calculateQiblaDegree(latitude: number, longitude: number): number {
  const phiK = (MAKKAH_COORDINATES.latitude * Math.PI) / 180.0;
  const lambdaK = (MAKKAH_COORDINATES.longitude * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let qibla = (Math.atan2(y, x) * 180.0) / Math.PI;
  qibla = (qibla + 360.0) % 360.0;
  return Math.round(qibla);
}
