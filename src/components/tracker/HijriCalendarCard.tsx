import React from 'react';
import { Calendar, Moon, Sun, Star, Info, Sparkles, Sliders, Compass, Award } from 'lucide-react';
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
}

export const HijriCalendarCard: React.FC<Props> = ({
  hijriDate,
  hijriAdjustment,
  onUpdateAdjustment,
}) => {
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

  // Check Fasting days
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
    <div className="rounded-3xl bg-[#090e1f] border border-indigo-900/60 p-4 sm:p-5 shadow-xl space-y-4 text-white">
      {/* 1. Main Midnight Navy Celestial Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1838] via-[#112352] to-[#080d1e] text-white p-5 shadow-lg border border-indigo-500/20">
        {/* Subtle Starry Speckles */}
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold mb-1 tracking-wide">
              <Moon className="w-3.5 h-3.5 fill-sky-300/30" />
              <span>التقويم الفلكي الهجري الشريف</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {adjustedDay} {monthNameAr} {rawYear} هـ
            </h3>
            <p className="text-xs text-indigo-200/90 mt-1 font-medium">
              الموافق {today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-indigo-950/80 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Hijri Adjustment Bar with Ivory / Platinum accents */}
        <div className="relative z-10 mt-4 pt-3 border-t border-indigo-800/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-indigo-200">
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>معايرة الرؤية المحلية للشهر:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#070b18] p-0.5 rounded-xl border border-indigo-800/60">
            <button
              onClick={() => onUpdateAdjustment(-1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                hijriAdjustment === -1
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              -1 يوم
            </button>
            <button
              onClick={() => onUpdateAdjustment(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                hijriAdjustment === 0
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              تلقائي (0)
            </button>
            <button
              onClick={() => onUpdateAdjustment(1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                hijriAdjustment === 1
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              +1 يوم
            </button>
          </div>
        </div>
      </div>

      {/* 2. Fasting Days (Ivory / Midnight Navy Contrast Cards) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5 px-0.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>منازل القمر وأيام الصيام المستحبة</span>
        </h4>

        {/* Dynamic Alert if Today is a Sunnah Fasting Day */}
        {isAnyFastDay ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-sky-400/15 to-indigo-950 border border-amber-400/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-200">
                اليوم يوم صيام مستحب بإذن الله!
              </div>
              <p className="text-[11px] text-indigo-100 leading-relaxed">
                {mondayThursdayInfo.isFastDay && (
                  <span>اليوم ({mondayThursdayInfo.dayNameAr}) تُعرض فيه الأعمال على الله تعالى ويستحب صيامه. </span>
                )}
                {isWhite && (
                  <span>اليوم هو ({adjustedDay}) من الأيام البيض، وصيامها كصيام الدهر كله.</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Monday & Thursday Card - Ivory / Celestial Card */}
            <div className="p-3 rounded-2xl bg-[#0f1730] border border-indigo-900/80 space-y-1 hover:border-indigo-700 transition">
              <div className="font-bold text-sky-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>الإثنين والخميس</span>
              </div>
              <p className="text-[10px] text-indigo-300/80 leading-relaxed">
                «تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»
              </p>
            </div>

            {/* White Days Card - Moon phases in Ivory Card */}
            <div className="p-3 rounded-2xl bg-[#0f1730] border border-indigo-900/80 space-y-1 hover:border-indigo-700 transition">
              <div className="font-bold text-amber-200 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span>الأيام البيض (13، 14، 15)</span>
              </div>
              <p className="text-[10px] text-indigo-300/80 leading-relaxed">
                أيام اكتمال البدر ليلة بعد ليلة، وصيامها يعدل صيام الدهر كله.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Upcoming Major Religious Occasions with Ivory Cards */}
      <div className="space-y-2 pt-2 border-t border-indigo-900/60">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-indigo-200">
            أبرز المناسبات الدينية القادمة
          </h4>
          <span className="text-[10px] text-indigo-400 font-medium">تقويم فلكي دقيق</span>
        </div>

        <div className="space-y-2">
          {upcomingOccasions.map((occ) => (
            <div
              key={occ.id}
              className="p-3.5 rounded-2xl bg-[#0f1730]/90 border border-indigo-900/80 hover:border-amber-400/40 transition flex items-start justify-between gap-3 shadow-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {occ.title}
                  </span>
                  {occ.badge && (
                    <span className="text-[10px] font-bold text-amber-200 bg-amber-950/70 border border-amber-600/40 px-2 py-0.5 rounded-full">
                      {occ.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                  {occ.description}
                </p>
              </div>

              <div className="text-left shrink-0">
                <div className="text-xs font-extrabold text-amber-300 font-mono">
                  {occ.hijriDay} {HIJRI_MONTHS_NAMES[occ.hijriMonth - 1]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
