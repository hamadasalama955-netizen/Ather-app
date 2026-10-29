/**
 * Complete Offline Astronomical Prayer Times & Hijri Calendar Calculator
 * 100% Client-side mathematical implementation - Works without network
 */

import { PrayerTimesResponse, LocationConfig, HijriDateInfo, GregorianDateInfo } from '../types';
import { CALCULATION_METHODS, MAKKAH_COORDINATES } from './constants';

const HIJRI_MONTH_NAMES_AR = [
  'المحرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah'
];

const WEEKDAYS_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

const WEEKDAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Calculation Method Parameters: [Fajr Angle, Isha Angle or 0 if fixed min, Isha fixed mins]
interface MethodAngles {
  fajr: number;
  isha: number;
  ishaMins?: number;
}

const METHOD_PARAMS: Record<number, MethodAngles> = {
  4: { fajr: 18.5, isha: 0, ishaMins: 90 }, // Umm Al-Qura
  5: { fajr: 19.5, isha: 17.5 },            // Egyptian General Authority
  3: { fajr: 18.0, isha: 17.0 },            // Muslim World League
  1: { fajr: 18.0, isha: 18.0 },            // Karachi
  2: { fajr: 15.0, isha: 15.0 },            // ISNA
  8: { fajr: 19.5, isha: 0, ishaMins: 90 }, // Gulf
  9: { fajr: 18.0, isha: 17.5 },            // Kuwait
  10: { fajr: 18.0, isha: 0, ishaMins: 90 },// Qatar
  16: { fajr: 18.2, isha: 18.2 },           // Dubai
  21: { fajr: 19.0, isha: 17.0 },           // Morocco
  23: { fajr: 18.0, isha: 18.0 },           // Jordan
  12: { fajr: 12.0, isha: 12.0 },           // France
  13: { fajr: 18.0, isha: 17.0 },           // Turkey
  18: { fajr: 18.0, isha: 18.0 },           // Tunisia
  19: { fajr: 18.0, isha: 17.0 }            // Algeria
};

function d2r(d: number): number {
  return (d * Math.PI) / 180.0;
}

function r2d(r: number): number {
  return (r * 180.0) / Math.PI;
}

function fixHour(a: number): number {
  a = a - 24.0 * Math.floor(a / 24.0);
  return a < 0 ? a + 24.0 : a;
}

function fixAngle(a: number): number {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatHoursToTimeString(hours: number): string {
  hours = fixHour(hours + 0.5 / 60.0); // round to nearest minute
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60.0);
  return `${padZero(h)}:${padZero(m)}`;
}

/**
 * Computes Julian Date from standard Date object
 */
function getJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * Solar position coordinates
 */
function getSunPosition(jd: number): { declination: number; equationOfTime: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g)));

  const e = 23.439 - 0.00000036 * D;
  const d = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(L))));
  let RA = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(L)), Math.cos(d2r(L)))) / 15.0;
  RA = fixHour(RA);

  let EqT = q / 15.0 - RA;
  if (EqT > 12) EqT -= 24;
  if (EqT < -12) EqT += 24;

  return { declination: d, equationOfTime: EqT };
}

/**
 * Sun angle time for prayer calculations
 */
function getSunAngleTime(angle: number, declination: number, lat: number, isSunset: boolean = false): number | null {
  const sinAngle = -Math.sin(d2r(angle));
  const numerator = sinAngle - Math.sin(d2r(lat)) * Math.sin(d2r(declination));
  const denominator = Math.cos(d2r(lat)) * Math.cos(d2r(declination));
  const cosDiff = numerator / denominator;

  if (cosDiff < -1.0 || cosDiff > 1.0) {
    return null; // Sun never reaches this angle (polar night/day)
  }

  const diffHours = r2d(Math.acos(cosDiff)) / 15.0;
  return isSunset ? diffHours : -diffHours;
}

/**
 * Asr time calculation by shadow multiplier
 */
