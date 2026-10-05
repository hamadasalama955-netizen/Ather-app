import React from 'react';
import { Clock, Moon, Sparkles, ChevronLeft } from 'lucide-react';
import { PrayerInfo, PrayerTimesResponse } from '../../types';
import { formatArabicTime, cleanTimeString, parseTimeToDate } from '../../utils/prayerUtils';

interface Props {
  dailyPrayers: PrayerInfo[];
  prayerData: PrayerTimesResponse | null;
  is24h: boolean;
  onNavigatePrayers: () => void;
  now: Date;
}

export const PrayerTimelineStrip: React.FC<Props> = ({
  dailyPrayers,
  prayerData,
  is24h,
  onNavigatePrayers,
  now,
}) => {
  // Extract or compute Midnight and Last Third
  let midnightTimeStr = '--:--';
  let lastThirdTimeStr = '--:--';

  if (prayerData?.timings) {
    const timings = prayerData.timings;

    // Aladhan API often provides Midnight and Lastthird directly
    if (timings.Midnight) {
      midnightTimeStr = formatArabicTime(timings.Midnight, is24h);
    }
    if (timings.Lastthird) {
      lastThirdTimeStr = formatArabicTime(timings.Lastthird, is24h);
    }

    // Mathematical computation if missing or fallback
    if (midnightTimeStr === '--:--' && timings.Maghrib && timings.Fajr) {
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

    if (lastThirdTimeStr === '--:--' && timings.Maghrib && timings.Fajr) {
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

  return (
    <div className="rounded-3xl bg-[#fcfbf7] dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-3">
      {/* Strip Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#0d3b2e] dark:text-[#dfb76c]" />
          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            مواقيت صلوات اليوم
          </h3>
        </div>

        <button
          onClick={onNavigatePrayers}
          className="flex items-center gap-1 text-[11px] font-bold text-[#0d3b2e] dark:text-[#dfb76c] hover:underline"
        >
          <span>جدول المواقيت</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Prayers Horizontal Grid (الفجر، الشروق، الظهر، العصر، المغرب، العشاء) */}
      <div className="grid grid-cols-6 gap-1 text-center">
        {dailyPrayers.map((prayer) => {
          const isNext = prayer.isNext;
          const isPassed = prayer.isPassed;

          return (
            <div
              key={prayer.key}
              className={`py-2 px-1 rounded-2xl transition-all duration-200 ${
                isNext
                  ? 'bg-[#0d3b2e] dark:bg-[#dfb76c] text-[#dfb76c] dark:text-[#0b241c] font-bold shadow-md scale-105 ring-1 ring-[#dfb76c]/40'
                  : isPassed
                  ? 'bg-stone-200/40 dark:bg-stone-800/30 text-stone-400 dark:text-stone-500'
                  : 'bg-stone-100/80 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className={`text-[11px] leading-tight ${isNext ? 'font-bold' : 'font-medium'}`}>
                {prayer.arabicName}
              </div>
              <div className="text-[11px] font-mono tabular-nums mt-1 font-semibold">
                {formatArabicTime(prayer.time, is24h).split(' ')[0]}
              </div>
              <div className="text-[9px] opacity-75">
                {formatArabicTime(prayer.time, is24h).split(' ')[1] || ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Night Prayer Capsules (منتصف الليل الشرعي والثلث الأخير) */}
      <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
          <Moon className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>أوقات قيام الليل:</span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
          {/* Midnight Capsule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 text-[11px]">
            <span className="text-stone-500 dark:text-stone-400">منتصف الليل:</span>
            <span className="font-bold text-[#0d3b2e] dark:text-[#dfb76c] font-mono tabular-nums">
              {midnightTimeStr}
            </span>
          </div>

          {/* Last Third Capsule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dfb76c]/15 dark:bg-[#dfb76c]/20 border border-[#dfb76c]/40 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span className="text-[#926a27] dark:text-[#f3d289] font-medium">الثلث الأخير:</span>
            <span className="font-black text-[#7a5518] dark:text-[#dfb76c] font-mono tabular-nums">
              {lastThirdTimeStr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
