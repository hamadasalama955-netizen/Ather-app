import { PrayerLog, DayStats, WeeklyAnalytics } from '../types';

const STORAGE_KEY_PREFIX = 'nur_al_huda_prayer_log_';
const BEST_STREAK_KEY = 'nur_al_huda_best_streak';
const HIJRI_ADJUSTMENT_KEY = 'nur_al_huda_hijri_adjustment';
const QURAN_WARD_KEY = 'nur_al_huda_quran_ward';

export function getTodayDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultPrayerLog(): PrayerLog {
  return {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,

    fajrSunnah: false,
    dhuhrSunnahBefore: false,
    dhuhrSunnahAfter: false,
    maghribSunnah: false,
    ishaSunnah: false,

    duha: false,
    witr: false,

    quranPagesRead: 0,
    quranPageTarget: 4,
    quranCompleted: false,
    currentPageNumber: 1,

    updatedAt: Date.now(),
  };
}

export function getPrayerLog(dateKey: string = getTodayDateKey()): PrayerLog {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${dateKey}`);
    if (!raw) return createDefaultPrayerLog();
    const parsed = JSON.parse(raw);
    return { ...createDefaultPrayerLog(), ...parsed };
  } catch (e) {
    console.error('Failed to get prayer log from localStorage', e);
    return createDefaultPrayerLog();
  }
}

export function savePrayerLog(dateKey: string, log: PrayerLog): void {
  try {
    const updated = { ...log, updatedAt: Date.now() };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${dateKey}`, JSON.stringify(updated));
    updateBestStreak();
  } catch (e) {
    console.error('Failed to save prayer log to localStorage', e);
  }
}

/**
 * Calculates fard count (0-5)
 */
export function countFardPrayers(log: PrayerLog): number {
  let count = 0;
  if (log.fajr) count++;
  if (log.dhuhr) count++;
  if (log.asr) count++;
  if (log.maghrib) count++;
  if (log.isha) count++;
  return count;
}

/**
 * Calculates sunnah/nawafil count (0-7)
 */
export function countSunanPrayers(log: PrayerLog): number {
  let count = 0;
  if (log.fajrSunnah) count++;
  if (log.dhuhrSunnahBefore) count++;
  if (log.dhuhrSunnahAfter) count++;
  if (log.maghribSunnah) count++;
  if (log.ishaSunnah) count++;
  if (log.duha) count++;
  if (log.witr) count++;
  return count;
}

/**
 * Computes commitment score percentage for a day (Fard is weighted 70%, Sunnah 20%, Quran 10%)
 */
export function calculateDayScore(log: PrayerLog): number {
  const fard = countFardPrayers(log);
  const sunnah = countSunanPrayers(log);
  const quranDone = log.quranCompleted || log.quranPagesRead >= log.quranPageTarget ? 1 : 0;

  const fardScore = (fard / 5) * 70;
  const sunnahScore = (sunnah / 7) * 20;
  const quranScore = quranDone * 10;

  return Math.round(fardScore + sunnahScore + quranScore);
}

/**
 * Check whether a day is considered "committed" for maintaining a streak (at least 4 fard prayers)
 */
function isDayCommitted(log: PrayerLog): boolean {
  return countFardPrayers(log) >= 4;
}

/**
 * Calculates current streak (consecutive days of commitment)
 */