function getAsrHour(shadowRatio: number, declination: number, lat: number): number {
  const angle = -r2d(Math.atan(1.0 / (shadowRatio + Math.tan(d2r(Math.abs(lat - declination))))));
  const diffHours = getSunAngleTime(angle, declination, lat, true);
  return diffHours ?? 3.0; // fallback ~3 hours after noon
}

/**
 * Converts Gregorian Date to Accurate Hijri Date
 */
export function getAstronomicalHijriDate(date: Date, adjustmentDays: number = 0): HijriDateInfo {
  const adjusted = new Date(date);
  if (adjustmentDays !== 0) {
    adjusted.setDate(adjusted.getDate() + adjustmentDays);
  }

  const day = adjusted.getDate();
  const month = adjusted.getMonth();
  const year = adjusted.getFullYear();
  const dayOfWeek = adjusted.getDay();

  // Kuwaiti / Algorithmic astronomical calendar conversion
  let jd = getJulianDate(adjusted);
  jd = Math.floor(jd) + 0.5;

  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  const hijriMonthIdx = Math.max(0, Math.min(11, m - 1));

  return {
    date: `${padZero(d)}-${padZero(m)}-${y}`,
    format: 'DD-MM-YYYY',
    day: d.toString(),
    weekday: {
      en: WEEKDAYS_EN[dayOfWeek],
      ar: WEEKDAYS_AR[dayOfWeek]
    },
    month: {
      number: m,
      en: HIJRI_MONTH_NAMES_EN[hijriMonthIdx],
      ar: HIJRI_MONTH_NAMES_AR[hijriMonthIdx]
    },
    year: y.toString(),
    designation: {
      abbreviated: 'هـ',
      expanded: 'هجرية'
    },
    holidays: []
  };
}

/**
 * Determines whether a location is located within Egypt
 */
export function isEgyptLocation(location: LocationConfig): boolean {
  if (!location) return false;
  if (location.country?.toLowerCase() === 'egypt' || location.country?.includes('مصر')) return true;
  if (location.label?.includes('مصر') || location.label?.includes('القاهرة') || location.label?.includes('الإسكندرية') || location.label?.includes('الجيزة')) return true;
  const city = location.city?.toLowerCase() || '';
  if (city === 'cairo' || city === 'alexandria' || city === 'giza' || city === 'mansoura' || city === 'tanta' || city === 'asyut' || city === 'luxor' || city === 'aswan') return true;
  if (location.latitude !== undefined && location.longitude !== undefined) {
    if (location.latitude >= 21.5 && location.latitude <= 32.0 && location.longitude >= 24.5 && location.longitude <= 36.8) {
      return true;
    }
  }
  return false;
}

/**
 * Main offline calculation function
 */
