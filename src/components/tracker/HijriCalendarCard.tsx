import React from 'react';
import { Calendar, Moon, Sun, Star, Info, Sliders, Compass, Award, Sparkles } from 'lucide-react';
import { HijriDateInfo } from '../../types';
import {
  HIJRI_MAJOR_OCCASIONS,
  HIJRI_MONTHS_NAMES,
  isWhiteDay,
  isMondayOrThursday,
} from '../../data/hijriOccasionsData';

interface Props {
  hijriDate?: HijriDateInfo;
  hijriAdjustment: number;
  onUpdateAdjustment: (offset: number) => void;
  isDark?: boolean;
}

export const HijriCalendarCard: React.FC<Props> = ({
  hijriDate,
  hijriAdjustment,
  onUpdateAdjustment,
  isDark: propIsDark,
}) => {
  const isDark = propIsDark !== undefined
    ? propIsDark
    : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const today = new Date();
  const rawDay = hijriDate ? parseInt(hijriDate.day, 10) : 15;
  const rawMonthNum = hijriDate ? hijriDate.month.number : 9;
  const rawYear = hijriDate ? hijriDate.year : '1448';

  // Apply local adjustment
  let adjustedDay = rawDay + hijriAdjustment;
  let adjustedMonthNum = rawMonthNum;

  if (adjustedDay < 1) {
    adjustedDay = 29;
    adjustedMonthNum = adjustedMonthNum > 1 ? adjustedMonthNum - 1 : 12;
  } else if (adjustedDay > 30) {
    adjustedDay = 1;
    adjustedMonthNum = adjustedMonthNum < 12 ? adjustedMonthNum + 1 : 1;
  }

  const monthNameAr = HIJRI_MONTHS_NAMES[adjustedMonthNum - 1] || 'رمضان';

  // Fasting checks
  const mondayThursdayInfo = isMondayOrThursday(today);
  const isWhite = isWhiteDay(adjustedDay);
  const isAnyFastDay = mondayThursdayInfo.isFastDay || isWhite;

  // Find nearest upcoming occasions
  const upcomingOccasions = HIJRI_MAJOR_OCCASIONS.filter((occ) => {
    if (occ.hijriMonth > adjustedMonthNum) return true;
    if (occ.hijriMonth === adjustedMonthNum && occ.hijriDay >= adjustedDay) return true;
    return false;
  }).slice(0, 4);

  return (
    <div
      className={`rounded-3xl border p-4 sm:p-5 shadow-sm space-y-4 transition-colors select-none ${
        isDark
          ? 'bg-[#141414] border-[#d4af37]/35 text-white'
          : 'bg-[#faf8f5] border-[#c5a059]/40 text-stone-900'
      }`}
      dir="rtl"
    >
      {/* 1. Celestial Header Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border-2 transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#1a1712] via-[#12110e] to-[#0a0a0a] border-[#d4af37]/45 text-white shadow-xl'
            : 'bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#f4eedd] border-[#ca8a04] text-stone-900 shadow-md'
        }`}
      >
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-[#facc15] tracking-wide">
              <Moon className="w-4 h-4 fill-current" />
              <span>التقويم الهجري الشريف</span>
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isDark ? 'text-[#f5e6b8]' : 'text-stone-950'
              }`}
              style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
            >
              {adjustedDay} {monthNameAr} {rawYear} هـ
            </h3>

            <p className={`text-xs font-medium ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              الموافق {today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${
              isDark
                ? 'bg-[#221f18] border-[#d4af37]/40 text-[#facc15]'
                : 'bg-white border-amber-300 text-amber-700'
            }`}
          >
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Hijri Adjustment Bar */}
        <div className="relative z-10 mt-4 pt-3 border-t border-[#d4af37]/25 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 dark:text-stone-300">
            <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-[#facc15]" />
            <span>معايرة الرؤية المحلية للشهر:</span>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 dark:bg-black/50 p-1 rounded-2xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => onUpdateAdjustment(-1)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                hijriAdjustment === -1
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              -١ يوم
            </button>
            <button
              onClick={() => onUpdateAdjustment(0)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                hijriAdjustment === 0
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              طبيعي
            </button>
            <button
              onClick={() => onUpdateAdjustment(1)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                hijriAdjustment === 1
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              +١ يوم
            </button>
          </div>
        </div>
      </div>

      {/* 2. Fasting Virtue Notification (Sunnah / White Days) */}
      {isAnyFastDay && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#d4af37]/10 to-amber-500/15 border border-[#d4af37]/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0 font-bold">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-[#facc15]" />
          </div>
          <div className="text-xs">
            <div className="font-black text-stone-900 dark:text-[#fef08a]">
              {isWhite ? 'اليوم من الأيام البيض المستحبة للصيام' : 'اليوم سنة مؤكدة لصيام التطوع'}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              «صيام ثلاثة أيام من كل شهر صيام الدهر كله».
            </p>
          </div>
        </div>
      )}

      {/* 3. Upcoming Islamic Occasions List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 px-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-600 dark:text-[#facc15]" />
            <span>المناسبات والمحطات الإسلامية القادمة:</span>
          </div>
          <span className="text-[11px] text-stone-500">سنة {rawYear} هـ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {upcomingOccasions.map((occ, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white dark:bg-[#181818] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1 hover:border-[#d4af37]/50 transition"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-black text-amber-700 dark:text-[#facc15]">
                  {occ.hijriDay} {HIJRI_MONTHS_NAMES[occ.hijriMonth - 1]}
                </span>
                <span className="text-[10px] text-stone-400">{occ.badge || 'مناسبة'}</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {occ.title}
              </h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                {occ.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