export function calculateCurrentStreak(): number {
  const today = new Date();
  let streak = 0;

  // Check today first
  const todayKey = getTodayDateKey(today);
  const todayLog = getPrayerLog(todayKey);
  const isTodayDone = isDayCommitted(todayLog);

  if (isTodayDone) {
    streak++;
  }

  // Iterate backwards from yesterday up to 365 days
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - 1);

  while (true) {
    const key = getTodayDateKey(currentDate);
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!raw) {
      break;
    }
    try {
      const log = JSON.parse(raw);
      if (isDayCommitted(log)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  return streak;
}

function updateBestStreak(): void {
  const current = calculateCurrentStreak();
  const storedBest = getBestStreak();
  if (current > storedBest) {
    localStorage.setItem(BEST_STREAK_KEY, String(current));
  }
}

export function getBestStreak(): number {
  try {
    const val = localStorage.getItem(BEST_STREAK_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/**
 * Gets weekly statistics for the past 7 days (including today)
 */
export function getWeeklyAnalytics(): WeeklyAnalytics {
  const today = new Date();
  const days: DayStats[] = [];
  let totalPrayersThisWeek = 0;
  let totalPossiblePrayers = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getTodayDateKey(d);
    const log = getPrayerLog(key);
    const fardCount = countFardPrayers(log);
    const sunnahCount = countSunanPrayers(log);
    const dayScore = calculateDayScore(log);
    const dayName = ARABIC_DAYS[d.getDay()];

    totalPrayersThisWeek += fardCount + sunnahCount;
    totalPossiblePrayers += 12; // 5 fard + 7 sunan/nawafil

    days.push({
      dateKey: key,
      dayName,
      fardCount,
      sunnahCount,
      totalScorePercent: dayScore,
      quranCompleted: log.quranCompleted,
      isToday: i === 0,
    });
  }

  const weeklyPercentage =
    totalPossiblePrayers > 0
      ? Math.round((totalPrayersThisWeek / totalPossiblePrayers) * 100)
      : 0;

  return {
    streakDays: calculateCurrentStreak(),
    bestStreakDays: Math.max(getBestStreak(), calculateCurrentStreak()),
    totalPrayersThisWeek,
    weeklyPercentage,
    days,
  };
}

/**
 * Hijri adjustment offset setting (-2 to +2 days)
 */
export function getHijriAdjustment(): number {
  try {
    const stored = localStorage.getItem(HIJRI_ADJUSTMENT_KEY);
    return stored !== null ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function setHijriAdjustment(offset: number): void {
  try {
    localStorage.setItem(HIJRI_ADJUSTMENT_KEY, String(offset));
  } catch (e) {
    console.error('Failed to save hijri adjustment', e);
  }
}

/**
 * Quran reading position storage
 */
export interface QuranWardPosition {
  currentPage: number;
  pagesReadToday: number;
  completedToday: boolean;
  targetPages: number;
}

export function getQuranWardPosition(): QuranWardPosition {
  try {
    const todayLog = getPrayerLog();
    const stored = localStorage.getItem(QURAN_WARD_KEY);
    const parsed = stored ? JSON.parse(stored) : { currentPage: 1, targetPages: 4 };

    return {
      currentPage: todayLog.currentPageNumber || parsed.currentPage || 1,
      pagesReadToday: todayLog.quranPagesRead || 0,
      completedToday: todayLog.quranCompleted || false,
      targetPages: todayLog.quranPageTarget || parsed.targetPages || 4,
    };
  } catch {
    return { currentPage: 1, pagesReadToday: 0, completedToday: false, targetPages: 4 };
  }
}

export function saveQuranWardPosition(pos: Partial<QuranWardPosition>): void {
  try {
    const current = getQuranWardPosition();
    const merged = { ...current, ...pos };
    localStorage.setItem(QURAN_WARD_KEY, JSON.stringify(merged));

    // Also update today's log
    const todayKey = getTodayDateKey();
    const log = getPrayerLog(todayKey);
    log.currentPageNumber = merged.currentPage;
    log.quranPagesRead = merged.pagesReadToday;
    log.quranCompleted = merged.completedToday;
    log.quranPageTarget = merged.targetPages;
    savePrayerLog(todayKey, log);
  } catch (e) {
    console.error('Failed to save Quran ward position', e);
  }
}

/**
 * Khatma Tracker Storage (رحلة الختمة)
 */
const KHATMA_STORAGE_KEY = 'nur_al_huda_khatma_tracker';

export interface KhatmaTrackerData {
  targetDays: number;
  currentPage: number;
  startDate: string;
  notes?: string;
  updatedAt: number;
}

export function getDefaultKhatma(): KhatmaTrackerData {
  return {
    targetDays: 30,
    currentPage: 1,
    startDate: getTodayDateKey(),
    updatedAt: Date.now(),
  };
}

export function getKhatmaState(): KhatmaTrackerData {
  try {
    const raw = localStorage.getItem(KHATMA_STORAGE_KEY);
    if (!raw) {
      // Sync with today's ward current page if exists
      const wardPos = getQuranWardPosition();
      return {
        ...getDefaultKhatma(),
        currentPage: wardPos.currentPage || 1,
      };
    }
    const parsed = JSON.parse(raw);
    return { ...getDefaultKhatma(), ...parsed };
  } catch {
    return getDefaultKhatma();
  }
}

export function saveKhatmaState(data: Partial<KhatmaTrackerData>): KhatmaTrackerData {
  try {
    const current = getKhatmaState();
    const updated: KhatmaTrackerData = {
      ...current,
      ...data,
      updatedAt: Date.now(),
    };
    localStorage.setItem(KHATMA_STORAGE_KEY, JSON.stringify(updated));

    // Keep Quran Ward in sync if page changed
    if (data.currentPage !== undefined) {
      saveQuranWardPosition({ currentPage: data.currentPage });
    }

    return updated;
  } catch (e) {
    console.error('Failed to save Khatma state', e);
    return getDefaultKhatma();
  }
}
