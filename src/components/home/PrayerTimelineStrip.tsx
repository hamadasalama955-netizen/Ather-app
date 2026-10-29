import React from 'react';
import { Moon, ChevronLeft } from 'lucide-react';
import { PrayerInfo, PrayerTimesResponse } from '../../types';
import { formatArabicTime, cleanTimeString, parseTimeToDate } from '../../utils/prayerUtils';

interface Props {
  dailyPrayers: PrayerInfo[];
  prayerData: PrayerTimesResponse | null;
  is24h: boolean;
  onNavigatePrayers: () => void;
  now: Date;
  isDark?: boolean;
}

export const PrayerTimelineStrip: React.FC<Props> = ({
  dailyPrayers,
  prayerData,
  is24h,
  onNavigatePrayers,
  now,
  isDark = false,
}) => {
  // Extract or compute Midnight and Last Third
  let midnightTimeStr = '12:56 ص';
  let lastThirdTimeStr = '2:54 ص';

  if (prayerData?.timings) {
    const timings = prayerData.timings;
    if (timings.Midnight) {
      midnightTimeStr = formatArabicTime(timings.Midnight, is24h);
    }
    if (timings.Lastthird) {
      lastThirdTimeStr = formatArabicTime(timings.Lastthird, is24h);
    }

    if ((!timings.Midnight || midnightTimeStr === '--:--') && timings.Maghrib && timings.Fajr) {
      const maghribDate = parseTimeToDate(cleanTimeString(timings.Maghrib), now);
      const fajrDate = parseTimeToDate(cleanTimeString(timings.Fajr), now);
      const nextFajr = new Date(fajrDate);
      if (now.getTime() >= maghribDate.getTime()) {
        nextFajr.setDate(nextFajr.getDate() + 1);
      }
      const diff = nextFajr.getTime() - maghribDate.getTime();
      const mid = new Date(maghribDate.getTime() + diff / 2);
      midnightTimeStr = `${mid.getHours() % (is24h ? 24 : 12) || 12}:${mid.getMinutes().toString().padStart(2, '0')} ${mid.getHours() >= 12 ? 'م' : 'ص'}`;
    }

    if ((!timings.Lastthird || lastThirdTimeStr === '--:--') && timings.Maghrib && timings.Fajr) {
      const maghribDate = parseTimeToDate(cleanTimeString(timings.Maghrib), now);
      const fajrDate = parseTimeToDate(cleanTimeString(timings.Fajr), now);
      const nextFajr = new Date(fajrDate);
      if (now.getTime() >= maghribDate.getTime()) {
        nextFajr.setDate(nextFajr.getDate() + 1);
      }
      const diff = nextFajr.getTime() - maghribDate.getTime();
      const third = new Date(maghribDate.getTime() + (diff * 2) / 3);
      lastThirdTimeStr = `${third.getHours() % (is24h ? 24 : 12) || 12}:${third.getMinutes().toString().padStart(2, '0')} ${third.getHours() >= 12 ? 'م' : 'ص'}`;
    }
  }

  // Find daily prayer timings map
  const prayerMap: Record<string, PrayerInfo | undefined> = {};
  dailyPrayers.forEach((p) => {
    prayerMap[p.key] = p;
  });

  // Construct 2-Row Timeline items with 6 prayer times (2 rows of 3 capsules):
  // Row 1 (RTL, right-to-left): الفجر, الشروق, الظهر
  // Row 2 (RTL, right-to-left): العشاء, المغرب, العصر
  // This forms a continuous chronological loop: Fajr -> Sunrise -> Dhuhr -> (curve down) -> Asr -> Maghrib -> Isha
  const fajr = prayerMap['fajr'];
  const sunrise = prayerMap['sunrise'];
  const dhuhr = prayerMap['dhuhr'];
  const asr = prayerMap['asr'];
  const maghrib = prayerMap['maghrib'];
  const isha = prayerMap['isha'];

  const row1 = [
    { key: 'fajr', name: 'الفجر', time: fajr ? formatArabicTime(fajr.time, is24h) : '4:39 ص', isNext: fajr?.isNext },
    { key: 'sunrise', name: 'الشروق', time: sunrise ? formatArabicTime(sunrise.time, is24h) : '6:07 ص', isNext: sunrise?.isNext },
    { key: 'dhuhr', name: 'الظهر', time: dhuhr ? formatArabicTime(dhuhr.time, is24h) : '11:39 ص', isNext: dhuhr?.isNext },
  ];

  const row2 = [
    { key: 'isha', name: 'العشاء', time: isha ? formatArabicTime(isha.time, is24h) : '6:28 م', isNext: isha?.isNext },
    {
      key: 'maghrib',
      name: 'المغرب',
      time: maghrib ? formatArabicTime(maghrib.time, is24h) : '5:10 م',
      // If no prayer marked isNext, highlight Maghrib to match design
      isNext: maghrib?.isNext || (!dailyPrayers.some((p) => p.isNext) ? true : false),
    },
    { key: 'asr', name: 'العصر', time: asr ? formatArabicTime(asr.time, is24h) : '2:46 م', isNext: asr?.isNext },
  ];

  const renderCapsule = (item: { key: string; name: string; time: string; isNext?: boolean }) => {
    const isNext = item.isNext;

    // Dark Mode Styling
    if (isDark) {
      if (isNext) {
        return (
          <div
            key={item.key}
            className="relative flex flex-col items-center justify-center py-3 px-2 rounded-[22px] bg-[#1a1814] border-2 border-[#d4af37] shadow-[0_0_22px_rgba(212,175,55,0.7)] text-center transition-all scale-105 z-20"
          >
            {/* Golden glowing crescent icon */}
            <div className="w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center mb-0.5 shadow-sm">
              <Moon className="w-3 h-3 text-stone-950 fill-stone-950" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#d4af37] leading-tight">{item.name}</span>
            <span className="text-[12px] sm:text-xs font-mono font-black text-white mt-0.5 tracking-tight">{item.time}</span>
          </div>
        );
      }
      return (
        <div
          key={item.key}
          className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-[20px] bg-[#141414] border border-[#d4af37]/20 text-center transition-all hover:border-[#d4af37]/40 shadow-xs"
        >
          <span className="text-xs font-bold text-stone-300">{item.name}</span>
          <span className="text-[11px] sm:text-xs font-mono font-medium text-[#a39e93] mt-0.5">{item.time}</span>
        </div>
      );
    }

    // Light Mode Styling
    if (isNext) {
      return (
        <div
          key={item.key}
          className="relative flex flex-col items-center justify-center py-3 px-2 rounded-[22px] bg-[#2e4426] text-white shadow-[0_4px_16px_rgba(46,68,38,0.3)] text-center transition-all scale-105 z-20 border border-[#d4af37]/50"
        >
          <div className="w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center mb-0.5 shadow-xs">
            <Moon className="w-3 h-3 text-stone-950 fill-stone-950" />
          </div>
          <span className="text-xs sm:text-sm font-black text-[#fef9c3] leading-tight">{item.name}</span>
          <span className="text-[12px] sm:text-xs font-mono font-bold text-white mt-0.5 tracking-tight">{item.time}</span>
        </div>
      );
    }

    return (
      <div
        key={item.key}
        className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-[20px] bg-[#ffffff] border border-stone-200/90 text-center shadow-2xs hover:border-[#2e4426]/30 transition-all"
      >
        <span className="text-xs font-bold text-stone-800">{item.name}</span>
        <span className="text-[11px] sm:text-xs font-mono font-medium text-stone-500 mt-0.5">{item.time}</span>
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-[28px] p-4 sm:p-5 space-y-4 overflow-hidden ${
        isDark
          ? 'bg-[#0e0e0e] border border-[#d4af37]/35 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-[#faf8f5] border border-[#d4af37]/25 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Header matching image_5413513b.png */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onNavigatePrayers}
          className={`px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 ${
            isDark
              ? 'border border-[#d4af37]/40 text-[#d4af37] bg-[#141414] hover:bg-[#1f1d18]'
              : 'border border-[#2e4426]/30 text-[#2e4426] bg-white hover:bg-stone-50 shadow-2xs'
          }`}
        >
          <span>جدول المواقيت</span>
        </button>

        <h3
          className={`text-sm sm:text-base font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#2e4426]'
          }`}
        >
          مواقيت صلوات اليوم
        </h3>
      </div>

      {/* 2-Row Connecting Timeline with Serpentine Curved Path (3 capsules per row) */}
      <div className="relative py-2 px-1" dir="rtl">
        {/* Serpentine Connecting Line SVG connecting capsules */}
        <div className="absolute inset-x-6 inset-y-4 pointer-events-none z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 360 140">
            {/* Top row line running right-to-left, curves down on left, and returns left-to-right */}
            <path
              d="M 310 36 L 50 36 C 20 36, 20 104, 50 104 L 310 104"
              fill="none"
              stroke={isDark ? '#d4af37' : '#c5a059'}
              strokeWidth="2"
              opacity={isDark ? 0.45 : 0.4}
            />
            {/* Start and end decorative dots */}
            <circle cx="310" cy="36" r="3.5" fill={isDark ? '#d4af37' : '#8c6b2d'} />
            <circle cx="310" cy="104" r="3.5" fill={isDark ? '#d4af37' : '#8c6b2d'} />
          </svg>
        </div>

        {/* The 2 Rows of 3 Capsules */}
        <div className="relative z-10 space-y-3">
          {/* Row 1: الفجر, الشروق, الظهر */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {row1.map(renderCapsule)}
          </div>

          {/* Row 2: العشاء, المغرب (active), العصر */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {row2.map(renderCapsule)}
          </div>
        </div>
      </div>

      {/* Night Prayer Full-Width Capsule matching image_5413513b.png */}
      <div
        className={`w-full py-2.5 px-4 rounded-full flex items-center justify-center gap-2 text-xs font-semibold ${
          isDark
            ? 'bg-[#141414] border border-[#d4af37]/30 text-[#d4af37]'
            : 'bg-[#f0ece1] border border-[#d4af37]/25 text-[#2e4426]'
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'}`} />
        <span>منتصف الليل: {midnightTimeStr}</span>
        <span className="opacity-60">•</span>
        <span>الثلث الأخير: {lastThirdTimeStr}</span>
      </div>
    </div>
  );
};