export function calculateOfflinePrayerTimes(
  location: LocationConfig,
  methodId: number = 4,
  school: 'standard' | 'hanafi' = 'standard',
  date: Date = new Date()
): PrayerTimesResponse {
  const isEgypt = isEgyptLocation(location);
  const effectiveMethodId = (isEgypt && methodId === 4) ? 5 : methodId; // Egyptian General Authority

  const lat = location.latitude ?? (location.city ? MAKKAH_COORDINATES.latitude : MAKKAH_COORDINATES.latitude);
  const lng = location.longitude ?? (location.city ? MAKKAH_COORDINATES.longitude : MAKKAH_COORDINATES.longitude);
  
  // Local timezone offset in hours
  let timezoneOffsetHours = -date.getTimezoneOffset() / 60.0;

  // Egypt Winter Time (التوقيت الشتوي لمصر - UTC+2):
  // Egypt DST ends in late October and reverts to Standard Winter Time UTC+2.
  if (isEgypt) {
    timezoneOffsetHours = 2.0; // Strictly UTC+2 for Egypt Standard Winter Time
  }

  const jd = getJulianDate(date);
  const { declination, equationOfTime } = getSunPosition(jd);

  // Solar noon (Dhuhr)
  const dhuhrHour = fixHour(12.0 + timezoneOffsetHours - lng / 15.0 - equationOfTime);

  // Sunrise and Sunset (standard depression 0.833 deg)
  const sunriseDepression = 0.833;
  const sunriseDiff = getSunAngleTime(sunriseDepression, declination, lat, false) ?? -6.0;
  const sunsetDiff = getSunAngleTime(sunriseDepression, declination, lat, true) ?? 6.0;

  const sunriseHour = fixHour(dhuhrHour + sunriseDiff);
  const sunsetHour = fixHour(dhuhrHour + sunsetDiff); // Maghrib

  // Method parameters
  const methodParams = METHOD_PARAMS[effectiveMethodId] || METHOD_PARAMS[4];

  // Fajr
  const fajrDiff = getSunAngleTime(methodParams.fajr, declination, lat, false) ?? -7.5;
  const fajrHour = fixHour(dhuhrHour + fajrDiff);

  // Asr
  const shadowMultiplier = school === 'hanafi' ? 2.0 : 1.0;
  const asrDiff = getAsrHour(shadowMultiplier, declination, lat);
  const asrHour = fixHour(dhuhrHour + asrDiff);

  // Maghrib is Sunset
  const maghribHour = sunsetHour;

  // Isha
  let ishaHour: number;
  if (methodParams.ishaMins) {
    ishaHour = fixHour(maghribHour + methodParams.ishaMins / 60.0);
  } else {
    const ishaDiff = getSunAngleTime(methodParams.isha || 17.5, declination, lat, true) ?? 7.5;
    ishaHour = fixHour(dhuhrHour + ishaDiff);
  }

  // Midnight (halfway between sunset and next sunrise)
  let nightLength = sunriseHour - sunsetHour;
  if (nightLength < 0) nightLength += 24;
  const midnightHour = fixHour(sunsetHour + nightLength / 2.0);
  const lastThirdHour = fixHour(sunsetHour + (2.0 / 3.0) * nightLength);

  const timings: Record<string, string> = {
    Fajr: formatHoursToTimeString(fajrHour),
    Sunrise: formatHoursToTimeString(sunriseHour),
    Dhuhr: formatHoursToTimeString(dhuhrHour),
    Asr: formatHoursToTimeString(asrHour),
    Sunset: formatHoursToTimeString(sunsetHour),
    Maghrib: formatHoursToTimeString(maghribHour),
    Isha: formatHoursToTimeString(ishaHour),
    Imsak: formatHoursToTimeString(fajrHour - 10 / 60),
    Midnight: formatHoursToTimeString(midnightHour),
    Firstthird: formatHoursToTimeString(sunsetHour + nightLength / 3.0),
    Lastthird: formatHoursToTimeString(lastThirdHour)
  };

  const hijri = getAstronomicalHijriDate(date);

  const gregorian: GregorianDateInfo = {
    date: `${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()}`,
    day: padZero(date.getDate()),
    weekday: {
      en: WEEKDAYS_EN[date.getDay()],
      ar: WEEKDAYS_AR[date.getDay()]
    },
    month: {
      number: date.getMonth() + 1,
      en: date.toLocaleString('en-US', { month: 'long' }),
      ar: date.toLocaleString('ar-SA', { month: 'long' })
    },
    year: date.getFullYear().toString()
  };

  const methodName = CALCULATION_METHODS.find((m) => m.id === methodId)?.arabicName || 'حساب فلكي دقيق معتمد';

  return {
    timings,
    date: {
      readable: `${padZero(date.getDate())} ${gregorian.month.ar || ''} ${date.getFullYear()}`,
      timestamp: Math.floor(date.getTime() / 1000).toString(),
      hijri,
      gregorian
    },
    meta: {
      latitude: lat,
      longitude: lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Auto',
      method: {
        id: methodId,
        name: methodName
      }
    }
  };
}
