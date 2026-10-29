import React from 'react';
import { Flame, Trophy, TrendingUp, Award, Calendar, CheckCircle2, Zap } from 'lucide-react';
import { WeeklyAnalytics } from '../../types';

interface Props {
  analytics: WeeklyAnalytics;
}

export const StreakAnalyticsCard: React.FC<Props> = ({ analytics }) => {
  const { streakDays, bestStreakDays, totalPrayersThisWeek, weeklyPercentage, days } = analytics;

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) {
      return 'ابدأ اليوم بداية جديدة مع ربك، وأحب الأعمال إلى الله أدومها وإن قلّ.';
    }
    if (streak <= 3) {
      return 'ما شاء الله! خطوة مباركة في طريق الاستقامة، واصل ثباتك وحافظ على صلاتك.';
    }
    if (streak <= 7) {
      return 'أحسنت! أسبوع من المحافظة والصلة بالله، ثبّتك الله على طاعته وزادك إيماناً.';
    }
    return 'مبارك! هنيئاً لك هذا الثبات والإخبات، نسأل الله لك القبول والدوام على الخير.';
  };

  // Ring calculation
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeOffset = ringCircumference - (ringCircumference * weeklyPercentage) / 100;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/90 dark:border-[#d4af37]/25 p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1. Motivational Bright Flame Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-[#d4af37] text-white p-5 shadow-lg">
        {/* Ambient flame glow particle */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30 animate-pulse">
              <Flame className="w-8 h-8 text-yellow-200 fill-amber-300" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono tabular-nums leading-none tracking-tight">
                  {streakDays}
                </span>
                <span className="text-sm font-extrabold text-amber-100">
                  {streakDays === 1 ? 'يوم متواصل' : 'أيام متتالية'}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>شعلة الالتزام بالصلوات الخمس</span>
              </p>
            </div>
          </div>

          <div className="text-left bg-black/25 px-3.5 py-2 rounded-2xl border border-white/20 backdrop-blur-xs shadow-inner">
            <div className="flex items-center gap-1 text-[11px] text-amber-200 font-bold">
              <Trophy className="w-3.5 h-3.5 text-yellow-300" />
              <span>أطول ستريك</span>
            </div>
            <div className="text-base font-black font-mono tabular-nums text-white mt-0.5">
              {bestStreakDays} أيام
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="relative z-10 mt-3.5 pt-3 border-t border-white/20 text-xs text-white leading-relaxed font-semibold">
          {getMotivationalMessage(streakDays)}
        </div>
      </div>

      {/* 2. Colorful Progress Ring & Weekly Summary Card */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1a1814] border border-stone-200/80 dark:border-[#d4af37]/25 flex items-center justify-between gap-4">
        {/* Info Text */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-stone-900 dark:text-[#d4af37] font-bold text-xs">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span>حلقة الإنجاز الأسبوعي</span>
          </div>
          <h4 className="text-sm font-extrabold text-stone-900 dark:text-white">
            {totalPrayersThisWeek} من أصل 35 صلاة مكتوبة
          </h4>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
            مستوى المحافظة على الفروض خلال السبعة أيام الأخيرة
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-700"
              strokeWidth="8"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#c5a059" />
              </linearGradient>
            </defs>
            {/* Foreground Animated Ring */}
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="8"
              strokeDasharray={ringCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black font-mono tabular-nums text-stone-900 dark:text-white leading-none">
              {weeklyPercentage}%
            </span>
            <span className="text-[9px] font-bold text-[#d4af37]">
              إنجاز
            </span>
          </div>
        </div>
      </div>

      {/* 3. 7 Days Modern Interactive Bar Columns */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
          <span>تفصيل أيام الأسبوع (آخر 7 أيام)</span>
          <span className="text-[11px] text-stone-400">نسبة الالتزام اليومي</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {days.map((day) => {
            const heightPercent = Math.max(12, day.totalScorePercent);
            return (
              <div key={day.dateKey} className="flex flex-col items-center gap-1 text-center">
                <span className="text-[10px] font-mono tabular-nums text-stone-400 font-bold">
                  {day.totalScorePercent}%
                </span>

                <div className="w-full h-24 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 flex flex-col justify-end shadow-inner">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      day.totalScorePercent >= 80
                        ? 'bg-gradient-to-t from-[#c5a059] to-[#d4af37] shadow-sm shadow-[#d4af37]/30'
                        : day.totalScorePercent >= 50
                        ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-sm shadow-amber-500/30'
                        : 'bg-stone-300 dark:bg-stone-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                  {day.dayName}
                </span>

                <span className="text-[9px] font-mono text-stone-400">
                  {day.fardCount}/5
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
