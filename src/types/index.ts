export type NavigationTab = 'home' | 'prayers' | 'tracker' | 'quran' | 'athkar' | 'more' | 'review_prayer' | 'hadith' | 'hisn';

export interface HadithItem {
  id: number;
  number: number;
  text: string;
  explanation: string;
  source: 'رواه البخاري' | 'رواه مسلم' | 'متفق عليه (البخاري ومسلم)';
  category: 'الإيمان والعقيدة' | 'العبادات والذكر' | 'الأخلاق والآداب' | 'المعاملات والحياة' | 'فضائل الأعمال';
  benefit: string;
}

export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerInfo {
  key: PrayerKey;
  arabicName: string;
  time: string; // "HH:mm"
  isNext: boolean;
  isPassed: boolean;
  isCurrent: boolean;
}

export interface CalculationMethod {
  id: number;
  name: string;
  arabicName: string;
  description?: string;
}

export interface LocationConfig {
  type: 'coords' | 'city';
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  label: string;
  isCustom?: boolean;
}

export interface HijriDateInfo {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: string[];
}

export interface GregorianDateInfo {
  date: string;
  day: string;
  weekday: {
    en: string;
    ar?: string;
  };
  month: {
    number: number;
    en: string;
    ar?: string;
  };
  year: string;
}

export interface PrayerTimesResponse {
  timings: Record<string, string>;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDateInfo;
    gregorian: GregorianDateInfo;
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
    };
  };
}

export interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  audio?: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan' | string;
}

export interface AyahDetail {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio?: string;
}

export interface SurahDetailResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AyahDetail[];
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
}

export interface QuranBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
  timestamp: number;
}

export interface AthkarItem {
  id: number;
  category: string;
  text: string;
  description: string;
  count: number;
  reference: string;
}

export interface SebhaRecord {
  phrase: string;
  count: number;
  target: number;
  totalLifetimeCount: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  methodId: number;
  asrSchool: 'standard' | 'hanafi'; // 0 = standard (Shafi/Maliki/Hanbali), 1 = Hanafi
  timeFormat24: boolean;
  soundEnabled: boolean;
  selectedLocation: LocationConfig;
  hijriAdjustment?: number; // -2, -1, 0, +1, +2
}

// Phase 3 Types: Tracking, Streak, Calendar, 99 Names, Duas, Zakat

export interface PrayerLog {
  // 5 Fard Prayers
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;

  // Sunan Rawatib (12 Raka'ah)
  fajrSunnah: boolean;         // 2 raka'ah before Fajr
  dhuhrSunnahBefore: boolean;  // 4 raka'ah before Dhuhr
  dhuhrSunnahAfter: boolean;   // 2 raka'ah after Dhuhr
  maghribSunnah: boolean;      // 2 raka'ah after Maghrib
  ishaSunnah: boolean;         // 2 raka'ah after Isha

  // Nawafil
  duha: boolean;               // Salatul Duha
  witr: boolean;               // Salatul Witr

  // Quran daily ward
  quranPagesRead: number;
  quranPageTarget: number;
  quranCompleted: boolean;
  currentPageNumber: number;

  updatedAt: number;
}

export interface DayStats {
  dateKey: string;             // "YYYY-MM-DD"
  dayName: string;             // "الأحد", "الإثنين"...
  fardCount: number;           // 0 to 5
  sunnahCount: number;         // 0 to 7 (5 rawatib + duha + witr)
  totalScorePercent: number;   // 0 to 100%
  quranCompleted: boolean;
  isToday: boolean;
}

export interface WeeklyAnalytics {
  streakDays: number;
  bestStreakDays: number;
  totalPrayersThisWeek: number;
  weeklyPercentage: number;
  days: DayStats[];
}

export interface AllahName {
  id: number;
  name: string;
  meaning: string;
  reflection: string;
}

export interface DuaItem {
  id: string;
  category: 'quran' | 'morning_evening' | 'distress' | 'sustenance' | 'travel_istikhara' | 'healing';
  categoryTitle: string;
  title: string;
  arabicText: string;
  source: string;
  reward?: string;
  targetCount: number;
}

export interface HijriOccasion {
  id: string;
  hijriMonth: number; // 1-12
  hijriDay: number;
  title: string;
  description: string;
  isFastingRecommended?: boolean;
  badge?: string;
}

export interface ZakatState {
  cash: number;
  goldWeightGrams: number;
  silverWeightGrams: number;
  tradeGoods: number;
  debtsReceivable: number;
  immediateLiabilities: number;
  gold24kGramPrice: number;
  silverGramPrice: number;
  currency: string;
}

export interface MushafPageAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  audio?: string;
  audioUrl?: string;
}

export interface MushafPageData {
  pageNumber: number;
  ayahs: MushafPageAyah[];
  primarySurah: {
    number: number;
    name: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  juz: number;
}

// Khatma Tracker (رحلة الختمة)
export interface KhatmaTrackerState {
  targetDays: number; // e.g. 30, 60, 90, 120
  currentPage: number; // 1 to 604
  startDate: string; // YYYY-MM-DD
  notes?: string;
  updatedAt: number;
}

// Emotional Duas (الذكر حسب الحالة)
export type EmotionalCategory =
  | 'anxiety_distress'    // عند الشعور بالقلق أو الضيق
  | 'grief_relief'        // عند الحزن وطلب الفرج
  | 'sustenance_ease'     // عند طلب الرزق والتيسير
  | 'joy_gratitude'       // عند الفرح والشكر
  | 'fear_hesitation';    // عند الخوف أو التردد (الاستخارة والسكينة)

export interface EmotionalDuaItem {
  id: string;
  category: EmotionalCategory;
  categoryLabel: string;
  feelingTitle: string;
  title: string;
  arabicText: string;
  source: string;
  guidance?: string;
  targetCount: number;
}

